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

session_start();

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->username) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(array("error" => "Username and password are required"));
    exit();
}

$username = $data->username;
$password = $data->password;

// Use prepared statements to prevent SQL injection
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
        $_SESSION['username'] = $username;
        $_SESSION['user_id'] = $row['id'];
        echo json_encode(array("success" => true, "user" => array("id" => $row['id'], "name" => $row['username'])));
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