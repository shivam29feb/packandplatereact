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
if (!isset($_GET['id']) || empty($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dish ID is required']);
    exit();
}

$dishId = (int)$_GET['id'];

try {
    // Get dish with category and member information
    $sql = "
        SELECT 
            d.dish_id AS id, 
            d.dish_name AS name, 
            c.name AS category, 
            d.dish_price AS price, 
            d.dish_description AS description, 
            d.image_url AS image,
            d.member_id AS memberId, 
            m.full_name AS memberName,
            d.status, 
            d.submitted_date AS submittedDate, 
            d.approved_date AS approvedDate,
            d.rejected_date AS rejectedDate, 
            d.rejection_reason AS rejectionReason,
            (SELECT AVG(rating) FROM reviews WHERE dish_id = d.dish_id) AS rating
        FROM dishes d
        LEFT JOIN categories c ON d.category_id = c.category_id
        LEFT JOIN member m ON d.member_id = m.member_id
        WHERE d.dish_id = ?
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$dishId]);
    $dish = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$dish) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Dish not found']);
        exit();
    }
    
    // Get ingredients
    $ingredientsSql = "
        SELECT i.name
        FROM dish_ingredients di
        JOIN ingredients i ON di.ingredient_id = i.ingredient_id
        WHERE di.dish_id = ?
    ";
    $ingredientsStmt = $pdo->prepare($ingredientsSql);
    $ingredientsStmt->execute([$dishId]);
    $ingredients = $ingredientsStmt->fetchAll(PDO::FETCH_COLUMN);
    $dish['ingredients'] = $ingredients;
    
    // Get nutritional info
    $nutritionSql = "
        SELECT calories, protein, carbs, fat, fiber, sugar, sodium, serving_size
        FROM nutritional_info
        WHERE dish_id = ?
    ";
    $nutritionStmt = $pdo->prepare($nutritionSql);
    $nutritionStmt->execute([$dishId]);
    $nutrition = $nutritionStmt->fetch(PDO::FETCH_ASSOC);
    $dish['nutritionalInfo'] = $nutrition ?: [
        'calories' => 0,
        'protein' => 0,
        'carbs' => 0,
        'fat' => 0
    ];
    
    // Get reviews
    $reviewsSql = "
        SELECT 
            r.review_id AS id, 
            r.user_id AS userId, 
            CONCAT(u.user_username, ' ', '') AS userName,
            r.rating, 
            r.comment, 
            r.created_at AS date
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.dish_id = ? AND r.is_approved = TRUE
        ORDER BY r.created_at DESC
    ";
    $reviewsStmt = $pdo->prepare($reviewsSql);
    $reviewsStmt->execute([$dishId]);
    $reviews = $reviewsStmt->fetchAll(PDO::FETCH_ASSOC);
    $dish['reviews'] = $reviews;
    
    // Return response
    echo json_encode([
        'success' => true,
        'data' => $dish
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
