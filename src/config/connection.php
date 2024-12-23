<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=packandplate', 'root', '');
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    exit('Database error: ' . $e->getMessage());
}
?>