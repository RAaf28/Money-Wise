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


session_start();

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(array("error" => "Email and password are required"));
    exit();
}

$email = $data->email;
$password = $data->password;

// Use prepared statements to prevent SQL injection
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
        $_SESSION['email'] = $email;
        $_SESSION['user_id'] = $row['id'];
        echo json_encode(array("success" => true, "user" => array("id" => $row['id'], "name" => $row['name'])));
    } else {
        http_response_code(401);
        echo json_encode(array("success" => false, "error" => "Invalid password"));
    }
} else {
    http_response_code(404);
    echo json_encode(array("success" => false, "error" => "User not found"));
}

$stmt->close();
$conn->close();
?>