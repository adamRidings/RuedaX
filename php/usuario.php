<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
define("SERVIDOR_BD","localhost");
define("USUARIO_BD","jose");
define("CLAVE_BD","josefa");
define("NOMBRE_BD","bd_ruedax");

$_POST = json_decode(file_get_contents("php://input"), true);

$respuesta = [];

try {
    $conexion = new PDO(
        "mysql:host=".SERVIDOR_BD.";dbname=".NOMBRE_BD,
        USUARIO_BD,
        CLAVE_BD,
        [
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'",
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );

    $id = $_POST["id_usuario"] ?? null;
    $email = trim($_POST["email"] ?? "");
    $user_name = trim($_POST["user_name"] ?? "");

    if (!$id || !$email || !$user_name) {
        $respuesta["mensaje"] = "Faltan datos obligatorios.";
        echo json_encode($respuesta);
        exit;
    }

    // Validación email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $respuesta["mensaje"] = "Formato de email no válido.";
        echo json_encode($respuesta);
        exit;
    }

    // Validación username
    if (!preg_match("/^[a-zA-Z0-9_]{3,20}$/", $user_name)) {
        $respuesta["mensaje"] = "El nombre de usuario no es válido (solo letras, números y guiones bajos).";
        echo json_encode($respuesta);
        exit;
    }

    // Comprobar si el email ya existe para otro usuario
    $sql = "SELECT id_usuario FROM usuarios WHERE email = ? AND id_usuario != ?";
    $stmt = $conexion->prepare($sql);
    $stmt->execute([$email, $id]);

    if ($stmt->rowCount() > 0) {
        $respuesta["mensaje"] = "El email ya está en uso.";
        echo json_encode($respuesta);
        exit;
    }

    // Comprobar si el nombre de usuario ya existe para otro usuario
    $sql = "SELECT id_usuario FROM usuarios WHERE user_name = ? AND id_usuario != ?";
    $stmt = $conexion->prepare($sql);
    $stmt->execute([$user_name, $id]);

    if ($stmt->rowCount() > 0) {
        $respuesta["mensaje"] = "El nombre de usuario ya está en uso.";
        echo json_encode($respuesta);
        exit;
    }

    // Actualizar usuario
    $consulta = "UPDATE  `usuarios` SET `email`= ?,`user_name`= ? WHERE `id_usuario` = ?";
    $sentencia = $conexion->prepare($consulta);
    $datosUpdate = [
        $email,
        $user_name,
        $id
    ];
    $sentencia->execute($datosUpdate);

    if ($sentencia->rowCount() > 0) {
        $respuesta["mensaje"] = "Usuario actualizado correctamente.";
        $respuesta["email"] = $email;
        $respuesta["user_name"] = $user_name;
    } else {
        $respuesta["mensaje"] = "No se realizaron cambios.";
    }

} catch (PDOException $e) {
    $respuesta["mensaje"] = "Error BBDD: ".$e->getMessage();
}

echo json_encode($respuesta);
