<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$host = "localhost";
$db   = "my_tasks";
$user = "root";
$pass = "";
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['fullname'], $data['username'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

// Check if username already exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
$stmt->execute([$data['username']]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(["error" => "Username already exists"]);
    exit;
}

// Insert new user
$stmt = $pdo->prepare("INSERT INTO users (name, username, password) VALUES (?, ?, ?)");
try {
    $stmt->execute([
        $data['fullname'],
        $data['username'],
        password_hash($data['password'], PASSWORD_DEFAULT)
    ]);
    $user_id = $pdo->lastInsertId();
    $user = [
        "id" => $user_id,
        "name" => $data['fullname'],
        "username" => $data['username']
    ];
    $token = base64_encode(json_encode([
        "user_id" => $user_id,
        "name" => $data['fullname'],
        "username" => $data['username'],
        "exp" => time() + 3600
    ]));
    echo json_encode([
        "user" => $user,
        "token" => $token
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Registration failed"]);
}
