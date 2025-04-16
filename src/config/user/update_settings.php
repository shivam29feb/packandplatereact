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
    // Check if settings exist
    $checkSql = "SELECT settings_id FROM user_settings WHERE user_id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$userId]);
    $settingsExist = $checkStmt->fetchColumn();
    
    // Update appearance settings
    if (isset($data['appearance'])) {
        $appearance = $data['appearance'];
        
        if ($settingsExist) {
            // Update existing settings
            $updateSql = "
                UPDATE user_settings 
                SET theme = ?, font_size = ?, reduced_motion = ?, high_contrast = ?
                WHERE user_id = ?
            ";
            $updateStmt = $pdo->prepare($updateSql);
            $updateStmt->execute([
                $appearance['theme'],
                $appearance['fontSize'],
                $appearance['reducedMotion'] ? 1 : 0,
                $appearance['highContrast'] ? 1 : 0,
                $userId
            ]);
        } else {
            // Insert new settings
            $insertSql = "
                INSERT INTO user_settings (
                    user_id, theme, font_size, reduced_motion, high_contrast
                ) VALUES (?, ?, ?, ?, ?)
            ";
            $insertStmt = $pdo->prepare($insertSql);
            $insertStmt->execute([
                $userId,
                $appearance['theme'],
                $appearance['fontSize'],
                $appearance['reducedMotion'] ? 1 : 0,
                $appearance['highContrast'] ? 1 : 0
            ]);
        }
    }
    
    // Update notification settings
    if (isset($data['notifications'])) {
        // Get the first notification to determine email/push/sms settings
        $notification = $data['notifications'][0];
        
        if ($settingsExist) {
            // Update existing settings
            $updateSql = "
                UPDATE user_settings 
                SET email_notifications = ?, push_notifications = ?, sms_notifications = ?
                WHERE user_id = ?
            ";
            $updateStmt = $pdo->prepare($updateSql);
            $updateStmt->execute([
                $notification['email'] ? 1 : 0,
                $notification['push'] ? 1 : 0,
                $notification['sms'] ? 1 : 0,
                $userId
            ]);
        } else {
            // Insert new settings
            $insertSql = "
                INSERT INTO user_settings (
                    user_id, email_notifications, push_notifications, sms_notifications
                ) VALUES (?, ?, ?, ?)
            ";
            $insertStmt = $pdo->prepare($insertSql);
            $insertStmt->execute([
                $userId,
                $notification['email'] ? 1 : 0,
                $notification['push'] ? 1 : 0,
                $notification['sms'] ? 1 : 0
            ]);
        }
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Settings updated successfully'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
