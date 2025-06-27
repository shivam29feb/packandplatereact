<?php
$allowed_origins = array(
    "http://localhost:3000",
    "http://packandplate29febreact.rf.gd"
);

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $origin);
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Include database connection
require_once __DIR__ . '/../../../src/config/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Decode JSON input
$raw_input = file_get_contents("php://input");
$data = json_decode($raw_input, true);

// Extract data
$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$firstName = $data['firstName'] ?? '';
$lastName = $data['lastName'] ?? '';
$userType = $data['userType'] ?? 'customer';
$businessName = $data['businessName'] ?? '';
$phone = $data['phone'] ?? '';
$address = $data['address'] ?? '';

// Validate input
if (empty($username) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Username, email, and password are required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Validate user type
$allowedUserTypes = ['customer', 'member'];
if (!in_array($userType, $allowedUserTypes)) {
    echo json_encode(['success' => false, 'message' => 'Invalid user type']);
    exit;
}

// Additional validation for member type
if ($userType === 'member' && empty($businessName)) {
    echo json_encode(['success' => false, 'message' => 'Business name is required for member registration']);
    exit;
}

try {
    // Start transaction
    $pdo->beginTransaction();
    
    // Check if email already exists
    $checkEmailStmt = $pdo->prepare("SELECT user_id FROM users WHERE user_email = ?");
    $checkEmailStmt->execute([$email]);
    
    if ($checkEmailStmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        exit;
    }
    
    // Check if username already exists
    $checkUsernameStmt = $pdo->prepare("SELECT user_id FROM users WHERE user_username = ?");
    $checkUsernameStmt->execute([$username]);
    
    if ($checkUsernameStmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Username already exists']);
        exit;
    }
    
    // Hash password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Generate verification token
    $verificationToken = bin2hex(random_bytes(32));
    $tokenExpire = date('Y-m-d H:i:s', strtotime('+24 hours'));
    
    // Insert user
    $insertUserSql = "
        INSERT INTO users (
            user_username, user_email, user_password_hash, user_type, 
            user_status, user_verification_token, user_token_expire
        ) VALUES (?, ?, ?, ?, 'pending', ?, ?)
    ";
    
    $insertUserStmt = $pdo->prepare($insertUserSql);
    $insertUserStmt->execute([
        $username,
        $email,
        $passwordHash,
        $userType,
        $verificationToken,
        $tokenExpire
    ]);
    
    $userId = $pdo->lastInsertId();
    
    // Create profile based on user type
    if ($userType === 'customer') {
        $fullName = trim("$firstName $lastName");
        
        $insertProfileSql = "
            INSERT INTO customer_profiles (
                user_id, full_name, phone_number, address
            ) VALUES (?, ?, ?, ?)
        ";
        
        $insertProfileStmt = $pdo->prepare($insertProfileSql);
        $insertProfileStmt->execute([
            $userId,
            $fullName,
            $phone,
            $address
        ]);
    } else if ($userType === 'member') {
        $fullName = trim("$firstName $lastName");
        
        // Also insert into member table for backward compatibility
        $insertMemberSql = "
            INSERT INTO member (
                full_name, email, phone_number, address, 
                business_name, password_hash, status, verification_token, token_expire
            ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
        ";
        
        $insertMemberStmt = $pdo->prepare($insertMemberSql);
        $insertMemberStmt->execute([
            $fullName,
            $email,
            $phone,
            $address,
            $businessName,
            $passwordHash,
            $verificationToken,
            $tokenExpire
        ]);
        
        $memberId = $pdo->lastInsertId();
        
        // Update the member_id in dishes table
        $updateDishesStmt = $pdo->prepare("UPDATE dishes SET member_id = ? WHERE member_id = ?");
        $updateDishesStmt->execute([$memberId, $userId]);
        
        // Insert into member_profiles
        $insertProfileSql = "
            INSERT INTO member_profiles (
                user_id, full_name, phone_number, address, business_name
            ) VALUES (?, ?, ?, ?, ?)
        ";
        
        $insertProfileStmt = $pdo->prepare($insertProfileSql);
        $insertProfileStmt->execute([
            $userId,
            $fullName,
            $phone,
            $address,
            $businessName
        ]);
    }
    
    // Create user settings
    $insertSettingsSql = "
        INSERT INTO user_settings (user_id) VALUES (?)
    ";
    
    $insertSettingsStmt = $pdo->prepare($insertSettingsSql);
    $insertSettingsStmt->execute([$userId]);
    
    // Commit transaction
    $pdo->commit();
    
    // In a real application, you would send a verification email here
    // For now, we'll just return success
    
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful. Please check your email to verify your account.',
        'userId' => $userId
    ]);
    
} catch (PDOException $e) {
    // Rollback transaction on error
    $pdo->rollBack();
    
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
