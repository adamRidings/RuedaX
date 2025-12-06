<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
define("SERVIDOR_BD", "localhost");
define("USUARIO_BD", "jose");
define("CLAVE_BD", "josefa");
define("NOMBRE_BD", "bd_ruedax");

$_POST = json_decode(file_get_contents("php://input"), true);

$repuesta = [];

try{
    $conexion = new PDO("mysql:host=" . SERVIDOR_BD . ";dbname=" . NOMBRE_BD, USUARIO_BD, CLAVE_BD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
    
    $action = $_POST['action'];

    if($action === "crearAnuncio"){
        $insertarVehiculo = "INSERT INTO `vehiculos`(`id_usuario`, `marca`, `modelo`, `color`, `kms`, `anio`, `tipo_motor`, `cv`, `descripcion`, `tipo_carroceria`, `precio`, `version`, `num_puertas`, `transmision`) VALUES ('?','?','?','?','?','?','?','?','?','?','?','?','?','?')";
        $datosInsertar = [
            $_POST['id_usuario'],
            $_POST['vehiculo']['marca'],
            $_POST['vehiculo']['modelo'],
            $_POST['vehiculo']['color'],
            $_POST['vehiculo']['kms'],
            $_POST['vehiculo']['anio'],
            $_POST['vehiculo']['tipo_motor'],
            $_POST['vehiculo']['potencia'],
            $_POST['vehiculo']['descripcion'],
            $_POST['vehiculo']['tipo_carroceria'],
            $_POST['vehiculo']['precio'],
            $_POST['vehiculo']['version'],
            $_POST['vehiculo']['num_puertas'],
            $_POST['vehiculo']['transmision']

        ];
        $sentenciaInsertarVehiculo = $conexion->prepare($insertarVehiculo);
        $sentenciaInsertarVehiculo->execute($datosInsertar);
    }
}catch(Exception $e){
    $repuesta['mensaje'] = "Error en el servidor: " . $e->getMessage();
}




?>