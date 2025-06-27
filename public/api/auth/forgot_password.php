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
$email = $data['email'] ?? '';

// Validate input
if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

try {
    // Check if email exists in users table
    $checkUserSql = "SELECT user_id, user_type FROM users WHERE user_email = ? AND user_status = 'active'";
    $checkUserStmt = $pdo->prepare($checkUserSql);
    $checkUserStmt->execute([$email]);
    $user = $checkUserStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        // Generate reset token
        $resetToken = bin2hex(random_bytes(32));
        $tokenExpire = date('Y-m-d H:i:s', strtotime('+1 hour'));
        
        // Update user with reset token
        $updateUserSql = "
            UPDATE users 
            SET user_verification_token = ?, user_token_expire = ? 
            WHERE user_id = ?
        ";
        
        $updateUserStmt = $pdo->prepare($updateUserSql);
        $updateUserStmt->execute([$resetToken, $tokenExpire, $user['user_id']]);
        
        // If user is a member, also update member table
        if ($user['user_type'] === 'member') {
            $checkMemberSql = "SELECT member_id FROM member WHERE email = ?";
            $checkMemberStmt = $pdo->prepare($checkMemberSql);
            $checkMemberStmt->execute([$email]);
            $member = $checkMemberStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($member) {
                $updateMemberSql = "
                    UPDATE member 
                    SET verification_token = ?, token_expire = ? 
                    WHERE member_id = ?
                ";
                
                $updateMemberStmt = $pdo->prepare($updateMemberSql);
                $updateMemberStmt->execute([$resetToken, $tokenExpire, $member['member_id']]);
            }
        }
        
        // In a real application, you would send a password reset email here
        // For now, we'll just return success with the token for testing
        
        echo json_encode([
            'success' => true,
            'message' => 'Password reset instructions sent to your email',
            'debug' => [
                'token' => $resetToken,
                'email' => $email
            ]
        ]);
    } else {
        // Check if email exists in member table (for backward compatibility)
        $checkMemberSql = "SELECT member_id FROM member WHERE email = ? AND status = 'active'";
        $checkMemberStmt = $pdo->prepare($checkMemberSql);
        $checkMemberStmt->execute([$email]);
        $member = $checkMemberStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($member) {
            // Generate reset token
            $resetToken = bin2hex(random_bytes(32));
            $tokenExpire = date('Y-m-d H:i:s', strtotime('+1 hour'));
            
            // Update member with reset token
            $updateMemberSql = "
                UPDATE member 
                SET verification_token = ?, token_expire = ? 
                WHERE member_id = ?
            ";
            
            $updateMemberStmt = $pdo->prepare($updateMemberSql);
            $updateMemberStmt->execute([$resetToken, $tokenExpire, $member['member_id']]);
            
            // In a real application, you would send a password reset email here
            // For now, we'll just return success with the token for testing
            
            echo json_encode([
                'success' => true,
                'message' => 'Password reset instructions sent to your email',
                'debug' => [
                    'token' => $resetToken,
                    'email' => $email
                ]
            ]);
        } else {
            // Don't reveal that the email doesn't exist for security reasons
            echo json_encode([
                'success' => true,
                'message' => 'If your email is registered, you will receive password reset instructions'
            ]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
