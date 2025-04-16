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
if (!isset($data['customerId']) || !isset($data['items']) || !isset($data['deliveryAddress']) || !isset($data['paymentMethod'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Customer ID, items, delivery address, and payment method are required']);
    exit();
}

$customerId = (int)$data['customerId'];
$items = $data['items'];
$deliveryAddress = $data['deliveryAddress'];
$paymentMethod = $data['paymentMethod'];
$notes = isset($data['notes']) ? $data['notes'] : '';

// Validate items
if (empty($items)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Order must contain at least one item']);
    exit();
}

try {
    // Start transaction
    $pdo->beginTransaction();
    
    // Check if customer exists
    $checkCustomerSql = "SELECT user_id FROM users WHERE user_id = ? AND user_type = 'customer'";
    $checkCustomerStmt = $pdo->prepare($checkCustomerSql);
    $checkCustomerStmt->execute([$customerId]);
    
    if ($checkCustomerStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Customer not found']);
        exit();
    }
    
    // Calculate total amount and validate items
    $totalAmount = 0;
    $validatedItems = [];
    
    foreach ($items as $item) {
        if (!isset($item['dishId']) || !isset($item['quantity'])) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Each item must have dishId and quantity']);
            exit();
        }
        
        $dishId = (int)$item['dishId'];
        $quantity = (int)$item['quantity'];
        
        if ($quantity <= 0) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Quantity must be greater than 0']);
            exit();
        }
        
        // Get dish information
        $dishSql = "SELECT dish_id, dish_name, dish_price FROM dishes WHERE dish_id = ? AND status = 'approved'";
        $dishStmt = $pdo->prepare($dishSql);
        $dishStmt->execute([$dishId]);
        $dish = $dishStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$dish) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => "Dish with ID $dishId not found or not approved"]);
            exit();
        }
        
        $itemTotal = $dish['dish_price'] * $quantity;
        $totalAmount += $itemTotal;
        
        $validatedItems[] = [
            'dishId' => $dishId,
            'name' => $dish['dish_name'],
            'quantity' => $quantity,
            'price' => $dish['dish_price'],
            'specialInstructions' => isset($item['specialInstructions']) ? $item['specialInstructions'] : ''
        ];
    }
    
    // Create order
    $createOrderSql = "
        INSERT INTO orders (
            customer_id, status, total_amount, delivery_address, 
            payment_method, payment_status, notes
        ) VALUES (?, 'processing', ?, ?, ?, 'pending', ?)
    ";
    $createOrderStmt = $pdo->prepare($createOrderSql);
    $createOrderStmt->execute([
        $customerId,
        $totalAmount,
        $deliveryAddress,
        $paymentMethod,
        $notes
    ]);
    
    $orderId = $pdo->lastInsertId();
    
    // Add order items
    $addItemSql = "
        INSERT INTO order_items (
            order_id, dish_id, quantity, price, special_instructions
        ) VALUES (?, ?, ?, ?, ?)
    ";
    $addItemStmt = $pdo->prepare($addItemSql);
    
    foreach ($validatedItems as $item) {
        $addItemStmt->execute([
            $orderId,
            $item['dishId'],
            $item['quantity'],
            $item['price'],
            $item['specialInstructions']
        ]);
    }
    
    // Create payment transaction
    $createTransactionSql = "
        INSERT INTO payment_transactions (
            order_id, amount, payment_method, status
        ) VALUES (?, ?, ?, 'pending')
    ";
    $createTransactionStmt = $pdo->prepare($createTransactionSql);
    $createTransactionStmt->execute([
        $orderId,
        $totalAmount,
        $paymentMethod
    ]);
    
    // Commit transaction
    $pdo->commit();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Order created successfully',
        'data' => [
            'orderId' => (int)$orderId,
            'customerId' => $customerId,
            'status' => 'processing',
            'totalAmount' => (float)$totalAmount,
            'deliveryAddress' => $deliveryAddress,
            'paymentMethod' => $paymentMethod,
            'paymentStatus' => 'pending',
            'items' => $validatedItems,
            'createdAt' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (PDOException $e) {
    // Rollback transaction on error
    $pdo->rollBack();
    
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
