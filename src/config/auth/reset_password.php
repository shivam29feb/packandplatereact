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
require_once __DIR__ . '/../connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Decode JSON input
$raw_input = file_get_contents("php://input");
$data = json_decode($raw_input, true);

// Extract data
$token = $data['token'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$confirmPassword = $data['confirmPassword'] ?? '';

// Validate input
if (empty($token) || empty($email) || empty($password) || empty($confirmPassword)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Validate password
if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long']);
    exit;
}

// Validate password confirmation
if ($password !== $confirmPassword) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
    exit;
}

try {
    // Start transaction
    $pdo->beginTransaction();
    
    // Check if token is valid for users table
    $checkUserSql = "
        SELECT user_id, user_type 
        FROM users 
        WHERE user_email = ? 
        AND user_verification_token = ? 
        AND user_token_expire > NOW()
    ";
    
    $checkUserStmt = $pdo->prepare($checkUserSql);
    $checkUserStmt->execute([$email, $token]);
    $user = $checkUserStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        // Hash new password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        // Update user password
        $updateUserSql = "
            UPDATE users 
            SET user_password_hash = ?, user_verification_token = NULL, user_token_expire = NULL 
            WHERE user_id = ?
        ";
        
        $updateUserStmt = $pdo->prepare($updateUserSql);
        $updateUserStmt->execute([$passwordHash, $user['user_id']]);
        
        // If user is a member, also update member table
        if ($user['user_type'] === 'member') {
            $checkMemberSql = "
                SELECT member_id 
                FROM member 
                WHERE email = ?
            ";
            
            $checkMemberStmt = $pdo->prepare($checkMemberSql);
            $checkMemberStmt->execute([$email]);
            $member = $checkMemberStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($member) {
                $updateMemberSql = "
                    UPDATE member 
                    SET password_hash = ?, verification_token = NULL, token_expire = NULL 
                    WHERE member_id = ?
                ";
                
                $updateMemberStmt = $pdo->prepare($updateMemberSql);
                $updateMemberStmt->execute([$passwordHash, $member['member_id']]);
            }
        }
        
        // Commit transaction
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Password reset successfully. You can now log in with your new password.'
        ]);
    } else {
        // Check if token is valid for member table (for backward compatibility)
        $checkMemberSql = "
            SELECT member_id 
            FROM member 
            WHERE email = ? 
            AND verification_token = ? 
            AND token_expire > NOW()
        ";
        
        $checkMemberStmt = $pdo->prepare($checkMemberSql);
        $checkMemberStmt->execute([$email, $token]);
        $member = $checkMemberStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($member) {
            // Hash new password
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            // Update member password
            $updateMemberSql = "
                UPDATE member 
                SET password_hash = ?, verification_token = NULL, token_expire = NULL 
                WHERE member_id = ?
            ";
            
            $updateMemberStmt = $pdo->prepare($updateMemberSql);
            $updateMemberStmt->execute([$passwordHash, $member['member_id']]);
            
            // Commit transaction
            $pdo->commit();
            
            echo json_encode([
                'success' => true,
                'message' => 'Password reset successfully. You can now log in with your new password.'
            ]);
        } else {
            // Rollback transaction
            $pdo->rollBack();
            
            echo json_encode([
                'success' => false,
                'message' => 'Invalid or expired reset token'
            ]);
        }
    }
} catch (PDOException $e) {
    // Rollback transaction
    $pdo->rollBack();
    
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
