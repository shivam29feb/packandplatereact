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
if (!isset($data['dishId']) || !isset($data['userId']) || !isset($data['rating'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dish ID, User ID, and Rating are required']);
    exit();
}

$dishId = (int)$data['dishId'];
$userId = (int)$data['userId'];
$rating = (int)$data['rating'];
$comment = isset($data['comment']) ? $data['comment'] : '';

// Validate rating
if ($rating < 1 || $rating > 5) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Rating must be between 1 and 5']);
    exit();
}

try {
    // Check if dish exists
    $checkDishSql = "SELECT dish_id FROM dishes WHERE dish_id = ? AND status = 'approved'";
    $checkDishStmt = $pdo->prepare($checkDishSql);
    $checkDishStmt->execute([$dishId]);
    
    if ($checkDishStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Dish not found or not approved']);
        exit();
    }
    
    // Check if user exists
    $checkUserSql = "SELECT user_id FROM users WHERE user_id = ?";
    $checkUserStmt = $pdo->prepare($checkUserSql);
    $checkUserStmt->execute([$userId]);
    
    if ($checkUserStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit();
    }
    
    // Check if user has already reviewed this dish
    $checkReviewSql = "SELECT review_id FROM reviews WHERE dish_id = ? AND user_id = ?";
    $checkReviewStmt = $pdo->prepare($checkReviewSql);
    $checkReviewStmt->execute([$dishId, $userId]);
    
    if ($checkReviewStmt->rowCount() > 0) {
        // Update existing review
        $updateReviewSql = "
            UPDATE reviews 
            SET rating = ?, comment = ?, updated_at = NOW()
            WHERE dish_id = ? AND user_id = ?
        ";
        $updateReviewStmt = $pdo->prepare($updateReviewSql);
        $updateReviewStmt->execute([$rating, $comment, $dishId, $userId]);
        
        $reviewId = $checkReviewStmt->fetchColumn();
        $message = 'Review updated successfully';
    } else {
        // Add new review
        $addReviewSql = "
            INSERT INTO reviews (dish_id, user_id, rating, comment)
            VALUES (?, ?, ?, ?)
        ";
        $addReviewStmt = $pdo->prepare($addReviewSql);
        $addReviewStmt->execute([$dishId, $userId, $rating, $comment]);
        
        $reviewId = $pdo->lastInsertId();
        $message = 'Review added successfully';
    }
    
    // Get user information
    $userSql = "SELECT user_username FROM users WHERE user_id = ?";
    $userStmt = $pdo->prepare($userSql);
    $userStmt->execute([$userId]);
    $userName = $userStmt->fetchColumn();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data' => [
            'id' => (int)$reviewId,
            'dishId' => $dishId,
            'userId' => $userId,
            'userName' => $userName,
            'rating' => $rating,
            'comment' => $comment,
            'date' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
