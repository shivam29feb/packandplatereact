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
    // Build query based on parameters
    $params = [];
    $whereConditions = [];
    
    // Filter by category
    if (isset($_GET['category']) && !empty($_GET['category'])) {
        $whereConditions[] = "c.name = ?";
        $params[] = $_GET['category'];
    }
    
    // Filter by status
    if (isset($_GET['status']) && !empty($_GET['status'])) {
        $whereConditions[] = "d.status = ?";
        $params[] = $_GET['status'];
    }
    
    // Filter by member ID
    if (isset($_GET['memberId']) && !empty($_GET['memberId'])) {
        $whereConditions[] = "d.member_id = ?";
        $params[] = $_GET['memberId'];
    }
    
    // Filter by meal type
    if (isset($_GET['mealType']) && !empty($_GET['mealType'])) {
        $whereConditions[] = "d.mealTypes LIKE ?";
        $params[] = '%' . $_GET['mealType'] . '%';
    }
    
    // Build the WHERE clause
    $whereClause = '';
    if (!empty($whereConditions)) {
        $whereClause = "WHERE " . implode(" AND ", $whereConditions);
    }
    
    // Pagination
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;
    
    // Get dishes with category and member information
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
            d.mealTypes,
            d.submitted_date AS submittedDate, 
            d.approved_date AS approvedDate,
            d.rejected_date AS rejectedDate, 
            d.rejection_reason AS rejectionReason,
            (SELECT AVG(rating) FROM reviews WHERE dish_id = d.dish_id) AS rating
        FROM dishes d
        LEFT JOIN categories c ON d.category_id = c.category_id
        LEFT JOIN member m ON d.member_id = m.member_id
        $whereClause
        ORDER BY d.dish_id DESC
        LIMIT ? OFFSET ?
    ";
    
    // Add pagination parameters
    $params[] = $limit;
    $params[] = $offset;
    
    // Execute query
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $dishes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get ingredients for each dish
    foreach ($dishes as &$dish) {
        $ingredientsSql = "
            SELECT i.name
            FROM dish_ingredients di
            JOIN ingredients i ON di.ingredient_id = i.ingredient_id
            WHERE di.dish_id = ?
        ";
        $ingredientsStmt = $pdo->prepare($ingredientsSql);
        $ingredientsStmt->execute([$dish['id']]);
        $ingredients = $ingredientsStmt->fetchAll(PDO::FETCH_COLUMN);
        $dish['ingredients'] = $ingredients;
        
        // Get nutritional info
        $nutritionSql = "
            SELECT calories, protein, carbs, fat
            FROM nutritional_info
            WHERE dish_id = ?
        ";
        $nutritionStmt = $pdo->prepare($nutritionSql);
        $nutritionStmt->execute([$dish['id']]);
        $nutrition = $nutritionStmt->fetch(PDO::FETCH_ASSOC);
        $dish['nutritionalInfo'] = $nutrition ?: [
            'calories' => 0,
            'protein' => 0,
            'carbs' => 0,
            'fat' => 0
        ];
    }
    
    // Get total count for pagination
    $countSql = "
        SELECT COUNT(*) FROM dishes d
        LEFT JOIN categories c ON d.category_id = c.category_id
        LEFT JOIN member m ON d.member_id = m.member_id
        $whereClause
    ";
    $countStmt = $pdo->prepare($countSql);
    $countParams = array_slice($params, 0, -2); // Remove limit and offset
    $countStmt->execute($countParams);
    $totalCount = $countStmt->fetchColumn();
    
    // Return response
    echo json_encode([
        'success' => true,
        'data' => $dishes,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'totalItems' => (int)$totalCount,
            'totalPages' => ceil($totalCount / $limit)
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
