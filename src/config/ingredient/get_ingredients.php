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
    // Search term
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    
    // Build query
    $params = [];
    $whereClause = '';
    
    if (!empty($search)) {
        $whereClause = "WHERE name LIKE ?";
        $params[] = "%$search%";
    }
    
    // Get ingredients
    $sql = "
        SELECT 
            ingredient_id AS id,
            name,
            description,
            is_allergen AS isAllergen
        FROM ingredients
        $whereClause
        ORDER BY name ASC
        LIMIT 50
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $ingredients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert numeric values
    foreach ($ingredients as &$ingredient) {
        $ingredient['id'] = (int)$ingredient['id'];
        $ingredient['isAllergen'] = (bool)$ingredient['isAllergen'];
    }
    
    // Return response
    echo json_encode([
        'success' => true,
        'data' => $ingredients
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
