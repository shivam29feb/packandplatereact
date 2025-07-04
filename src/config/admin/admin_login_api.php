<?php
// Enable CORS
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

// Include database connection
require_once __DIR__ . '/../connection.php';

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Decode JSON input
$raw_input = file_get_contents("php://input");
$data = json_decode($raw_input, true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Validate input
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

try {
    // Only allow system-admin users to log in through admin endpoint
    $stmt = $pdo->prepare("
        SELECT user_id, user_username, user_email, user_password_hash, user_type 
        FROM users 
        WHERE user_email = ? AND user_type = 'system-admin'
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Admin user not found']);
        exit;
    }

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
            'message' => 'Admin login successful',
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
    error_log('Admin login error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
