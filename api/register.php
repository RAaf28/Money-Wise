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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("error" => "Method Not Allowed"));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->name) || !isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(array("error" => "Name, email and password are required"));
    exit();
}

$name = $data->name;
$email = $data->email;
$password = $data->password;

// Validate input
if (empty(trim($name))) {
    http_response_code(400);
    echo json_encode(array("error" => "Name cannot be empty"));
    exit();
}
if (strlen($email) < 3) {
    http_response_code(400);
    echo json_encode(array("error" => "Email must be at least 3 characters"));
    exit();
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(array("error" => "Password must be at least 6 characters"));
    exit();
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(409);
    echo json_encode(array("error" => "Email already exists"));
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// Use prepared statements to prevent SQL injection
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashed_password);

if ($stmt->execute()) {
    $user_id = $stmt->insert_id;
    http_response_code(201);
    echo json_encode(array("success" => true, "user" => array("id" => $user_id, "name" => $name)));
} else {
    http_response_code(500);
    echo json_encode(array("error" => "Registration failed. Please try again."));
}

$stmt->close();
$conn->close();
?>