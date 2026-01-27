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

if (!isset($data['username'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing username or password"]);
    exit;
}

// Fetch user by username
$stmt = $pdo->prepare("SELECT id, username, password, name FROM users WHERE username = ?");
$stmt->execute([$data['username']]);
$user = $stmt->fetch();

if (!$user || !password_verify($data['password'], $user['password'])) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
    exit;
}

// ✅ Login successful — return user info (without password)
unset($user['password']);

// Optional: generate a JWT token (recommended)
$token = base64_encode(json_encode([
    "user_id" => $user['id'],
    "name" => $user['name'],
    "username" => $user['username'],
    "exp" => time() + 3600 // 1 hour expiry
]));

echo json_encode([
    "user" => $user,
    "token" => $token
]);