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

try {
    // Get categories
    $sql = "
        SELECT 
            category_id AS id,
            name,
            description,
            image_url AS imageUrl,
            is_active AS isActive,
            (SELECT COUNT(*) FROM dishes WHERE category_id = c.category_id AND status = 'approved') AS dishCount
        FROM categories c
        WHERE is_active = 1
        ORDER BY name ASC
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert numeric values
    foreach ($categories as &$category) {
        $category['id'] = (int)$category['id'];
        $category['isActive'] = (bool)$category['isActive'];
        $category['dishCount'] = (int)$category['dishCount'];
    }
    
    // Return response
    echo json_encode([
        'success' => true,
        'data' => $categories
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
