<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

// Read JSON body
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {

    /* =======================
       READ (GET)
    ======================= */
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("
                SELECT t.*, u.name AS user_name
                FROM tasks t
                LEFT JOIN users u ON u.id = t.user_id
                WHERE t.id = ?
            ");
            $stmt->execute([$id]);
            $task = $stmt->fetch();

            if (!$task) {
                http_response_code(404);
                echo json_encode(["error" => "Task not found"]);
                exit;
            }

            echo json_encode($task);
        } else {
            $stmt = $pdo->query("
                SELECT t.*, u.name AS user_name
                FROM tasks t
                LEFT JOIN users u ON u.id = t.user_id
                ORDER BY t.created_at DESC
            ");
            echo json_encode($stmt->fetchAll());
        }
        break;

    /* =======================
       CREATE (POST)
    ======================= */
    case 'POST':
        if (!isset($input['name'])) {
            http_response_code(400);
            echo json_encode(["error" => "Task name is required"]);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO tasks (code, name, due_date, priority_level, user_id)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['code'] ?? null,
            $input['name'],
            $input['due_date'] ?? null,
            $input['priority_level'] ?? null,
            $input['user_id'] ?? null
        ]);

        http_response_code(201);
        echo json_encode([
            "message" => "Task created",
            "id" => $pdo->lastInsertId()
        ]);
        break;

    /* =======================
       UPDATE (PUT)
    ======================= */
    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Task ID required"]);
            exit;
        }

        $stmt = $pdo->prepare("
            UPDATE tasks
            SET code = ?, name = ?, due_date = ?, priority_level = ?, user_id = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $input['code'] ?? null,
            $input['name'] ?? null,
            $input['due_date'] ?? null,
            $input['priority_level'] ?? null,
            $input['user_id'] ?? null,
            $id
        ]);

        echo json_encode(["message" => "Task updated"]);
        break;

    /* =======================
       DELETE (DELETE)
    ======================= */
    case 'DELETE':
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Task ID required"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(["message" => "Task deleted"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}
