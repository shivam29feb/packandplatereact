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

// Check if order ID is provided
if (!isset($_GET['orderId']) || empty($_GET['orderId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Order ID is required']);
    exit();
}

$orderId = (int)$_GET['orderId'];

try {
    // Get order
    $orderSql = "
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
        WHERE o.order_id = ?
    ";
    
    $orderStmt = $pdo->prepare($orderSql);
    $orderStmt->execute([$orderId]);
    $order = $orderStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Order not found']);
        exit();
    }
    
    // Get order items
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
    $itemsStmt->execute([$orderId]);
    $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    $order['items'] = $items;
    
    // Get payment transaction
    $transactionSql = "
        SELECT 
            transaction_id AS id,
            amount,
            payment_method AS paymentMethod,
            external_transaction_id AS externalTransactionId,
            status,
            error_message AS errorMessage,
            created_at AS createdAt
        FROM payment_transactions
        WHERE order_id = ?
        ORDER BY created_at DESC
        LIMIT 1
    ";
    $transactionStmt = $pdo->prepare($transactionSql);
    $transactionStmt->execute([$orderId]);
    $transaction = $transactionStmt->fetch(PDO::FETCH_ASSOC);
    
    $order['payment'] = $transaction ?: null;
    
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
    if ($order['payment'] && $order['payment']['createdAt']) {
        $order['payment']['createdAt'] = date('Y-m-d H:i:s', strtotime($order['payment']['createdAt']));
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
    
    if ($order['payment']) {
        $order['payment']['id'] = (int)$order['payment']['id'];
        $order['payment']['amount'] = (float)$order['payment']['amount'];
    }
    
    // Return response
    echo json_encode([
        'success' => true,
        'data' => $order
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
