<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
define("SERVIDOR_BD","localhost");
define("USUARIO_BD","jose");
define("CLAVE_BD","josefa");
define("NOMBRE_BD","bd_ruedax");

$_POST = json_decode(file_get_contents("php://input"), true);

$usuario = $_POST["usuario"];
$clave   = $_POST["clave"];

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

    $consulta = "SELECT `user_name`, `clave` FROM `usuarios` WHERE `user_name` = ?";
    $sentencia = $conexion->prepare($consulta);
    $sentencia->execute([$usuario]);

    if ($sentencia->rowCount() > 0) {
        $tupla = $sentencia->fetch(PDO::FETCH_ASSOC);
        if(password_verify($clave, $tupla["clave"])) {
            $respuesta["usuario"] = $tupla["user_name"];
            $respuesta["mensaje"] = "Acceso correcto";
        } else {
            $respuesta["mensaje"] = "Usuario o contraseña incorrectos.";
        }
    } else {
        $respuesta["mensaje"] = "Usuario o contraseña incorrectos.";
    }

} catch (PDOException $e) {
    $respuesta["mensaje"] = "Error BBDD: ".$e->getMessage();
}

echo json_encode($respuesta);
