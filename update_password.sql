USE packandplate;
UPDATE users SET user_password_hash = '$2y$10$4VkkLhQok9bxFW7FsEQvnO4ywHCj6zCwEaTiRw6nyzBH7eE4F5QPS' WHERE user_email = 'member@example.com';
UPDATE users SET user_password_hash = '$2y$10$4VkkLhQok9bxFW7FsEQvnO4ywHCj6zCwEaTiRw6nyzBH7eE4F5QPS' WHERE user_email = 'customer@example.com';
