<?php
// Define environment
$is_production = isset($_SERVER['SERVER_NAME']) && $_SERVER['SERVER_NAME'] === 'packandplate29febreact.rf.gd';

try {
    if ($is_production) {
        // Production database connection
        $pdo = new PDO(
            'mysql:host=sql104.infinityfree.com;dbname=if0_37966595_packandplate',
            'if0_37966595',
            'gXIVABNCUx'
        );
    } else {
        // Development database connection
        $pdo = new PDO(
            'mysql:host=localhost;dbname=packandplate',
            'root',
            ''
        );
    }
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    exit('Database error: ' . $e->getMessage());
}
?>