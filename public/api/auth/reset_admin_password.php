<?php
// Include database connection
require_once __DIR__ . '/../../../src/config/connection.php';

// Admin user details
$email = 'admin@example.com';
$password = 'admin@1234';

// Hash the password
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

try {
    // Update the admin user's password
    $stmt = $pdo->prepare("UPDATE users SET user_password_hash = ? WHERE user_email = ?");
    $result = $stmt->execute([$passwordHash, $email]);
    
    if ($result) {
        echo "Admin password updated successfully!\n";
        echo "Email: $email\n";
        echo "Password: $password\n";
        echo "Hash: $passwordHash\n";
        
        // Verify the password
        echo "Verification: " . (password_verify($password, $passwordHash) ? "Success" : "Failed") . "\n";
        
        // Test login
        $stmt = $pdo->prepare("SELECT user_id, user_username, user_email, user_password_hash, user_type FROM users WHERE user_email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo "\nUser found in database:\n";
            echo "ID: {$user['user_id']}\n";
            echo "Username: {$user['user_username']}\n";
            echo "Email: {$user['user_email']}\n";
            echo "Type: {$user['user_type']}\n";
            echo "Password verification: " . (password_verify($password, $user['user_password_hash']) ? "Success" : "Failed") . "\n";
        } else {
            echo "\nUser not found in database.\n";
        }
    } else {
        echo "Failed to update admin password.\n";
    }
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}
?>
