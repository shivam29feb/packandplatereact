<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include database connection
require_once '../connection.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Allow both DELETE and POST requests (for compatibility)
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get input data
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // For DELETE requests, get parameters from query string
    $userId = isset($_GET['userId']) ? (int)$_GET['userId'] : null;
    $dishId = isset($_GET['dishId']) ? (int)$_GET['dishId'] : null;
} else {
    // For POST requests, get parameters from JSON body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $userId = isset($data['userId']) ? (int)$data['userId'] : null;
    $dishId = isset($data['dishId']) ? (int)$data['dishId'] : null;
}

// Validate input
if (!$userId || !$dishId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID and Dish ID are required']);
    exit();
}

try {
    // Remove from favorites
    $removeFavSql = "DELETE FROM favorites WHERE user_id = ? AND dish_id = ?";
    $removeFavStmt = $pdo->prepare($removeFavSql);
    $removeFavStmt->execute([$userId, $dishId]);
    
    if ($removeFavStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Dish not found in favorites']);
        exit();
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Removed from favorites'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
