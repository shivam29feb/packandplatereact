<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include database connection
require_once '../connection.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Create feedback table if it doesn't exist
try {
    $createTableSql = "
        CREATE TABLE IF NOT EXISTS customer_feedback (
            feedback_id INT AUTO_INCREMENT PRIMARY KEY,
            customer_id INT NOT NULL,
            member_id INT NOT NULL,
            rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
            feedback_type ENUM('food', 'service', 'cleanliness', 'general') NOT NULL DEFAULT 'general',
            comment TEXT,
            is_anonymous BOOLEAN DEFAULT FALSE,
            is_resolved BOOLEAN DEFAULT FALSE,
            resolved_by INT,
            resolved_at DATETIME,
            resolution_comment TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE,
            FOREIGN KEY (resolved_by) REFERENCES users(user_id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ";
    
    $pdo->exec($createTableSql);
} catch (PDOException $e) {
    // Table might already exist or there's another issue
    // We'll continue with the rest of the code
}

// Handle different HTTP methods
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get feedback records
        $customerId = isset($_GET['customerId']) ? (int)$_GET['customerId'] : null;
        $memberId = isset($_GET['memberId']) ? (int)$_GET['memberId'] : null;
        $isResolved = isset($_GET['isResolved']) ? filter_var($_GET['isResolved'], FILTER_VALIDATE_BOOLEAN) : null;
        
        try {
            $params = [];
            $whereConditions = [];
            
            if ($customerId) {
                $whereConditions[] = "cf.customer_id = ?";
                $params[] = $customerId;
            }
            
            if ($memberId) {
                $whereConditions[] = "cf.member_id = ?";
                $params[] = $memberId;
            }
            
            if ($isResolved !== null) {
                $whereConditions[] = "cf.is_resolved = ?";
                $params[] = $isResolved ? 1 : 0;
            }
            
            $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
            
            $sql = "
                SELECT 
                    cf.feedback_id AS id,
                    cf.customer_id AS customerId,
                    CASE WHEN cf.is_anonymous = 1 THEN 'Anonymous' ELSE u.user_username END AS customerName,
                    cf.member_id AS memberId,
                    m.full_name AS memberName,
                    cf.rating,
                    cf.feedback_type AS feedbackType,
                    cf.comment,
                    cf.is_anonymous AS isAnonymous,
                    cf.is_resolved AS isResolved,
                    cf.resolved_by AS resolvedBy,
                    ru.user_username AS resolvedByName,
                    cf.resolved_at AS resolvedAt,
                    cf.resolution_comment AS resolutionComment,
                    cf.created_at AS createdAt
                FROM customer_feedback cf
                JOIN users u ON cf.customer_id = u.user_id
                JOIN member m ON cf.member_id = m.member_id
                LEFT JOIN users ru ON cf.resolved_by = ru.user_id
                $whereClause
                ORDER BY cf.created_at DESC
            ";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $feedbackRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Format dates and convert numeric values
            foreach ($feedbackRecords as &$record) {
                $record['createdAt'] = date('Y-m-d H:i:s', strtotime($record['createdAt']));
                if ($record['resolvedAt']) {
                    $record['resolvedAt'] = date('Y-m-d H:i:s', strtotime($record['resolvedAt']));
                }
                
                $record['id'] = (int)$record['id'];
                $record['customerId'] = (int)$record['customerId'];
                $record['memberId'] = (int)$record['memberId'];
                $record['rating'] = (int)$record['rating'];
                $record['isAnonymous'] = (bool)$record['isAnonymous'];
                $record['isResolved'] = (bool)$record['isResolved'];
                if ($record['resolvedBy']) {
                    $record['resolvedBy'] = (int)$record['resolvedBy'];
                }
            }
            
            echo json_encode([
                'success' => true,
                'data' => $feedbackRecords
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    case 'POST':
        // Add feedback record
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        // Validate input
        if (!isset($data['customerId']) || !isset($data['memberId']) || !isset($data['rating']) || !isset($data['feedbackType'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Customer ID, Member ID, rating, and feedback type are required']);
            exit();
        }
        
        $customerId = (int)$data['customerId'];
        $memberId = (int)$data['memberId'];
        $rating = (int)$data['rating'];
        $feedbackType = $data['feedbackType'];
        $comment = isset($data['comment']) ? $data['comment'] : '';
        $isAnonymous = isset($data['isAnonymous']) ? (bool)$data['isAnonymous'] : false;
        
        // Validate rating
        if ($rating < 1 || $rating > 5) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Rating must be between 1 and 5']);
            exit();
        }
        
        try {
            // Check if customer exists
            $checkCustomerSql = "SELECT user_id FROM users WHERE user_id = ? AND user_type = 'customer'";
            $checkCustomerStmt = $pdo->prepare($checkCustomerSql);
            $checkCustomerStmt->execute([$customerId]);
            
            if ($checkCustomerStmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Customer not found']);
                exit();
            }
            
            // Check if member exists
            $checkMemberSql = "SELECT member_id FROM member WHERE member_id = ?";
            $checkMemberStmt = $pdo->prepare($checkMemberSql);
            $checkMemberStmt->execute([$memberId]);
            
            if ($checkMemberStmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Member not found']);
                exit();
            }
            
            // Insert feedback
            $insertSql = "
                INSERT INTO customer_feedback (
                    customer_id, member_id, rating, feedback_type, comment, is_anonymous
                ) VALUES (?, ?, ?, ?, ?, ?)
            ";
            $insertStmt = $pdo->prepare($insertSql);
            $insertStmt->execute([
                $customerId,
                $memberId,
                $rating,
                $feedbackType,
                $comment,
                $isAnonymous ? 1 : 0
            ]);
            
            $feedbackId = $pdo->lastInsertId();
            
            echo json_encode([
                'success' => true,
                'message' => 'Feedback submitted successfully',
                'feedbackId' => (int)$feedbackId
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>
