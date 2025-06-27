<?php
// Include database connection
require_once __DIR__ . '/../../../src/config/connection.php';

// Admin user details
$username = 'sysadmin';
$email = 'admin@packandplate.com';
$password = 'Admin@123';
$userType = 'admin';

// Hash the password
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

try {
    // Check if user already exists
    $checkStmt = $pdo->prepare("SELECT user_id FROM users WHERE user_email = ?");
    $checkStmt->execute([$email]);
    
    if ($checkStmt->rowCount() > 0) {
        // User exists, update the password
        $updateStmt = $pdo->prepare("UPDATE users SET user_password_hash = ?, user_username = ?, user_type = ?, user_status = 'active' WHERE user_email = ?");
        $updateStmt->execute([$passwordHash, $username, $userType, $email]);
        echo "Admin user updated successfully!";
    } else {
        // User doesn't exist, create a new one
        $insertStmt = $pdo->prepare("INSERT INTO users (user_username, user_email, user_password_hash, user_type, user_status) VALUES (?, ?, ?, ?, 'active')");
        $insertStmt->execute([$username, $email, $passwordHash, $userType]);
        echo "Admin user created successfully!";
    }
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
?>
