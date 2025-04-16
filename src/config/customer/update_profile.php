<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include database connection
require_once '../connection.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST or PATCH requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate input
if (!isset($data['userId']) || empty($data['userId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit();
}

$userId = (int)$data['userId'];

try {
    // Start transaction
    $pdo->beginTransaction();
    
    // Check if user exists
    $checkUserSql = "SELECT user_id FROM users WHERE user_id = ? AND user_type = 'customer'";
    $checkUserStmt = $pdo->prepare($checkUserSql);
    $checkUserStmt->execute([$userId]);
    
    if ($checkUserStmt->rowCount() === 0) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Customer not found']);
        exit();
    }
    
    // Check if profile exists
    $checkProfileSql = "SELECT profile_id FROM customer_profiles WHERE user_id = ?";
    $checkProfileStmt = $pdo->prepare($checkProfileSql);
    $checkProfileStmt->execute([$userId]);
    $profileExists = $checkProfileStmt->rowCount() > 0;
    
    // Update or insert profile
    if ($profileExists) {
        // Build update query
        $updateFields = [];
        $updateParams = [];
        
        // Update fields if provided
        if (isset($data['fullName']) && !empty($data['fullName'])) {
            $updateFields[] = "full_name = ?";
            $updateParams[] = $data['fullName'];
        }
        
        if (isset($data['phone']) && !empty($data['phone'])) {
            $updateFields[] = "phone_number = ?";
            $updateParams[] = $data['phone'];
        }
        
        if (isset($data['address'])) {
            $updateFields[] = "address = ?";
            $updateParams[] = $data['address'];
        }
        
        if (isset($data['dietaryPreferences'])) {
            $updateFields[] = "dietary_preferences = ?";
            $updateParams[] = $data['dietaryPreferences'];
        }
        
        // If no fields to update, skip update
        if (!empty($updateFields)) {
            // Add user ID to params
            $updateParams[] = $userId;
            
            // Update profile
            $updateProfileSql = "UPDATE customer_profiles SET " . implode(", ", $updateFields) . " WHERE user_id = ?";
            $updateProfileStmt = $pdo->prepare($updateProfileSql);
            $updateProfileStmt->execute($updateParams);
        }
    } else {
        // Insert new profile
        $fullName = $data['fullName'] ?? '';
        $phone = $data['phone'] ?? '';
        $address = $data['address'] ?? '';
        $dietaryPreferences = $data['dietaryPreferences'] ?? '';
        
        $insertProfileSql = "
            INSERT INTO customer_profiles (
                user_id, full_name, phone_number, address, dietary_preferences
            ) VALUES (?, ?, ?, ?, ?)
        ";
        
        $insertProfileStmt = $pdo->prepare($insertProfileSql);
        $insertProfileStmt->execute([
            $userId,
            $fullName,
            $phone,
            $address,
            $dietaryPreferences
        ]);
    }
    
    // Update user fields if provided
    $updateUserFields = [];
    $updateUserParams = [];
    
    if (isset($data['username']) && !empty($data['username'])) {
        // Check if username is already taken
        $checkUsernameSql = "SELECT user_id FROM users WHERE user_username = ? AND user_id != ?";
        $checkUsernameStmt = $pdo->prepare($checkUsernameSql);
        $checkUsernameStmt->execute([$data['username'], $userId]);
        
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
        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid email format']);
            exit();
        }
        
        // Check if email is already taken
        $checkEmailSql = "SELECT user_id FROM users WHERE user_email = ? AND user_id != ?";
        $checkEmailStmt = $pdo->prepare($checkEmailSql);
        $checkEmailStmt->execute([$data['email'], $userId]);
        
        if ($checkEmailStmt->rowCount() > 0) {
            $pdo->rollBack();
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Email already taken']);
            exit();
        }
        
        $updateUserFields[] = "user_email = ?";
        $updateUserParams[] = $data['email'];
    }
    
    // If no fields to update, skip update
    if (!empty($updateUserFields)) {
        // Add user ID to params
        $updateUserParams[] = $userId;
        
        // Update user
        $updateUserSql = "UPDATE users SET " . implode(", ", $updateUserFields) . " WHERE user_id = ?";
        $updateUserStmt = $pdo->prepare($updateUserSql);
        $updateUserStmt->execute($updateUserParams);
    }
    
    // Commit transaction
    $pdo->commit();
    
    // Get updated profile
    $profileSql = "
        SELECT 
            u.user_id AS id,
            u.user_username AS username,
            u.user_email AS email,
            cp.full_name AS fullName,
            cp.phone_number AS phone,
            cp.address,
            cp.dietary_preferences AS dietaryPreferences
        FROM users u
        LEFT JOIN customer_profiles cp ON u.user_id = cp.user_id
        WHERE u.user_id = ?
    ";
    
    $profileStmt = $pdo->prepare($profileSql);
    $profileStmt->execute([$userId]);
    $profile = $profileStmt->fetch(PDO::FETCH_ASSOC);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully',
        'data' => $profile
    ]);
    
} catch (PDOException $e) {
    // Rollback transaction
    $pdo->rollBack();
    
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
