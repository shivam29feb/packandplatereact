<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include database connection
require_once '../connection.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate input
if (!isset($data['userId']) || !isset($data['currentPassword']) || !isset($data['newPassword'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID, current password, and new password are required']);
    exit();
}

$userId = (int)$data['userId'];
$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];
$userType = $data['userType'] ?? '';

// Validate password
if (strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'New password must be at least 8 characters long']);
    exit();
}

try {
    // Start transaction
    $pdo->beginTransaction();
    
    // Check if user exists and verify current password
    $checkUserSql = "SELECT user_id, user_password_hash, user_type FROM users WHERE user_id = ?";
    $checkUserStmt = $pdo->prepare($checkUserSql);
    $checkUserStmt->execute([$userId]);
    $user = $checkUserStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        // If not found in users table, check member table
        $checkMemberSql = "SELECT member_id, password_hash FROM member WHERE member_id = ?";
        $checkMemberStmt = $pdo->prepare($checkMemberSql);
        $checkMemberStmt->execute([$userId]);
        $member = $checkMemberStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$member) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'User not found']);
            exit();
        }
        
        // Verify current password
        if (!password_verify($currentPassword, $member['password_hash'])) {
            $pdo->rollBack();
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
            exit();
        }
        
        // Hash new password
        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        
        // Update member password
        $updateMemberSql = "UPDATE member SET password_hash = ? WHERE member_id = ?";
        $updateMemberStmt = $pdo->prepare($updateMemberSql);
        $updateMemberStmt->execute([$newPasswordHash, $member['member_id']]);
        
        // Check if user exists in users table
        $checkUserInUsersSql = "
            SELECT u.user_id 
            FROM users u
            JOIN member_profiles mp ON u.user_id = mp.user_id
            WHERE mp.profile_id = ?
        ";
        $checkUserInUsersStmt = $pdo->prepare($checkUserInUsersSql);
        $checkUserInUsersStmt->execute([$member['member_id']]);
        $userInUsers = $checkUserInUsersStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($userInUsers) {
            // Update user password
            $updateUserSql = "UPDATE users SET user_password_hash = ? WHERE user_id = ?";
            $updateUserStmt = $pdo->prepare($updateUserSql);
            $updateUserStmt->execute([$newPasswordHash, $userInUsers['user_id']]);
        }
    } else {
        // Verify current password
        if (!password_verify($currentPassword, $user['user_password_hash'])) {
            $pdo->rollBack();
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
            exit();
        }
        
        // Hash new password
        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        
        // Update user password
        $updateUserSql = "UPDATE users SET user_password_hash = ? WHERE user_id = ?";
        $updateUserStmt = $pdo->prepare($updateUserSql);
        $updateUserStmt->execute([$newPasswordHash, $user['user_id']]);
        
        // If user is a member, also update member table
        if ($user['user_type'] === 'member' || $userType === 'member') {
            $checkMemberSql = "
                SELECT m.member_id 
                FROM member m
                JOIN member_profiles mp ON m.member_id = mp.profile_id
                WHERE mp.user_id = ?
            ";
            $checkMemberStmt = $pdo->prepare($checkMemberSql);
            $checkMemberStmt->execute([$user['user_id']]);
            $member = $checkMemberStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($member) {
                $updateMemberSql = "UPDATE member SET password_hash = ? WHERE member_id = ?";
                $updateMemberStmt = $pdo->prepare($updateMemberSql);
                $updateMemberStmt->execute([$newPasswordHash, $member['member_id']]);
            }
        }
    }
    
    // Commit transaction
    $pdo->commit();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Password changed successfully'
    ]);
    
} catch (PDOException $e) {
    // Rollback transaction
    $pdo->rollBack();
    
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
