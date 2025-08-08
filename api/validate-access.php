<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Read the request body
        $requestBody = file_get_contents('php://input');
        
        // Debug: Log the received request
        error_log("Received request: " . $requestBody);
        
        // Parse JSON
        $data = json_decode($requestBody, true);
        
        if (!$data || !isset($data['code'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid JSON or missing code']);
            exit;
        }
        
        // Valid access codes - Saskatchewan Polytechnic CMP Converter
        $validCodes = [
            'J1an9xi!',           // Primary access code
            'CMP-2025',           // Secondary access code  
            'Test-2025'           // Testing/backup access code
        ];
        
        $submittedCode = trim($data['code']);
        
        // Debug: Log the submitted code (first 3 chars only for security)
        error_log("Submitted code starts with: " . substr($submittedCode, 0, 3) . "...");
        
        // Check if code is valid
        if (in_array($submittedCode, $validCodes)) {
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Access granted']);
            
            // Log successful access (without storing the code)
            error_log("CMP Converter access granted at " . date('Y-m-d H:i:s'));
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid access code']);
            
            // Log failed attempts (for security monitoring)
            error_log("CMP Converter access denied at " . date('Y-m-d H:i:s'));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
        
        // Log server errors
        error_log("CMP Converter validation error: " . $e->getMessage());
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>