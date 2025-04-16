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
if (!isset($data['userId']) || !isset($data['dishId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID and Dish ID are required']);
    exit();
}

$userId = (int)$data['userId'];
$dishId = (int)$data['dishId'];

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
    
    // Check if already in favorites
    $checkFavSql = "SELECT user_id FROM favorites WHERE user_id = ? AND dish_id = ?";
    $checkFavStmt = $pdo->prepare($checkFavSql);
    $checkFavStmt->execute([$userId, $dishId]);
    
    if ($checkFavStmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Dish already in favorites']);
        exit();
    }
    
    // Add to favorites
    $addFavSql = "INSERT INTO favorites (user_id, dish_id) VALUES (?, ?)";
    $addFavStmt = $pdo->prepare($addFavSql);
    $addFavStmt->execute([$userId, $dishId]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Added to favorites'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
