<?php
include 'db.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->username) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(array("error" => "Username and password are required"));
    exit();
}

$username = $data->username;
$password = $data->password;

// Validate input
if (strlen($username) < 3) {
    http_response_code(400);
    echo json_encode(array("error" => "Username must be at least 3 characters"));
    exit();
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(array("error" => "Password must be at least 6 characters"));
    exit();
}

// Check if username already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(409);
    echo json_encode(array("error" => "Username already exists"));
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// Use prepared statements to prevent SQL injection
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $hashed_password);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(array("message" => "User registered successfully", "user_id" => $stmt->insert_id));
} else {
    http_response_code(500);
    echo json_encode(array("error" => "Registration failed. Please try again."));
}

$stmt->close();
$conn->close();
?>