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

// Check if member ID is provided
if (!isset($_GET['memberId']) || empty($_GET['memberId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Member ID is required']);
    exit();
}

$memberId = (int)$_GET['memberId'];

try {
    // Get member profile
    $profileSql = "
        SELECT 
            m.member_id AS id,
            m.full_name AS fullName,
            m.email,
            m.phone_number AS phone,
            m.address,
            m.business_name AS businessName,
            m.status,
            m.registration_date AS registrationDate,
            m.last_login AS lastLogin,
            (SELECT COUNT(*) FROM dishes WHERE member_id = m.member_id) AS totalDishes,
            (SELECT COUNT(*) FROM dishes WHERE member_id = m.member_id AND status = 'approved') AS approvedDishes
        FROM member m
        WHERE m.member_id = ?
    ";
    
    $profileStmt = $pdo->prepare($profileSql);
    $profileStmt->execute([$memberId]);
    $profile = $profileStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$profile) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Member not found']);
        exit();
    }
    
    // Get member's dishes
    $dishesSql = "
        SELECT 
            d.dish_id AS id,
            d.dish_name AS name,
            d.dish_price AS price,
            d.status,
            d.image_url AS imageUrl,
            c.name AS category,
            (SELECT AVG(rating) FROM reviews WHERE dish_id = d.dish_id) AS rating,
            (SELECT COUNT(*) FROM reviews WHERE dish_id = d.dish_id) AS reviewCount
        FROM dishes d
        LEFT JOIN categories c ON d.category_id = c.category_id
        WHERE d.member_id = ?
        ORDER BY d.dish_created_at DESC
        LIMIT 5
    ";
    
    $dishesStmt = $pdo->prepare($dishesSql);
    $dishesStmt->execute([$memberId]);
    $dishes = $dishesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format dates
    if ($profile['registrationDate']) {
        $profile['registrationDate'] = date('Y-m-d', strtotime($profile['registrationDate']));
    }
    if ($profile['lastLogin']) {
        $profile['lastLogin'] = date('Y-m-d H:i:s', strtotime($profile['lastLogin']));
    }
    
    // Convert numeric values
    $profile['id'] = (int)$profile['id'];
    $profile['totalDishes'] = (int)$profile['totalDishes'];
    $profile['approvedDishes'] = (int)$profile['approvedDishes'];
    
    foreach ($dishes as &$dish) {
        $dish['id'] = (int)$dish['id'];
        $dish['price'] = (float)$dish['price'];
        $dish['rating'] = $dish['rating'] ? (float)$dish['rating'] : 0;
        $dish['reviewCount'] = (int)$dish['reviewCount'];
    }
    
    // Add dishes to profile
    $profile['recentDishes'] = $dishes;
    
    // Return response
    echo json_encode([
        'success' => true,
        'data' => $profile
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
