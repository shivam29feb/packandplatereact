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

// Create attendance table if it doesn't exist
try {
    $createTableSql = "
        CREATE TABLE IF NOT EXISTS customer_attendance (
            attendance_id INT AUTO_INCREMENT PRIMARY KEY,
            customer_id INT NOT NULL,
            member_id INT NOT NULL,
            date DATE NOT NULL,
            meal_type ENUM('breakfast', 'lunch', 'dinner') NOT NULL,
            status ENUM('present', 'absent', 'late') NOT NULL DEFAULT 'present',
            notes TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE,
            UNIQUE KEY unique_attendance (customer_id, member_id, date, meal_type)
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
        // Get attendance records
        $customerId = isset($_GET['customerId']) ? (int)$_GET['customerId'] : null;
        $memberId = isset($_GET['memberId']) ? (int)$_GET['memberId'] : null;
        $startDate = isset($_GET['startDate']) ? $_GET['startDate'] : date('Y-m-d', strtotime('-30 days'));
        $endDate = isset($_GET['endDate']) ? $_GET['endDate'] : date('Y-m-d');
        
        // Validate input
        if (!$customerId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Customer ID is required']);
            exit();
        }
        
        try {
            $params = [$customerId, $startDate, $endDate];
            $whereClause = "WHERE ca.customer_id = ? AND ca.date BETWEEN ? AND ?";
            
            if ($memberId) {
                $whereClause .= " AND ca.member_id = ?";
                $params[] = $memberId;
            }
            
            $sql = "
                SELECT 
                    ca.attendance_id AS id,
                    ca.customer_id AS customerId,
                    ca.member_id AS memberId,
                    m.full_name AS memberName,
                    ca.date,
                    ca.meal_type AS mealType,
                    ca.status,
                    ca.notes,
                    ca.created_at AS createdAt
                FROM customer_attendance ca
                JOIN member m ON ca.member_id = m.member_id
                $whereClause
                ORDER BY ca.date DESC, FIELD(ca.meal_type, 'breakfast', 'lunch', 'dinner')
            ";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $attendanceRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Format dates
            foreach ($attendanceRecords as &$record) {
                $record['date'] = date('Y-m-d', strtotime($record['date']));
                $record['createdAt'] = date('Y-m-d H:i:s', strtotime($record['createdAt']));
                $record['id'] = (int)$record['id'];
                $record['customerId'] = (int)$record['customerId'];
                $record['memberId'] = (int)$record['memberId'];
            }
            
            echo json_encode([
                'success' => true,
                'data' => $attendanceRecords
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
        break;
        
    case 'POST':
        // Add attendance record
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        // Validate input
        if (!isset($data['customerId']) || !isset($data['memberId']) || !isset($data['date']) || !isset($data['mealType'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Customer ID, Member ID, date, and meal type are required']);
            exit();
        }
        
        $customerId = (int)$data['customerId'];
        $memberId = (int)$data['memberId'];
        $date = $data['date'];
        $mealType = $data['mealType'];
        $status = isset($data['status']) ? $data['status'] : 'present';
        $notes = isset($data['notes']) ? $data['notes'] : '';
        
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
            
            // Check if attendance record already exists
            $checkAttendanceSql = "
                SELECT attendance_id FROM customer_attendance 
                WHERE customer_id = ? AND member_id = ? AND date = ? AND meal_type = ?
            ";
            $checkAttendanceStmt = $pdo->prepare($checkAttendanceSql);
            $checkAttendanceStmt->execute([$customerId, $memberId, $date, $mealType]);
            
            if ($checkAttendanceStmt->rowCount() > 0) {
                // Update existing record
                $updateSql = "
                    UPDATE customer_attendance 
                    SET status = ?, notes = ?
                    WHERE customer_id = ? AND member_id = ? AND date = ? AND meal_type = ?
                ";
                $updateStmt = $pdo->prepare($updateSql);
                $updateStmt->execute([$status, $notes, $customerId, $memberId, $date, $mealType]);
                
                $attendanceId = $checkAttendanceStmt->fetchColumn();
                $message = 'Attendance record updated successfully';
            } else {
                // Insert new record
                $insertSql = "
                    INSERT INTO customer_attendance (customer_id, member_id, date, meal_type, status, notes)
                    VALUES (?, ?, ?, ?, ?, ?)
                ";
                $insertStmt = $pdo->prepare($insertSql);
                $insertStmt->execute([$customerId, $memberId, $date, $mealType, $status, $notes]);
                
                $attendanceId = $pdo->lastInsertId();
                $message = 'Attendance record added successfully';
            }
            
            echo json_encode([
                'success' => true,
                'message' => $message,
                'attendanceId' => (int)$attendanceId
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
