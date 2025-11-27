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
$result = pg_query_params($conn, 'SELECT id FROM users WHERE email = $1', array($email));

if (!$result) {
    http_response_code(500);
    echo json_encode(array("error" => "Query failed."));
    exit();
}

if (pg_num_rows($result) > 0) {
    http_response_code(409);
    echo json_encode(array("error" => "Email already exists"));
    pg_close($conn);
    exit();
}

// Use prepared statements to prevent SQL injection
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$insert_result = pg_query_params($conn, 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id', array($name, $email, $hashed_password));


if ($insert_result) {
    $row = pg_fetch_assoc($insert_result);
    $user_id = $row['id'];
    http_response_code(201);
    echo json_encode(array("success" => true, "user" => array("id" => $user_id, "name" => $name)));
} else {
    http_response_code(500);
    echo json_encode(array("error" => "Registration failed. Please try again."));
}

pg_close($conn);
?>