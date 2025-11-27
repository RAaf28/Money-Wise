<?php
// Set a custom error handler to ensure JSON responses even on errors
set_error_handler(function($severity, $message, $file, $line) {
    // We want to suppress the default PHP error handler
    error_reporting(0);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal Server Error - See debug info',
        'debug_message' => $message,
        'debug_file' => $file,
        'debug_line' => $line
    ]);
    exit;
});

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Get the connection string from Vercel's environment variables
$db_url = getenv('POSTGRES_URL');

if (!$db_url) {
    http_response_code(500);
    die(json_encode([
        "success" => false, 
        "error" => "Database connection string is not configured."
    ]));
}

// Parse the connection string
$db_parts = parse_url($db_url);

$host = $db_parts['host'];
$port = $db_parts['port'];
$user = $db_parts['user'];
$password = $db_parts['pass'];
$dbname = ltrim($db_parts['path'], '/');

// Build the connection string for pg_connect
$conn_string = "host={$host} port={$port} dbname={$dbname} user={$user} password={$password}";

// Create connection
$conn = pg_connect($conn_string);

// Check connection
if (!$conn) {
    // Log error but don't expose details
    error_log("Database connection failed.");
    http_response_code(500);
    die(json_encode([
        "success" => false, 
        "error" => "Database connection failed. Please try again later."
    ]));
}
?>