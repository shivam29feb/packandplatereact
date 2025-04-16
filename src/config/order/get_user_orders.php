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
    // Build query based on parameters
    $params = [$userId];
    $whereConditions = ["o.customer_id = ?"];
    
    // Filter by status
    if (isset($_GET['status']) && !empty($_GET['status'])) {
        $whereConditions[] = "o.status = ?";
        $params[] = $_GET['status'];
    }
    
    // Build the WHERE clause
    $whereClause = "WHERE " . implode(" AND ", $whereConditions);
    
    // Pagination
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;
    
    // Sort options
    $sortBy = isset($_GET['sortBy']) ? $_GET['sortBy'] : 'created_at';
    $sortOrder = isset($_GET['sortOrder']) && strtolower($_GET['sortOrder']) === 'asc' ? 'ASC' : 'DESC';
    
    // Validate sort field
    $allowedSortFields = ['created_at', 'total_amount', 'status'];
    if (!in_array($sortBy, $allowedSortFields)) {
        $sortBy = 'created_at';
    }
    
    // Get orders
    $ordersSql = "
        SELECT 
            o.order_id AS id,
            o.customer_id AS customerId,
            u.user_username AS customerName,
            o.status,
            o.total_amount AS totalAmount,
            o.delivery_address AS deliveryAddress,
            o.payment_method AS paymentMethod,
            o.payment_status AS paymentStatus,
            o.delivery_time AS deliveryTime,
            o.estimated_delivery AS estimatedDelivery,
            o.delivered_at AS deliveredAt,
            o.current_location AS currentLocation,
            o.cancellation_reason AS cancellationReason,
            o.notes,
            o.created_at AS createdAt
        FROM orders o
        JOIN users u ON o.customer_id = u.user_id
        $whereClause
        ORDER BY o.$sortBy $sortOrder
        LIMIT ? OFFSET ?
    ";
    
    // Add pagination parameters
    $params[] = $limit;
    $params[] = $offset;
    
    // Execute query
    $ordersStmt = $pdo->prepare($ordersSql);
    $ordersStmt->execute($params);
    $orders = $ordersStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get order items for each order
    foreach ($orders as &$order) {
        $itemsSql = "
            SELECT 
                oi.item_id AS id,
                oi.dish_id AS dishId,
                d.dish_name AS name,
                oi.quantity,
                oi.price,
                oi.special_instructions AS specialInstructions
            FROM order_items oi
            JOIN dishes d ON oi.dish_id = d.dish_id
            WHERE oi.order_id = ?
        ";
        $itemsStmt = $pdo->prepare($itemsSql);
        $itemsStmt->execute([$order['id']]);
        $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $order['items'] = $items;
        
        // Format dates
        if ($order['createdAt']) {
            $order['createdAt'] = date('Y-m-d H:i:s', strtotime($order['createdAt']));
        }
        if ($order['estimatedDelivery']) {
            $order['estimatedDelivery'] = date('Y-m-d H:i:s', strtotime($order['estimatedDelivery']));
        }
        if ($order['deliveredAt']) {
            $order['deliveredAt'] = date('Y-m-d H:i:s', strtotime($order['deliveredAt']));
        }
        
        // Convert numeric values
        $order['id'] = (int)$order['id'];
        $order['customerId'] = (int)$order['customerId'];
        $order['totalAmount'] = (float)$order['totalAmount'];
        
        foreach ($order['items'] as &$item) {
            $item['id'] = (int)$item['id'];
            $item['dishId'] = (int)$item['dishId'];
            $item['quantity'] = (int)$item['quantity'];
            $item['price'] = (float)$item['price'];
        }
    }
    
    // Get total count for pagination
    $countSql = "
        SELECT COUNT(*) FROM orders o
        $whereClause
    ";
    $countStmt = $pdo->prepare($countSql);
    $countParams = array_slice($params, 0, -2); // Remove limit and offset
    $countStmt->execute($countParams);
    $totalCount = $countStmt->fetchColumn();
    
    // Return response
    echo json_encode([
        'success' => true,
        'data' => $orders,
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
