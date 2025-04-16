<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include database connection
require_once '../connection.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Check if user ID is provided
if (!isset($_GET['userId']) || empty($_GET['userId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit();
}

$userId = (int)$_GET['userId'];

try {
    // Get user settings
    $sql = "
        SELECT 
            theme, 
            font_size AS fontSize, 
            reduced_motion AS reducedMotion, 
            high_contrast AS highContrast,
            email_notifications AS emailNotifications,
            push_notifications AS pushNotifications,
            sms_notifications AS smsNotifications
        FROM user_settings
        WHERE user_id = ?
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $settings = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // If no settings found, create default settings
    if (!$settings) {
        $defaultSettings = [
            'theme' => 'light',
            'fontSize' => 'medium',
            'reducedMotion' => false,
            'highContrast' => false,
            'emailNotifications' => true,
            'pushNotifications' => true,
            'smsNotifications' => false
        ];
        
        // Insert default settings
        $insertSql = "
            INSERT INTO user_settings (
                user_id, theme, font_size, reduced_motion, high_contrast,
                email_notifications, push_notifications, sms_notifications
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ";
        $insertStmt = $pdo->prepare($insertSql);
        $insertStmt->execute([
            $userId,
            $defaultSettings['theme'],
            $defaultSettings['fontSize'],
            $defaultSettings['reducedMotion'] ? 1 : 0,
            $defaultSettings['highContrast'] ? 1 : 0,
            $defaultSettings['emailNotifications'] ? 1 : 0,
            $defaultSettings['pushNotifications'] ? 1 : 0,
            $defaultSettings['smsNotifications'] ? 1 : 0
        ]);
        
        $settings = $defaultSettings;
    }
    
    // Format boolean values
    $settings['reducedMotion'] = (bool)$settings['reducedMotion'];
    $settings['highContrast'] = (bool)$settings['highContrast'];
    $settings['emailNotifications'] = (bool)$settings['emailNotifications'];
    $settings['pushNotifications'] = (bool)$settings['pushNotifications'];
    $settings['smsNotifications'] = (bool)$settings['smsNotifications'];
    
    // Prepare response
    $response = [
        'notifications' => [
            [
                'id' => 'order-updates',
                'label' => 'Order Updates',
                'description' => 'Notify about order status changes',
                'email' => $settings['emailNotifications'],
                'push' => $settings['pushNotifications'],
                'sms' => $settings['smsNotifications']
            ],
            [
                'id' => 'promotions',
                'label' => 'Promotions & Offers',
                'description' => 'Notify about special offers and promotions',
                'email' => $settings['emailNotifications'],
                'push' => $settings['pushNotifications'],
                'sms' => false
            ],
            [
                'id' => 'new-dishes',
                'label' => 'New Dishes',
                'description' => 'Notify when new dishes are added',
                'email' => $settings['emailNotifications'],
                'push' => $settings['pushNotifications'],
                'sms' => false
            ],
            [
                'id' => 'platform-updates',
                'label' => 'Platform Updates',
                'description' => 'Notify about platform updates and new features',
                'email' => $settings['emailNotifications'],
                'push' => false,
                'sms' => false
            ]
        ],
        'privacy' => [
            [
                'id' => 'order-history',
                'label' => 'Order History',
                'description' => 'Allow us to use your order history for recommendations',
                'enabled' => true
            ],
            [
                'id' => 'location',
                'label' => 'Location Services',
                'description' => 'Allow us to use your location for delivery and recommendations',
                'enabled' => true
            ],
            [
                'id' => 'analytics',
                'label' => 'Analytics Collection',
                'description' => 'Allow us to collect anonymous usage data to improve the platform',
                'enabled' => true
            ]
        ],
        'appearance' => [
            'theme' => $settings['theme'],
            'fontSize' => $settings['fontSize'],
            'reducedMotion' => $settings['reducedMotion'],
            'highContrast' => $settings['highContrast']
        ]
    ];
    
    // Return response
    echo json_encode([
        'success' => true,
        'data' => $response
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
