<?php
// Include database connection
require_once __DIR__ . '/../connection.php';

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
    } else {
        echo "Failed to update admin password.\n";
    }
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}
?>
