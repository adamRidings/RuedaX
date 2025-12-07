<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
define("SERVIDOR_BD", "localhost");
define("USUARIO_BD", "jose");
define("CLAVE_BD", "josefa");
define("NOMBRE_BD", "bd_ruedax");
$_POST = json_decode(file_get_contents("php://input"), true);

$nombre = $_POST["nombre"];
$apellido = $_POST["apellido"];
$email = $_POST["email"];
$usuario = $_POST["usuario"];
$clave = $_POST["clave"];
$respuesta = [];

try {
    $conexion = new PDO("mysql:host=" . SERVIDOR_BD . ";dbname=" . NOMBRE_BD, USUARIO_BD, CLAVE_BD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
    $consulta = "SELECT * FROM `usuarios` WHERE `user_name` = ?";
    try {
        $sentencia = $conexion->prepare($consulta);
        $sentencia->execute([$usuario]);

        if ($sentencia->rowCount() > 0) {
            $respuesta["mensaje"] = "Usuario ya en uso";
        } else {
            $clave_hash = password_hash($clave, PASSWORD_BCRYPT);

            $insertar = "INSERT INTO `usuarios` (`nombre`, `apellidos`, `email`, `user_name`, `clave`) VALUES (?, ?, ?, ?, ?)";

            $datosInsertar = [
                $nombre,
                $apellido,
                $email,
                $usuario,
                $clave_hash
            ];
            
            $sentenciaInsertar = $conexion->prepare($insertar);
            $sentenciaInsertar->execute($datosInsertar);

            if ($sentenciaInsertar->rowCount() > 0) {
                $respuesta["mensaje"] = "Acceso correcto";
                
                $selectID = "SELECT `id_usuario` FROM `usuarios` WHERE `user_name` = ?";
                $sentenciaID = $conexion->prepare($selectID);
                $sentenciaID->execute([$usuario]);
                $tupla = $sentenciaID->fetch(PDO::FETCH_ASSOC);
                $respuesta["id_usuario"] = $tupla["id_usuario"];
            } else {
                $respuesta["mensaje"] = "Error al registrar el usuario.";
            }
        }
    } catch (PDOException $e) {
        $respuesta["mensaje"] = "Error consulta: " . $e->getMessage();
    }

    $sentencia = null;
    $conexion = null;
} catch (PDOException $e) {
    $respuesta["mensaje"] = "Error al intentar conectarse con la BBDD: " . $e->getMessage();
}
echo json_encode($respuesta);
?>