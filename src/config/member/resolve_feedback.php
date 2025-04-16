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
if (!isset($data['feedbackId']) || !isset($data['memberId']) || !isset($data['resolvedBy']) || !isset($data['resolutionComment'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Feedback ID, Member ID, Resolved By, and Resolution Comment are required']);
    exit();
}

$feedbackId = (int)$data['feedbackId'];
$memberId = (int)$data['memberId'];
$resolvedBy = (int)$data['resolvedBy'];
$resolutionComment = $data['resolutionComment'];

try {
    // Check if feedback exists and belongs to the member
    $checkFeedbackSql = "
        SELECT feedback_id, is_resolved 
        FROM customer_feedback 
        WHERE feedback_id = ? AND member_id = ?
    ";
    $checkFeedbackStmt = $pdo->prepare($checkFeedbackSql);
    $checkFeedbackStmt->execute([$feedbackId, $memberId]);
    $feedback = $checkFeedbackStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$feedback) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Feedback not found or does not belong to this member']);
        exit();
    }
    
    if ($feedback['is_resolved']) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Feedback is already resolved']);
        exit();
    }
    
    // Check if resolver exists
    $checkResolverSql = "SELECT user_id FROM users WHERE user_id = ?";
    $checkResolverStmt = $pdo->prepare($checkResolverSql);
    $checkResolverStmt->execute([$resolvedBy]);
    
    if ($checkResolverStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Resolver not found']);
        exit();
    }
    
    // Update feedback as resolved
    $updateSql = "
        UPDATE customer_feedback 
        SET is_resolved = 1, 
            resolved_by = ?, 
            resolved_at = NOW(), 
            resolution_comment = ?
        WHERE feedback_id = ?
    ";
    $updateStmt = $pdo->prepare($updateSql);
    $updateStmt->execute([$resolvedBy, $resolutionComment, $feedbackId]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Feedback resolved successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
