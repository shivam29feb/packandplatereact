<?php
session_start();
require_once '../connection.php'; // Include the database connection

// Clear session data
$_SESSION = array();

// Destroy the session
session_destroy();

// Return a JSON response
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Admin logged out successfully.']);
?>