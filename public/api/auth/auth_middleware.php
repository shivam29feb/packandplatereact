<?php
/**
 * Authentication and Authorization Middleware
 * 
 * This file provides functions to check if a user is authenticated
 * and has the appropriate role to access a resource.
 */

/**
 * Check if user is authenticated
 * 
 * @return bool True if user is authenticated, false otherwise
 */
function isAuthenticated() {
    session_start();
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Check if user has required role
 * 
 * @param string|array $requiredRoles Role or array of roles required to access the resource
 * @return bool True if user has required role, false otherwise
 */
function hasRole($requiredRoles) {
    if (!isAuthenticated()) {
        return false;
    }
    
    // Convert single role to array for consistent handling
    if (!is_array($requiredRoles)) {
        $requiredRoles = [$requiredRoles];
    }
    
    return in_array($_SESSION['user_type'], $requiredRoles);
}

/**
 * Require authentication to access a page
 * 
 * @param string $redirectUrl URL to redirect to if not authenticated
 * @return void
 */
function requireAuth($redirectUrl = '/login') {
    if (!isAuthenticated()) {
        header('Location: ' . $redirectUrl);
        exit;
    }
}

/**
 * Require specific role to access a page
 * 
 * @param string|array $requiredRoles Role or array of roles required to access the resource
 * @param string $redirectUrl URL to redirect to if not authorized
 * @return void
 */
function requireRole($requiredRoles, $redirectUrl = '/login') {
    if (!hasRole($requiredRoles)) {
        header('Location: ' . $redirectUrl);
        exit;
    }
}

/**
 * Get current user ID
 * 
 * @return int|null User ID if authenticated, null otherwise
 */
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

/**
 * Get current user type
 * 
 * @return string|null User type if authenticated, null otherwise
 */
function getCurrentUserType() {
    return $_SESSION['user_type'] ?? null;
}

/**
 * API version of require authentication
 * Returns JSON error response instead of redirecting
 */
function apiRequireAuth() {
    if (!isAuthenticated()) {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Authentication required'
        ]);
        exit;
    }
}

/**
 * API version of require role
 * Returns JSON error response instead of redirecting
 */
function apiRequireRole($requiredRoles) {
    if (!hasRole($requiredRoles)) {
        header('Content-Type: application/json');
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'You do not have permission to access this resource'
        ]);
        exit;
    }
}
?>