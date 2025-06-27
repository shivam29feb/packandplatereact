<?php
// Set security headers
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With');
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Clear all session variables
$_SESSION = [];

// Delete the session cookie
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'],
        $params['domain'],
        $params['secure'],
        $params['httponly']
    );
}

// Destroy the session
session_destroy();

// Clear any other auth cookies
$cookies = [
    'PHPSESSID',
    'remember_me',
    'auth_token',
    'XSRF-TOKEN'
];

foreach ($cookies as $cookie) {
    if (isset($_COOKIE[$cookie])) {
        setcookie($cookie, '', time() - 3600, '/', $_SERVER['HTTP_HOST'], false, true);
    }
    setcookie($cookie, '', time() - 3600, '/');
}

// Clear output buffer to prevent any accidental output
if (ob_get_level()) {
    ob_clean();
}

// Send success response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Successfully logged out',
    'timestamp' => time()
]);

exit();
?>
