<?php
// Start session at the very beginning
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set CORS headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Include database connection
require_once __DIR__ . '/../../../src/config/connection.php';

// Decode JSON input
$raw_input = file_get_contents("php://input");
$data = json_decode($raw_input, true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$userType = $data['userType'] ?? 'member';

// Validate input
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

try {
    // Check if user exists with the given email and matching user type
    $query = "SELECT user_id, user_username, user_email, user_password_hash, user_type 
              FROM users 
              WHERE user_email = ?";
    $params = [$email];
    
    // Only filter by user_type if it's not empty and not 'customer' (since customer is stored as 'customer' in DB)
    if (!empty($userType) && $userType !== 'customer') {
        $query .= " AND user_type = ?";
        $params[] = $userType === 'admin' ? 'system-admin' : $userType;
    } else {
        // For customer login, check if user exists with customer type
        $query .= " AND user_type = 'customer'";
    }
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

        // Special case for admin login during development
                // Verify password
                if (password_verify($password, $user['user_password_hash'])) {
        // Set session variables
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_type'] = $user['user_type'];

        // Update last login time
        $updateStmt = $pdo->prepare("UPDATE users SET user_last_login = NOW() WHERE user_id = ?");
        $updateStmt->execute([$user['user_id']]);

        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user['user_id'],
                'username' => $user['user_username'],
                'email' => $user['user_email'],
                'type' => $user['user_type']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>


