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
if (!isset($data['name']) || !isset($data['category']) || !isset($data['price']) ||
    !isset($data['description']) || !isset($data['memberId']) || !isset($data['ingredients']) ||
    !isset($data['nutritionalInfo'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

try {
    // Start transaction
    $pdo->beginTransaction();

    // Get category ID
    $categoryStmt = $pdo->prepare("SELECT category_id FROM categories WHERE name = ?");
    $categoryStmt->execute([$data['category']]);
    $categoryId = $categoryStmt->fetchColumn();

    // If category doesn't exist, create it
    if (!$categoryId) {
        $createCategoryStmt = $pdo->prepare("INSERT INTO categories (name, description) VALUES (?, ?)");
        $createCategoryStmt->execute([$data['category'], 'Category for ' . $data['category'] . ' dishes']);
        $categoryId = $pdo->lastInsertId();
    }

    // Insert dish
    $dishStmt = $pdo->prepare("
        INSERT INTO dishes (
            dish_name, member_id, category_id, dish_description,
            dish_price, image_url, status, mealTypes
        ) VALUES (?, ?, ?, ?, ?, ?, 'approved', ?)
    ");
    $dishStmt->execute([
        $data['name'],
        $data['memberId'],
        $categoryId,
        $data['description'],
        $data['price'],
        $data['image'] ?? null,
        $data['mealTypes'] ?? ''
    ]);
    $dishId = $pdo->lastInsertId();

    // Insert ingredients
    foreach ($data['ingredients'] as $ingredient) {
        // Check if ingredient exists
        $ingredientStmt = $pdo->prepare("SELECT ingredient_id FROM ingredients WHERE name = ?");
        $ingredientStmt->execute([$ingredient]);
        $ingredientId = $ingredientStmt->fetchColumn();

        // If ingredient doesn't exist, create it
        if (!$ingredientId) {
            $createIngredientStmt = $pdo->prepare("INSERT INTO ingredients (name) VALUES (?)");
            $createIngredientStmt->execute([$ingredient]);
            $ingredientId = $pdo->lastInsertId();
        }

        // Link ingredient to dish
        $dishIngredientStmt = $pdo->prepare("INSERT INTO dish_ingredients (dish_id, ingredient_id) VALUES (?, ?)");
        $dishIngredientStmt->execute([$dishId, $ingredientId]);
    }

    // Insert nutritional info
    $nutritionStmt = $pdo->prepare("
        INSERT INTO nutritional_info (
            dish_id, calories, protein, carbs, fat
        ) VALUES (?, ?, ?, ?, ?)
    ");
    $nutritionStmt->execute([
        $dishId,
        $data['nutritionalInfo']['calories'],
        $data['nutritionalInfo']['protein'],
        $data['nutritionalInfo']['carbs'],
        $data['nutritionalInfo']['fat']
    ]);

    // Commit transaction
    $pdo->commit();

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Dish created successfully',
        'dishId' => $dishId
    ]);

} catch (PDOException $e) {
    // Rollback transaction on error
    $pdo->rollBack();

    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
