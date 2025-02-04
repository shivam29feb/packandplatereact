
<?php
// ...existing code...

// Code for member login API
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Validate input
    if (empty($username) || empty($password)) {
        echo json_encode(['error' => 'Username and password are required']);
        exit;
    }

    // Check credentials (this is just a simple example, you should use a database and proper hashing in a real application)
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE user_username = ?");
        $stmt->execute([$username]);
        $exists = $stmt->fetchColumn();

        if (!$exists) {
            echo json_encode(['error' => 'User does not exist']);
            exit;
        }
        else{

            
            $stmt = $pdo->prepare("SELECT user_password_hash FROM users WHERE user_username = ?");
            $stmt->execute([$username]);
            $row = $stmt->fetch();

            if (!password_verify($password, $row['user_password_hash'])) {
                echo json_encode(['error' => 'Invalid password']);
                $_SESSION['user_id'] = $username;
                if($_SESSION['user_id'] === $username)
                {
                    echo json_encode(['success' => true, 'message' => 'Login successful']);
                }
                exit;
            }
            
            
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;
}

// ...existing code...
?>