<?php
// Set a custom error handler to ensure JSON responses even on errors
set_error_handler(function($severity, $message, $file, $line) {
    // We want to suppress the default PHP error handler
    error_reporting(0);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal Server Error',
        'details' => [
            'message' => $message,
            'file' => 'file',
            'line' => 'line'
        ]
    ]);
    exit;
});

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Get database credentials from environment variables
$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASSWORD') ?: '';
$dbname = getenv('DB_NAME') ?: 'money_wise';
$port = getenv('DB_PORT') ?: 3306;

// Create connection with error handling
$conn = new mysqli($host, $user, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    // Log error but don't expose details in production
    error_log("Database connection failed: " . $conn->connect_error);
    http_response_code(500);
    // Use the same JSON structure for consistency
    die(json_encode([
        "success" => false, 
        "error" => "Database connection failed. Please try again later."
    ]));
}

// Set charset to utf8mb4 for proper character support
$conn->set_charset("utf8mb4");
?>