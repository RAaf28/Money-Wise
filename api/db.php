<?php
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
    die(json_encode(array("error" => "Database connection failed. Please try again later.")));
}

// Set charset to utf8mb4 for proper character support
$conn->set_charset("utf8mb4");
?>