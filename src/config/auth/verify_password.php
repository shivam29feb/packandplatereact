<?php
$password = "admin@1234";
$hash = "$2y$10$TpmKanDGt1V4Iq9/sRN/A.KYOTqo9Xn8sR87/3HEIGK/IB49K1ww2";
echo "Password: {$password}\n";
echo "Hash: {$hash}\n";
echo "Verification: " . (password_verify($password, $hash) ? "Success" : "Failed") . "\n";
?>
