<?php
// ===== CORS HEADERS =====
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ===== DATABASE CONNECTION =====
$host = "localhost";
$db   = "my_tasks";
$user = "root";
$pass = "";
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

// ===== HELPER TO GET JSON BODY =====
function getJsonBody() {
    $body = file_get_contents("php://input");
    return json_decode($body, true);
}

// ===== ROUTING =====
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case "GET":
        if ($id) {
            $stmt = $pdo->prepare("SELECT id, code, name, username, created_at FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch();
            echo json_encode($user ?: []);
        } else {
            $stmt = $pdo->query("SELECT id, code, name, username, created_at FROM users");
            $users = $stmt->fetchAll();
            echo json_encode($users);
        }
        break;

    case "POST":
        $data = getJsonBody();
        if (!isset($data['name'], $data['username'], $data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            exit;
        }

        // Optional: generate a random code if not provided
        $code = $data['code'] ?? "USER-" . rand(1000, 9999);

        $stmt = $pdo->prepare("INSERT INTO users (code, name, username, password) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $code,
            $data['name'],
            $data['username'],
            password_hash($data['password'], PASSWORD_DEFAULT) // Always hash passwords
        ]);

        $newId = $pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT id, code, name, username, created_at FROM users WHERE id = ?");
        $stmt->execute([$newId]);
        echo json_encode($stmt->fetch());
        break;

    case "PUT":
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Missing user ID"]);
            exit;
        }

        $data = getJsonBody();
        $fields = [];
        $values = [];

        if (isset($data['name'])) {
            $fields[] = "name = ?";
            $values[] = $data['name'];
        }
        if (isset($data['username'])) {
            $fields[] = "username = ?";
            $values[] = $data['username'];
        }
        if (isset($data['password'])) {
            $fields[] = "password = ?";
            $values[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if ($fields) {
            $values[] = $id;
            $stmt = $pdo->prepare("UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?");
            $stmt->execute($values);
        }

        $stmt = $pdo->prepare("SELECT id, code, name, username, created_at FROM users WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
        break;

    case "DELETE":
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Missing user ID"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["deleted_id" => $id]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}
