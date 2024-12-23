
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
    if ($username === 'member' && $password === 'password') {
        echo json_encode(['success' => true, 'message' => 'Login successful']);
    } else {
        echo json_encode(['error' => 'Invalid username or password']);
    }
    exit;
}

// ...existing code...
?>