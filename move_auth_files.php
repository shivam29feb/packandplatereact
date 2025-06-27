<?php
// Source and destination directories
$sourceDir = __DIR__ . '/src/config/auth';
$destDir = __DIR__ . '/public/api/auth';

// Create destination directory if it doesn't exist
if (!file_exists($destDir)) {
    mkdir($destDir, 0777, true);
}

// Get all PHP files in the source directory
$files = glob($sourceDir . '/*.php');

// Copy each file to the destination directory
foreach ($files as $file) {
    $destFile = $destDir . '/' . basename($file);
    if (copy($file, $destFile)) {
        echo "Copied: " . basename($file) . "\n";
        
        // Update the require_once path in the copied file
        $content = file_get_contents($destFile);
        $newContent = str_replace(
            "require_once __DIR__ . '/../connection.php';",
            "require_once __DIR__ . '/../../../src/config/connection.php';",
            $content
        );
        file_put_contents($destFile, $newContent);
    } else {
        echo "Failed to copy: " . basename($file) . "\n";
    }
}

echo "\nAll auth files have been copied to the public directory.\n";
echo "You can now access them at: http://localhost/packandplatereact/public/api/auth/\n";
?>
