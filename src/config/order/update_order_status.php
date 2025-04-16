<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include database connection
require_once '../connection.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST or PATCH requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate input
if (!isset($data['orderId']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Order ID and status are required']);
    exit();
}

$orderId = (int)$data['orderId'];
$status = $data['status'];
$currentLocation = isset($data['currentLocation']) ? $data['currentLocation'] : null;
$estimatedDelivery = isset($data['estimatedDelivery']) ? $data['estimatedDelivery'] : null;
$cancellationReason = isset($data['cancellationReason']) ? $data['cancellationReason'] : null;

// Validate status
$validStatuses = ['processing', 'in-transit', 'delivered', 'cancelled'];
if (!in_array($status, $validStatuses)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid status. Must be one of: ' . implode(', ', $validStatuses)]);
    exit();
}

try {
    // Start transaction
    $pdo->beginTransaction();
    
    // Check if order exists
    $checkOrderSql = "SELECT order_id, status FROM orders WHERE order_id = ?";
    $checkOrderStmt = $pdo->prepare($checkOrderSql);
    $checkOrderStmt->execute([$orderId]);
    $order = $checkOrderStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Order not found']);
        exit();
    }
    
    // Check if status is already set
    if ($order['status'] === $status) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Order is already in '$status' status"]);
        exit();
    }
    
    // Check if status transition is valid
    $validTransitions = [
        'processing' => ['in-transit', 'cancelled'],
        'in-transit' => ['delivered', 'cancelled'],
        'delivered' => [],
        'cancelled' => []
    ];
    
    if (!in_array($status, $validTransitions[$order['status']])) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => "Invalid status transition from '{$order['status']}' to '$status'"
        ]);
        exit();
    }
    
    // Build update query
    $updateFields = ["status = ?"];
    $updateParams = [$status];
    
    if ($status === 'in-transit') {
        if ($currentLocation) {
            $updateFields[] = "current_location = ?";
            $updateParams[] = $currentLocation;
        }
        if ($estimatedDelivery) {
            $updateFields[] = "estimated_delivery = ?";
            $updateParams[] = $estimatedDelivery;
        }
    } else if ($status === 'delivered') {
        $updateFields[] = "delivered_at = NOW()";
    } else if ($status === 'cancelled') {
        if (!$cancellationReason) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cancellation reason is required']);
            exit();
        }
        $updateFields[] = "cancellation_reason = ?";
        $updateParams[] = $cancellationReason;
        
        // Update payment status if cancelled
        $updatePaymentSql = "
            UPDATE payment_transactions 
            SET status = 'refunded' 
            WHERE order_id = ? AND status = 'completed'
        ";
        $updatePaymentStmt = $pdo->prepare($updatePaymentSql);
        $updatePaymentStmt->execute([$orderId]);
    }
    
    // Add order ID to params
    $updateParams[] = $orderId;
    
    // Update order
    $updateOrderSql = "UPDATE orders SET " . implode(", ", $updateFields) . " WHERE order_id = ?";
    $updateOrderStmt = $pdo->prepare($updateOrderSql);
    $updateOrderStmt->execute($updateParams);
    
    // Commit transaction
    $pdo->commit();
    
    // Get updated order
    $getOrderSql = "
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
    $getOrderStmt = $pdo->prepare($getOrderSql);
    $getOrderStmt->execute([$orderId]);
    $updatedOrder = $getOrderStmt->fetch(PDO::FETCH_ASSOC);
    
    // Format dates
    if ($updatedOrder['createdAt']) {
        $updatedOrder['createdAt'] = date('Y-m-d H:i:s', strtotime($updatedOrder['createdAt']));
    }
    if ($updatedOrder['estimatedDelivery']) {
        $updatedOrder['estimatedDelivery'] = date('Y-m-d H:i:s', strtotime($updatedOrder['estimatedDelivery']));
    }
    if ($updatedOrder['deliveredAt']) {
        $updatedOrder['deliveredAt'] = date('Y-m-d H:i:s', strtotime($updatedOrder['deliveredAt']));
    }
    
    // Convert numeric values
    $updatedOrder['id'] = (int)$updatedOrder['id'];
    $updatedOrder['customerId'] = (int)$updatedOrder['customerId'];
    $updatedOrder['totalAmount'] = (float)$updatedOrder['totalAmount'];
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Order status updated successfully',
        'data' => $updatedOrder
    ]);
    
} catch (PDOException $e) {
    // Rollback transaction on error
    $pdo->rollBack();
    
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
