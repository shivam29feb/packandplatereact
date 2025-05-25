<?php
// Include database connection
require_once __DIR__ . '/../connection.php';

// Password to hash
$password = "customer@1234";

// Generate hash
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Password: $password\n";
echo "Hash: $hash\n";

// Update the customer user
$email = "customer@example.com";
$stmt = $pdo->prepare("UPDATE users SET user_password_hash = ? WHERE user_email = ?");
$result = $stmt->execute([$hash, $email]);

if ($result) {
    echo "Customer password updated successfully!\n";
    
    // Verify the password
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
    echo "Failed to update customer password.\n";
}
?>
