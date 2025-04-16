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

// Check if user ID is provided
if (!isset($_GET['userId']) || empty($_GET['userId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit();
}

$userId = (int)$_GET['userId'];

try {
    // Get user favorites with dish information
    $sql = "
        SELECT 
            d.dish_id AS id, 
            d.dish_name AS name, 
            c.name AS category, 
            d.dish_price AS price, 
            d.dish_description AS description, 
            d.image_url AS image,
            (SELECT AVG(rating) FROM reviews WHERE dish_id = d.dish_id) AS rating,
            (
                SELECT MAX(o.created_at) 
                FROM orders o 
                JOIN order_items oi ON o.id = oi.order_id 
                WHERE oi.dish_id = d.dish_id AND o.customer_id = ? AND o.status = 'delivered'
            ) AS lastOrdered
        FROM favorites f
        JOIN dishes d ON f.dish_id = d.dish_id
        LEFT JOIN categories c ON d.category_id = c.category_id
        WHERE f.user_id = ? AND d.status = 'approved'
        ORDER BY f.created_at DESC
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId, $userId]);
    $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format lastOrdered date
    foreach ($favorites as &$favorite) {
        if ($favorite['lastOrdered']) {
            $favorite['lastOrdered'] = date('Y-m-d', strtotime($favorite['lastOrdered']));
        }
    }
    
    // Return response
    echo json_encode([
        'success' => true,
        'data' => $favorites
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
