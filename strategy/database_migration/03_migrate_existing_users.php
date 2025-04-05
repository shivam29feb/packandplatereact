<?php
/**
 * Migration script to move existing users to the new unified system
 * 
 * This script:
 * 1. Migrates admin users to the users table with user_type='admin'
 * 2. Migrates member users to the users table with user_type='member'
 * 3. Creates corresponding entries in member_profiles
 */

// Include database connection
require_once '../../src/config/connection.php';

try {
    $pdo->beginTransaction();
    
    echo "Starting migration process...\n";
    
    // 1. Migrate admins to users table
    echo "Migrating admin users...\n";
    
    // First, check if admins table exists
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'admins'");
    if ($tableCheck->rowCount() > 0) {
        // Get all admins
        $admins = $pdo->query("SELECT * FROM admins")->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($admins as $admin) {
            // Check if admin already exists in users table
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE user_email = ?");
            $stmt->execute([$admin['admin_email']]);
            $exists = $stmt->fetchColumn();
            
            if (!$exists) {
                // Insert admin into users table
                $stmt = $pdo->prepare("INSERT INTO users (
                    user_username, 
                    user_email, 
                    user_password_hash, 
                    user_type, 
                    user_status,
                    user_created_at
                ) VALUES (?, ?, ?, 'admin', 'active', ?)");
                
                $stmt->execute([
                    $admin['admin_username'],
                    $admin['admin_email'],
                    $admin['admin_password_hash'],
                    $admin['admin_created_at'] ?? date('Y-m-d H:i:s')
                ]);
                
                echo "Migrated admin: {$admin['admin_username']}\n";
            } else {
                echo "Admin already exists in users table: {$admin['admin_username']}\n";
            }
        }
    } else {
        echo "Admins table does not exist, skipping admin migration.\n";
    }
    
    // 2. Migrate members to users table
    echo "Migrating member users...\n";
    
    // Check if member table exists
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'member'");
    if ($tableCheck->rowCount() > 0) {
        // Get all members
        $members = $pdo->query("SELECT * FROM member")->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($members as $member) {
            // Check if member already exists in users table
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE user_email = ?");
            $stmt->execute([$member['email']]);
            $exists = $stmt->fetchColumn();
            
            if (!$exists) {
                // Insert member into users table
                $stmt = $pdo->prepare("INSERT INTO users (
                    user_username, 
                    user_email, 
                    user_password_hash, 
                    user_type, 
                    user_status,
                    user_created_at,
                    user_last_login
                ) VALUES (?, ?, ?, 'member', ?, ?, ?)");
                
                // Generate username from email if not available
                $username = explode('@', $member['email'])[0];
                
                $stmt->execute([
                    $username,
                    $member['email'],
                    $member['password_hash'],
                    $member['status'] ?? 'active',
                    $member['registration_date'] ?? date('Y-m-d H:i:s'),
                    $member['last_login'] ?? null
                ]);
                
                $userId = $pdo->lastInsertId();
                
                // Create member profile
                $stmt = $pdo->prepare("INSERT INTO member_profiles (
                    user_id,
                    full_name,
                    phone_number,
                    address,
                    business_name
                ) VALUES (?, ?, ?, ?, ?)");
                
                $stmt->execute([
                    $userId,
                    $member['full_name'],
                    $member['phone_number'] ?? '',
                    $member['address'] ?? '',
                    $member['business_name']
                ]);
                
                echo "Migrated member: {$member['full_name']}\n";
            } else {
                echo "Member already exists in users table: {$member['email']}\n";
            }
        }
    } else {
        echo "Member table does not exist, skipping member migration.\n";
    }
    
    $pdo->commit();
    echo "Migration completed successfully!\n";
    
} catch (Exception $e) {
    $pdo->rollBack();
    echo "Error during migration: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>