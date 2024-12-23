<?php
require_once __DIR__ . '/../../config/connection.php';

// API logic for member signup
class Signup {
    public function signup($username, $email, $password) {
        global $pdo;

        try {
            $stmtGetUser = $pdo->prepare("SELECT user_username, user_email
                                          FROM users
                                          WHERE user_username = ? OR user_email = ?");
            $stmtGetUser->bindValue(1, $username);
            $stmtGetUser->bindValue(2, $email);
            $stmtGetUser->execute();
            $existingUser = $stmtGetUser->fetch(PDO::FETCH_ASSOC);

            if ($existingUser) {
                echo "User already exists";
                return;
            } else {
                $stmtInsertUser = $pdo->prepare("INSERT INTO users (user_username, user_email, user_password_hash, user_created_at)
                                                 VALUES (?, ?, ?, ?)");
                $stmtInsertUser->bindValue(1, $username);
                $stmtInsertUser->bindValue(2, $email);
                // PASSWORD_BCRYPT algorithm is used to encrypt the password
                $password = password_hash($password, PASSWORD_BCRYPT);
                $stmtInsertUser->bindValue(3, $password);
                $stmtInsertUser->bindValue(4, date('Y-m-d H:i:s'));

                $stmtInsertUser->execute();

                if ($stmtInsertUser->rowCount() > 0) {
                    $stmtGetUserId = $pdo->prepare("SELECT user_id
                                                    FROM users
                                                    WHERE user_username = ?");
                    $stmtGetUserId->bindValue(1, $username);
                    $stmtGetUserId->execute();
                    $userId = $stmtGetUserId->fetchColumn();
                    session_start();
                    $_SESSION['user_id'] = $userId;

                    if (isset($_SESSION['user_id'])) {
                        echo "<script>
                        alert('Signup successful');
                        window.location.href = '../../pages/member-only/member/dashboard.php';
                        </script>";
                    }
                }
            }
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
    }
}

?>
