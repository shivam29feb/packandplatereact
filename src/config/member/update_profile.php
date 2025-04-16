<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include database connection
require_once '../connection.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST or PATCH requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate input
if (!isset($data['memberId']) || empty($data['memberId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Member ID is required']);
    exit();
}

$memberId = (int)$data['memberId'];

try {
    // Start transaction
    $pdo->beginTransaction();
    
    // Check if member exists
    $checkMemberSql = "SELECT member_id FROM member WHERE member_id = ?";
    $checkMemberStmt = $pdo->prepare($checkMemberSql);
    $checkMemberStmt->execute([$memberId]);
    
    if ($checkMemberStmt->rowCount() === 0) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Member not found']);
        exit();
    }
    
    // Build update query
    $updateFields = [];
    $updateParams = [];
    
    // Update fields if provided
    if (isset($data['fullName']) && !empty($data['fullName'])) {
        $updateFields[] = "full_name = ?";
        $updateParams[] = $data['fullName'];
    }
    
    if (isset($data['phone']) && !empty($data['phone'])) {
        $updateFields[] = "phone_number = ?";
        $updateParams[] = $data['phone'];
    }
    
    if (isset($data['address'])) {
        $updateFields[] = "address = ?";
        $updateParams[] = $data['address'];
    }
    
    if (isset($data['businessName']) && !empty($data['businessName'])) {
        $updateFields[] = "business_name = ?";
        $updateParams[] = $data['businessName'];
    }
    
    // If no fields to update, return error
    if (empty($updateFields)) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        exit();
    }
    
    // Add member ID to params
    $updateParams[] = $memberId;
    
    // Update member
    $updateMemberSql = "UPDATE member SET " . implode(", ", $updateFields) . " WHERE member_id = ?";
    $updateMemberStmt = $pdo->prepare($updateMemberSql);
    $updateMemberStmt->execute($updateParams);
    
    // Check if user exists in users table
    $checkUserSql = "
        SELECT u.user_id 
        FROM users u
        JOIN member_profiles mp ON u.user_id = mp.user_id
        WHERE mp.profile_id = ?
    ";
    $checkUserStmt = $pdo->prepare($checkUserSql);
    $checkUserStmt->execute([$memberId]);
    $userId = $checkUserStmt->fetchColumn();
    
    if ($userId) {
        // Update member_profiles table
        $updateProfileFields = [];
        $updateProfileParams = [];
        
        if (isset($data['fullName']) && !empty($data['fullName'])) {
            $updateProfileFields[] = "full_name = ?";
            $updateProfileParams[] = $data['fullName'];
        }
        
        if (isset($data['phone']) && !empty($data['phone'])) {
            $updateProfileFields[] = "phone_number = ?";
            $updateProfileParams[] = $data['phone'];
        }
        
        if (isset($data['address'])) {
            $updateProfileFields[] = "address = ?";
            $updateProfileParams[] = $data['address'];
        }
        
        if (isset($data['businessName']) && !empty($data['businessName'])) {
            $updateProfileFields[] = "business_name = ?";
            $updateProfileParams[] = $data['businessName'];
        }
        
        if (!empty($updateProfileFields)) {
            $updateProfileParams[] = $userId;
            
            $updateProfileSql = "UPDATE member_profiles SET " . implode(", ", $updateProfileFields) . " WHERE user_id = ?";
            $updateProfileStmt = $pdo->prepare($updateProfileSql);
            $updateProfileStmt->execute($updateProfileParams);
        }
    }
    
    // Commit transaction
    $pdo->commit();
    
    // Get updated profile
    $profileSql = "
        SELECT 
            m.member_id AS id,
            m.full_name AS fullName,
            m.email,
            m.phone_number AS phone,
            m.address,
            m.business_name AS businessName,
            m.status,
            m.registration_date AS registrationDate,
            m.last_login AS lastLogin
        FROM member m
        WHERE m.member_id = ?
    ";
    
    $profileStmt = $pdo->prepare($profileSql);
    $profileStmt->execute([$memberId]);
    $profile = $profileStmt->fetch(PDO::FETCH_ASSOC);
    
    // Format dates
    if ($profile['registrationDate']) {
        $profile['registrationDate'] = date('Y-m-d', strtotime($profile['registrationDate']));
    }
    if ($profile['lastLogin']) {
        $profile['lastLogin'] = date('Y-m-d H:i:s', strtotime($profile['lastLogin']));
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully',
        'data' => $profile
    ]);
    
} catch (PDOException $e) {
    // Rollback transaction
    $pdo->rollBack();
    
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
