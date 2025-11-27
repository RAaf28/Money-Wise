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

    $result = pg_query_params($conn, 'SELECT role, content, timestamp FROM chat_history WHERE user_id = $1 ORDER BY timestamp ASC', array($user_id));

    if (!$result) {
        http_response_code(500);
        echo json_encode(array("error" => "Query failed."));
        exit();
    }

    $history = array();
    while ($row = pg_fetch_assoc($result)) {
        $history[] = $row;
    }

    echo json_encode($history);
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

    $result = pg_query_params($conn, 'INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)', array($user_id, $role, $content));

    if ($result) {
        echo json_encode(array("success" => true, "message" => "Message saved"));
    } else {
        http_response_code(500);
        echo json_encode(array("success" => false, "error" => "Failed to save message"));
    }
}

pg_close($conn);
?>