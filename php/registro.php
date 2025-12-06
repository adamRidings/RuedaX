<?php
header('Access-Control-Allow-Origin: *');
define("SERVIDOR_BD", "localhost");
define("USUARIO_BD", "jose");
define("CLAVE_BD", "josefa");
define("NOMBRE_BD", "bd_tienda_pieles");
$_POST = json_decode(file_get_contents("php://input"), true);

$datos[] = $_POST["usuario"];
$datos[] = $_POST["password"];
$respuesta = [];

try {
    $conexion = new PDO("mysql:host=" . SERVIDOR_BD . ";dbname=" . NOMBRE_BD, USUARIO_BD, CLAVE_BD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
    $consulta = "SELECT * FROM `usuarios` WHERE `user_name` = ? AND `clave` = ?";
    try {
        $sentencia = $conexion->prepare($consulta);
        $sentencia->execute($datos);

        if ($sentencia->rowCount() > 0) {
            $respuesta["mensaje"] = "Usuario ya en uso";
        } else {
            $insertar = "INSERT INTO usuarios (nombre, apellido, email, user_name, clave) VALUES (?, ?, ?, ?, ?)";
            $datosInsertar[] = $_POST["nombre"];
            $datosInsertar[] = $_POST["apellido"];
            $datosInsertar[] = $_POST["email"];
            $datosInsertar[] = $_POST["usuario"];
            $datosInsertar[] = $_POST["password"];
            
            $sentenciaInsertar = $conexion->prepare($insertar);
            $sentenciaInsertar->execute($datosInsertar);

            if ($sentenciaInsertar->rowCount() > 0) {
                $respuesta["mensaje"] = "Usuario registrado correctamente";
            } else {
                $respuesta["mensaje"] = "Error al registrar el usuario.";
            }
        }
    } catch (PDOException $e) {
        $respuesta["mensaje"] = "Error al intentar realizar la consulta.";
    }

    $sentencia = null;
    $conexion = null;
} catch (PDOException $e) {
    $respuesta["mensaje"] = "Error al intentar conectarse con la BBDD.";
}
echo json_encode($respuesta);
?>