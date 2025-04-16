<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include database connection
require_once '../connection.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow PUT or PATCH requests
if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Check if dish ID is provided
if (!isset($data['id']) || empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dish ID is required']);
    exit();
}

$dishId = (int)$data['id'];

try {
    // Start transaction
    $pdo->beginTransaction();

    // Check if dish exists
    $checkDishStmt = $pdo->prepare("SELECT dish_id, member_id FROM dishes WHERE dish_id = ?");
    $checkDishStmt->execute([$dishId]);
    $dish = $checkDishStmt->fetch(PDO::FETCH_ASSOC);

    if (!$dish) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Dish not found']);
        exit();
    }

    // Check if user is the owner of the dish
    if (isset($data['memberId']) && $dish['member_id'] != $data['memberId']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'You are not authorized to update this dish']);
        exit();
    }

    // Update dish fields
    $updateFields = [];
    $updateParams = [];

    if (isset($data['name'])) {
        $updateFields[] = "dish_name = ?";
        $updateParams[] = $data['name'];
    }

    if (isset($data['description'])) {
        $updateFields[] = "dish_description = ?";
        $updateParams[] = $data['description'];
    }

    if (isset($data['price'])) {
        $updateFields[] = "dish_price = ?";
        $updateParams[] = $data['price'];
    }

    if (isset($data['image'])) {
        $updateFields[] = "image_url = ?";
        $updateParams[] = $data['image'];
    }

    if (isset($data['mealTypes'])) {
        $updateFields[] = "mealTypes = ?";
        $updateParams[] = $data['mealTypes'];
    }

    // Always set status to approved
    $updateFields[] = "status = ?";
    $updateParams[] = 'approved';

    if (isset($data['category'])) {
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

        $updateFields[] = "category_id = ?";
        $updateParams[] = $categoryId;
    }

    // Update dish if there are fields to update
    if (!empty($updateFields)) {
        $updateParams[] = $dishId;
        $updateDishSql = "UPDATE dishes SET " . implode(", ", $updateFields) . " WHERE dish_id = ?";
        $updateDishStmt = $pdo->prepare($updateDishSql);
        $updateDishStmt->execute($updateParams);
    }

    // Update ingredients if provided
    if (isset($data['ingredients'])) {
        // Remove existing ingredients
        $deleteIngredientsStmt = $pdo->prepare("DELETE FROM dish_ingredients WHERE dish_id = ?");
        $deleteIngredientsStmt->execute([$dishId]);

        // Add new ingredients
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
    }

    // Update nutritional info if provided
    if (isset($data['nutritionalInfo'])) {
        // Check if nutritional info exists
        $checkNutritionStmt = $pdo->prepare("SELECT info_id FROM nutritional_info WHERE dish_id = ?");
        $checkNutritionStmt->execute([$dishId]);
        $nutritionExists = $checkNutritionStmt->fetchColumn();

        if ($nutritionExists) {
            // Update existing nutritional info
            $updateNutritionStmt = $pdo->prepare("
                UPDATE nutritional_info
                SET calories = ?, protein = ?, carbs = ?, fat = ?
                WHERE dish_id = ?
            ");
            $updateNutritionStmt->execute([
                $data['nutritionalInfo']['calories'],
                $data['nutritionalInfo']['protein'],
                $data['nutritionalInfo']['carbs'],
                $data['nutritionalInfo']['fat'],
                $dishId
            ]);
        } else {
            // Insert new nutritional info
            $insertNutritionStmt = $pdo->prepare("
                INSERT INTO nutritional_info (dish_id, calories, protein, carbs, fat)
                VALUES (?, ?, ?, ?, ?)
            ");
            $insertNutritionStmt->execute([
                $dishId,
                $data['nutritionalInfo']['calories'],
                $data['nutritionalInfo']['protein'],
                $data['nutritionalInfo']['carbs'],
                $data['nutritionalInfo']['fat']
            ]);
        }
    }

    // Commit transaction
    $pdo->commit();

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Dish updated successfully',
        'dishId' => $dishId
    ]);

} catch (PDOException $e) {
    // Rollback transaction on error
    $pdo->rollBack();

    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>