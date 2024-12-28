<?php
$allowed_origins = array(
    "http://localhost:3000",
    "http://packandplate29febreact.rf.gd"
);

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $origin);
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log the request method and raw input
error_log("=== New Signup Request ===");
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Raw Input: " . file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include database connection
require_once __DIR__ . '/../connection.php';

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    // Test database connection
    $pdo->query('SELECT 1');
    error_log("Database connection successful");
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection error: ' . $e->getMessage()
    ]);
    exit;
}

// Decode JSON input
$raw_input = file_get_contents("php://input");
error_log("Raw input received: " . $raw_input);

$data = json_decode($raw_input, true);
error_log("Decoded data: " . print_r($data, true));

$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Log received data
error_log("Processed data - Username: $username, Email: $email");

// Validate input
if (empty($username) || empty($email) || empty($password)) {
    error_log("Validation failed - empty fields detected");
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required'
    ]);
    exit;
}

try {
    $pdo->beginTransaction();
    error_log("Transaction started");

    // Check for existing user
    $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM users WHERE user_username = ? OR user_email = ?");
    $stmtCheck->execute([$username, $email]);
    $exists = $stmtCheck->fetchColumn();
    error_log("User existence check completed. Exists: " . ($exists ? 'yes' : 'no'));

    if ($exists) {
        $pdo->rollBack();
        error_log("User already exists");
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'User already exists'
        ]);
        exit;
    }

    // Insert new user
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (user_username, user_email, user_password_hash, user_created_at) 
                          VALUES (?, ?, ?, ?)");
    
    $result = $stmt->execute([$username, $email, $hashedPassword, date('Y-m-d H:i:s')]);
    error_log("Insert statement executed. Success: " . ($result ? 'yes' : 'no'));

    if ($result) {
        $userId = $pdo->lastInsertId();
        $_SESSION['user_id'] = $userId;
        $pdo->commit();
        error_log("Transaction committed. New user ID: $userId");
        
        echo json_encode([
            'success' => true,
            'message' => 'User registered successfully',
            'userId' => $userId
        ]);
    } else {
        throw new Exception('Failed to insert user');
    }
} catch (Exception $e) {
    $pdo->rollBack();
    error_log("Error in signup process: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error during signup: ' . $e->getMessage()
    ]);
}
