<?php
$allowed_origins = array(
    "http://localhost:3000",
    "http://packandplate29febreact.rf.gd"
);

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $origin);
}

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Include database connection
require_once __DIR__ . '/../../../src/config/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get token from query string
$token = $_GET['token'] ?? '';
$email = $_GET['email'] ?? '';

// Validate input
if (empty($token) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Token and email are required']);
    exit;
}

try {
    // Check if token is valid for users table
    $checkUserSql = "
        SELECT user_id, user_type 
        FROM users 
        WHERE user_email = ? 
        AND user_verification_token = ? 
        AND user_token_expire > NOW() 
        AND user_status = 'pending'
    ";
    
    $checkUserStmt = $pdo->prepare($checkUserSql);
    $checkUserStmt->execute([$email, $token]);
    $user = $checkUserStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        // Start transaction
        $pdo->beginTransaction();
        
        // Activate user
        $activateUserSql = "
            UPDATE users 
            SET user_status = 'active', user_verification_token = NULL, user_token_expire = NULL 
            WHERE user_id = ?
        ";
        
        $activateUserStmt = $pdo->prepare($activateUserSql);
        $activateUserStmt->execute([$user['user_id']]);
        
        // If user is a member, also update member table
        if ($user['user_type'] === 'member') {
            $checkMemberSql = "
                SELECT member_id 
                FROM member 
                WHERE email = ? 
                AND verification_token = ? 
                AND token_expire > NOW() 
                AND status = 'pending'
            ";
            
            $checkMemberStmt = $pdo->prepare($checkMemberSql);
            $checkMemberStmt->execute([$email, $token]);
            $member = $checkMemberStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($member) {
                $activateMemberSql = "
                    UPDATE member 
                    SET status = 'active', verification_token = NULL, token_expire = NULL 
                    WHERE member_id = ?
                ";
                
                $activateMemberStmt = $pdo->prepare($activateMemberSql);
                $activateMemberStmt->execute([$member['member_id']]);
            }
        }
        
        // Commit transaction
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Account verified successfully. You can now log in.'
        ]);
    } else {
        // Check if token is valid for member table (for backward compatibility)
        $checkMemberSql = "
            SELECT member_id 
            FROM member 
            WHERE email = ? 
            AND verification_token = ? 
            AND token_expire > NOW() 
            AND status = 'pending'
        ";
        
        $checkMemberStmt = $pdo->prepare($checkMemberSql);
        $checkMemberStmt->execute([$email, $token]);
        $member = $checkMemberStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($member) {
            // Activate member
            $activateMemberSql = "
                UPDATE member 
                SET status = 'active', verification_token = NULL, token_expire = NULL 
                WHERE member_id = ?
            ";
            
            $activateMemberStmt = $pdo->prepare($activateMemberSql);
            $activateMemberStmt->execute([$member['member_id']]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Account verified successfully. You can now log in.'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid or expired verification token'
            ]);
        }
    }
} catch (PDOException $e) {
    // Rollback transaction if active
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
