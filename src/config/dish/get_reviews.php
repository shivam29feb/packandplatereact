<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include database connection
require_once '../connection.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Check if dish ID is provided
if (!isset($_GET['dishId']) || empty($_GET['dishId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dish ID is required']);
    exit();
}

$dishId = (int)$_GET['dishId'];

try {
    // Check if dish exists
    $checkDishSql = "SELECT dish_id FROM dishes WHERE dish_id = ?";
    $checkDishStmt = $pdo->prepare($checkDishSql);
    $checkDishStmt->execute([$dishId]);
    
    if ($checkDishStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Dish not found']);
        exit();
    }
    
    // Get reviews for the dish
    $reviewsSql = "
        SELECT 
            r.review_id AS id, 
            r.dish_id AS dishId, 
            r.user_id AS userId, 
            u.user_username AS userName, 
            r.rating, 
            r.comment, 
            r.created_at AS date
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.dish_id = ? AND r.is_approved = 1
        ORDER BY r.created_at DESC
    ";
    
    $reviewsStmt = $pdo->prepare($reviewsSql);
    $reviewsStmt->execute([$dishId]);
    $reviews = $reviewsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format dates
    foreach ($reviews as &$review) {
        $review['date'] = date('Y-m-d', strtotime($review['date']));
    }
    
    // Get average rating
    $avgRatingSql = "SELECT AVG(rating) FROM reviews WHERE dish_id = ? AND is_approved = 1";
    $avgRatingStmt = $pdo->prepare($avgRatingSql);
    $avgRatingStmt->execute([$dishId]);
    $avgRating = $avgRatingStmt->fetchColumn();
    
    // Get rating distribution
    $ratingDistSql = "
        SELECT rating, COUNT(*) as count
        FROM reviews
        WHERE dish_id = ? AND is_approved = 1
        GROUP BY rating
        ORDER BY rating DESC
    ";
    $ratingDistStmt = $pdo->prepare($ratingDistSql);
    $ratingDistStmt->execute([$dishId]);
    $ratingDistribution = $ratingDistStmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    // Fill in missing ratings with 0
    $distribution = [];
    for ($i = 5; $i >= 1; $i--) {
        $distribution[$i] = isset($ratingDistribution[$i]) ? (int)$ratingDistribution[$i] : 0;
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'data' => [
            'reviews' => $reviews,
            'stats' => [
                'averageRating' => round($avgRating, 1),
                'totalReviews' => count($reviews),
                'distribution' => $distribution
            ]
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
