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
    // Get customer profile
    $profileSql = "
        SELECT 
            u.user_id AS id,
            u.user_username AS username,
            u.user_email AS email,
            u.user_created_at AS createdAt,
            u.user_last_login AS lastLogin,
            cp.full_name AS fullName,
            cp.phone_number AS phone,
            cp.address,
            cp.dietary_preferences AS dietaryPreferences
        FROM users u
        LEFT JOIN customer_profiles cp ON u.user_id = cp.user_id
        WHERE u.user_id = ? AND u.user_type = 'customer'
    ";
    
    $profileStmt = $pdo->prepare($profileSql);
    $profileStmt->execute([$userId]);
    $profile = $profileStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$profile) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Customer not found']);
        exit();
    }
    
    // Get customer's orders
    $ordersSql = "
        SELECT 
            o.order_id AS id,
            o.status,
            o.total_amount AS totalAmount,
            o.created_at AS createdAt,
            o.delivered_at AS deliveredAt,
            COUNT(oi.item_id) AS itemCount
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.customer_id = ?
        GROUP BY o.order_id
        ORDER BY o.created_at DESC
        LIMIT 5
    ";
    
    $ordersStmt = $pdo->prepare($ordersSql);
    $ordersStmt->execute([$userId]);
    $orders = $ordersStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get customer's favorites
    $favoritesSql = "
        SELECT 
            d.dish_id AS id,
            d.dish_name AS name,
            d.dish_price AS price,
            d.image_url AS imageUrl,
            c.name AS category,
            (SELECT AVG(rating) FROM reviews WHERE dish_id = d.dish_id) AS rating
        FROM favorites f
        JOIN dishes d ON f.dish_id = d.dish_id
        LEFT JOIN categories c ON d.category_id = c.category_id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC
        LIMIT 5
    ";
    
    $favoritesStmt = $pdo->prepare($favoritesSql);
    $favoritesStmt->execute([$userId]);
    $favorites = $favoritesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get customer's reviews
    $reviewsSql = "
        SELECT 
            r.review_id AS id,
            r.dish_id AS dishId,
            d.dish_name AS dishName,
            r.rating,
            r.comment,
            r.created_at AS createdAt
        FROM reviews r
        JOIN dishes d ON r.dish_id = d.dish_id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
        LIMIT 5
    ";
    
    $reviewsStmt = $pdo->prepare($reviewsSql);
    $reviewsStmt->execute([$userId]);
    $reviews = $reviewsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format dates
    if ($profile['createdAt']) {
        $profile['createdAt'] = date('Y-m-d', strtotime($profile['createdAt']));
    }
    if ($profile['lastLogin']) {
        $profile['lastLogin'] = date('Y-m-d H:i:s', strtotime($profile['lastLogin']));
    }
    
    foreach ($orders as &$order) {
        if ($order['createdAt']) {
            $order['createdAt'] = date('Y-m-d', strtotime($order['createdAt']));
        }
        if ($order['deliveredAt']) {
            $order['deliveredAt'] = date('Y-m-d', strtotime($order['deliveredAt']));
        }
        
        $order['id'] = (int)$order['id'];
        $order['totalAmount'] = (float)$order['totalAmount'];
        $order['itemCount'] = (int)$order['itemCount'];
    }
    
    foreach ($favorites as &$favorite) {
        $favorite['id'] = (int)$favorite['id'];
        $favorite['price'] = (float)$favorite['price'];
        $favorite['rating'] = $favorite['rating'] ? (float)$favorite['rating'] : 0;
    }
    
    foreach ($reviews as &$review) {
        if ($review['createdAt']) {
            $review['createdAt'] = date('Y-m-d', strtotime($review['createdAt']));
        }
        
        $review['id'] = (int)$review['id'];
        $review['dishId'] = (int)$review['dishId'];
        $review['rating'] = (int)$review['rating'];
    }
    
    // Add data to profile
    $profile['id'] = (int)$profile['id'];
    $profile['recentOrders'] = $orders;
    $profile['favorites'] = $favorites;
    $profile['reviews'] = $reviews;
    
    // Get order statistics
    $statsSql = "
        SELECT 
            COUNT(o.order_id) AS totalOrders,
            SUM(o.total_amount) AS totalSpent,
            AVG(o.total_amount) AS avgOrderValue,
            COUNT(DISTINCT f.dish_id) AS favoriteCount
        FROM users u
        LEFT JOIN orders o ON u.user_id = o.customer_id
        LEFT JOIN favorites f ON u.user_id = f.user_id
        WHERE u.user_id = ?
    ";
    
    $statsStmt = $pdo->prepare($statsSql);
    $statsStmt->execute([$userId]);
    $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);
    
    $profile['stats'] = [
        'totalOrders' => (int)$stats['totalOrders'],
        'totalSpent' => $stats['totalSpent'] ? (float)$stats['totalSpent'] : 0,
        'avgOrderValue' => $stats['avgOrderValue'] ? (float)$stats['avgOrderValue'] : 0,
        'favoriteCount' => (int)$stats['favoriteCount']
    ];
    
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
