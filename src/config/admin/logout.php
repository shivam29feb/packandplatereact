<?php
// Security headers
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Include database connection if needed for logging
require_once '../connection.php';

// Clear all session variables
$_SESSION = array();

// Delete the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Destroy the session
session_destroy();

// Clear any auth tokens from cookies
setcookie('admin_auth_token', '', time() - 3600, '/', '', true, true);
setcookie('PHPSESSID', '', time() - 3600, '/', '', true, true);

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Admin logged out successfully',
    'timestamp' => time()
]);
?>