<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include database connection
require_once '../connection.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get member ID from query string or JSON input
$memberId = null;
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $memberId = isset($_GET['memberId']) ? (int)$_GET['memberId'] : null;
} else {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $memberId = isset($data['memberId']) ? (int)$data['memberId'] : null;
}

// Validate member ID
if (!$memberId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Member ID is required']);
    exit();
}

try {
    // Check if member exists
    $checkMemberSql = "SELECT member_id FROM member WHERE member_id = ?";
    $checkMemberStmt = $pdo->prepare($checkMemberSql);
    $checkMemberStmt->execute([$memberId]);
    
    if ($checkMemberStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Member not found']);
        exit();
    }
    
    // Handle different HTTP methods
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            // Get customers for this member
            $customersQuery = "
                SELECT 
                    u.user_id AS id,
                    u.user_username AS username,
                    u.user_email AS email,
                    u.user_created_at AS createdAt,
                    cp.full_name AS fullName,
                    cp.phone_number AS phone,
                    cp.address,
                    (SELECT COUNT(*) FROM orders WHERE customer_id = u.user_id) AS orderCount,
                    (SELECT SUM(total_amount) FROM orders WHERE customer_id = u.user_id) AS totalSpent
                FROM users u
                LEFT JOIN customer_profiles cp ON u.user_id = cp.user_id
                WHERE u.user_type = 'customer'
                AND EXISTS (
                    SELECT 1 FROM orders o
                    JOIN order_items oi ON o.order_id = oi.order_id
                    JOIN dishes d ON oi.dish_id = d.dish_id
                    WHERE o.customer_id = u.user_id
                    AND d.member_id = ?
                )
                ORDER BY u.user_created_at DESC
            ";
            
            $customersStmt = $pdo->prepare($customersQuery);
            $customersStmt->execute([$memberId]);
            $customers = $customersStmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Format dates and convert numeric values
            foreach ($customers as &$customer) {
                if ($customer['createdAt']) {
                    $customer['createdAt'] = date('Y-m-d', strtotime($customer['createdAt']));
                }
                
                $customer['id'] = (int)$customer['id'];
                $customer['orderCount'] = (int)$customer['orderCount'];
                $customer['totalSpent'] = $customer['totalSpent'] ? (float)$customer['totalSpent'] : 0;
            }
            
            echo json_encode([
                'success' => true,
                'data' => $customers
            ]);
            break;
            
        case 'POST':
            // Create a new customer
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            
            // Validate input
            if (!isset($data['username']) || !isset($data['email']) || !isset($data['password']) || !isset($data['fullName'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Username, email, password, and full name are required']);
                exit();
            }
            
            // Start transaction
            $pdo->beginTransaction();
            
            // Check if username or email already exists
            $checkUserSql = "SELECT user_id FROM users WHERE user_username = ? OR user_email = ?";
            $checkUserStmt = $pdo->prepare($checkUserSql);
            $checkUserStmt->execute([$data['username'], $data['email']]);
            
            if ($checkUserStmt->rowCount() > 0) {
                $pdo->rollBack();
                http_response_code(409);
                echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
                exit();
            }
            
            // Hash password
            $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
            
            // Insert user
            $insertUserSql = "
                INSERT INTO users (
                    user_username, user_email, user_password_hash, user_type, user_status
                ) VALUES (?, ?, ?, 'customer', 'active')
            ";
            
            $insertUserStmt = $pdo->prepare($insertUserSql);
            $insertUserStmt->execute([
                $data['username'],
                $data['email'],
                $passwordHash
            ]);
            
            $userId = $pdo->lastInsertId();
            
            // Insert customer profile
            $insertProfileSql = "
                INSERT INTO customer_profiles (
                    user_id, full_name, phone_number, address, dietary_preferences
                ) VALUES (?, ?, ?, ?, ?)
            ";
            
            $insertProfileStmt = $pdo->prepare($insertProfileSql);
            $insertProfileStmt->execute([
                $userId,
                $data['fullName'],
                $data['phone'] ?? '',
                $data['address'] ?? '',
                $data['dietaryPreferences'] ?? ''
            ]);
            
            // Commit transaction
            $pdo->commit();
            
            echo json_encode([
                'success' => true,
                'message' => 'Customer created successfully',
                'customerId' => $userId
            ]);
            break;
            
        case 'PUT':
            // Update an existing customer
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            
            // Validate input
            if (!isset($data['customerId']) || empty($data['customerId'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Customer ID is required']);
                exit();
            }
            
            $customerId = (int)$data['customerId'];
            
            // Start transaction
            $pdo->beginTransaction();
            
            // Check if customer exists
            $checkCustomerSql = "
                SELECT u.user_id 
                FROM users u
                WHERE u.user_id = ? 
                AND u.user_type = 'customer'
                AND EXISTS (
                    SELECT 1 FROM orders o
                    JOIN order_items oi ON o.order_id = oi.order_id
                    JOIN dishes d ON oi.dish_id = d.dish_id
                    WHERE o.customer_id = u.user_id
                    AND d.member_id = ?
                )
            ";
            
            $checkCustomerStmt = $pdo->prepare($checkCustomerSql);
            $checkCustomerStmt->execute([$customerId, $memberId]);
            
            if ($checkCustomerStmt->rowCount() === 0) {
                $pdo->rollBack();
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Customer not found or not associated with this member']);
                exit();
            }
            
            // Update user fields if provided
            $updateUserFields = [];
            $updateUserParams = [];
            
            if (isset($data['username']) && !empty($data['username'])) {
                // Check if username is already taken by another user
                $checkUsernameSql = "SELECT user_id FROM users WHERE user_username = ? AND user_id != ?";
                $checkUsernameStmt = $pdo->prepare($checkUsernameSql);
                $checkUsernameStmt->execute([$data['username'], $customerId]);
                
                if ($checkUsernameStmt->rowCount() > 0) {
                    $pdo->rollBack();
                    http_response_code(409);
                    echo json_encode(['success' => false, 'message' => 'Username already taken']);
                    exit();
                }
                
                $updateUserFields[] = "user_username = ?";
                $updateUserParams[] = $data['username'];
            }
            
            if (isset($data['email']) && !empty($data['email'])) {
                // Check if email is already taken by another user
                $checkEmailSql = "SELECT user_id FROM users WHERE user_email = ? AND user_id != ?";
                $checkEmailStmt = $pdo->prepare($checkEmailSql);
                $checkEmailStmt->execute([$data['email'], $customerId]);
                
                if ($checkEmailStmt->rowCount() > 0) {
                    $pdo->rollBack();
                    http_response_code(409);
                    echo json_encode(['success' => false, 'message' => 'Email already taken']);
                    exit();
                }
                
                $updateUserFields[] = "user_email = ?";
                $updateUserParams[] = $data['email'];
            }
            
            // Update user if there are fields to update
            if (!empty($updateUserFields)) {
                $updateUserParams[] = $customerId;
                $updateUserSql = "UPDATE users SET " . implode(", ", $updateUserFields) . " WHERE user_id = ?";
                $updateUserStmt = $pdo->prepare($updateUserSql);
                $updateUserStmt->execute($updateUserParams);
            }
            
            // Update profile fields if provided
            $updateProfileFields = [];
            $updateProfileParams = [];
            
            if (isset($data['fullName']) && !empty($data['fullName'])) {
                $updateProfileFields[] = "full_name = ?";
                $updateProfileParams[] = $data['fullName'];
            }
            
            if (isset($data['phone'])) {
                $updateProfileFields[] = "phone_number = ?";
                $updateProfileParams[] = $data['phone'];
            }
            
            if (isset($data['address'])) {
                $updateProfileFields[] = "address = ?";
                $updateProfileParams[] = $data['address'];
            }
            
            if (isset($data['dietaryPreferences'])) {
                $updateProfileFields[] = "dietary_preferences = ?";
                $updateProfileParams[] = $data['dietaryPreferences'];
            }
            
            // Update profile if there are fields to update
            if (!empty($updateProfileFields)) {
                $updateProfileParams[] = $customerId;
                
                // Check if profile exists
                $checkProfileSql = "SELECT profile_id FROM customer_profiles WHERE user_id = ?";
                $checkProfileStmt = $pdo->prepare($checkProfileSql);
                $checkProfileStmt->execute([$customerId]);
                
                if ($checkProfileStmt->rowCount() > 0) {
                    // Update existing profile
                    $updateProfileSql = "UPDATE customer_profiles SET " . implode(", ", $updateProfileFields) . " WHERE user_id = ?";
                    $updateProfileStmt = $pdo->prepare($updateProfileSql);
                    $updateProfileStmt->execute($updateProfileParams);
                } else {
                    // Create new profile
                    $insertProfileSql = "
                        INSERT INTO customer_profiles (
                            user_id, full_name, phone_number, address, dietary_preferences
                        ) VALUES (?, ?, ?, ?, ?)
                    ";
                    
                    $insertProfileStmt = $pdo->prepare($insertProfileSql);
                    $insertProfileStmt->execute([
                        $customerId,
                        $data['fullName'] ?? '',
                        $data['phone'] ?? '',
                        $data['address'] ?? '',
                        $data['dietaryPreferences'] ?? ''
                    ]);
                }
            }
            
            // Update password if provided
            if (isset($data['password']) && !empty($data['password'])) {
                $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
                
                $updatePasswordSql = "UPDATE users SET user_password_hash = ? WHERE user_id = ?";
                $updatePasswordStmt = $pdo->prepare($updatePasswordSql);
                $updatePasswordStmt->execute([$passwordHash, $customerId]);
            }
            
            // Commit transaction
            $pdo->commit();
            
            echo json_encode([
                'success' => true,
                'message' => 'Customer updated successfully'
            ]);
            break;
            
        case 'DELETE':
            // Delete a customer (or deactivate)
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            
            // Validate input
            if (!isset($data['customerId']) || empty($data['customerId'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Customer ID is required']);
                exit();
            }
            
            $customerId = (int)$data['customerId'];
            
            // Check if customer exists and is associated with this member
            $checkCustomerSql = "
                SELECT u.user_id 
                FROM users u
                WHERE u.user_id = ? 
                AND u.user_type = 'customer'
                AND EXISTS (
                    SELECT 1 FROM orders o
                    JOIN order_items oi ON o.order_id = oi.order_id
                    JOIN dishes d ON oi.dish_id = d.dish_id
                    WHERE o.customer_id = u.user_id
                    AND d.member_id = ?
                )
            ";
            
            $checkCustomerStmt = $pdo->prepare($checkCustomerSql);
            $checkCustomerStmt->execute([$customerId, $memberId]);
            
            if ($checkCustomerStmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Customer not found or not associated with this member']);
                exit();
            }
            
            // Instead of deleting, deactivate the customer
            $deactivateUserSql = "UPDATE users SET user_status = 'suspended' WHERE user_id = ?";
            $deactivateUserStmt = $pdo->prepare($deactivateUserSql);
            $deactivateUserStmt->execute([$customerId]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Customer deactivated successfully'
            ]);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
} catch (PDOException $e) {
    // Rollback transaction if active
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
