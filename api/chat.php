<?php
include 'db.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['user_id'])) {
        http_response_code(400);
        echo json_encode(array("error" => "user_id is required"));
        exit();
    }
    $user_id = $_GET['user_id'];

    $stmt = $conn->prepare("SELECT role, content, timestamp FROM chat_history WHERE user_id = ? ORDER BY timestamp ASC");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $history = array();
    while ($row = $result->fetch_assoc()) {
        $history[] = $row;
    }

    echo json_encode($history);
    $stmt->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->user_id) || !isset($data->role) || !isset($data->content)) {
        http_response_code(400);
        echo json_encode(array("error" => "user_id, role, and content are required"));
        exit();
    }

    $user_id = $data->user_id;
    $role = $data->role;
    $content = $data->content;

    $stmt = $conn->prepare("INSERT INTO chat_history (user_id, role, content) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $role, $content);

    if ($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Message saved"));
    } else {
        http_response_code(500);
        echo json_encode(array("success" => false, "error" => "Failed to save message"));
    }

    $stmt->close();
}

$conn->close();
?>