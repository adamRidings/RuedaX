<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
define("SERVIDOR_BD", "localhost");
define("USUARIO_BD", "jose");
define("CLAVE_BD", "josefa");
define("NOMBRE_BD", "bd_ruedax");

$_POST = json_decode(file_get_contents("php://input"), true);

$respuesta = [];

try{
    $conexion = new PDO("mysql:host=" . SERVIDOR_BD . ";dbname=" . NOMBRE_BD, USUARIO_BD, CLAVE_BD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'", PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    
    $action = $_POST['action'];

    if($action === "crearAnuncio"){
        $insertarVehiculo = "INSERT INTO `vehiculos`(`id_usuario`, `marca`, `modelo`, `color`, `kms`, `anio`, `tipo_motor`, `cv`, `descripcion`, `tipo_carroceria`, `precio`, `version`, `num_puertas`, `transmision`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $datosInsertar = [
            $_POST['id_usuario'],
            $_POST['vehiculo']['marca'],
            $_POST['vehiculo']['modelo'],
            $_POST['vehiculo']['color'],
            $_POST['vehiculo']['kilometros'],
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

        $insertarAnuncio = "INSERT INTO `anuncios`(`id_vehiculo`, `id_usuario`, `titulo`, `fecha_created`, `estado`, `ubicacion`, `tipo_vendedor`, `nombre_empresa`, `iva_incluido`) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)";
        
        $ivaIncluido = ($_POST['tipoVendedor'] === 'concesionario') ? 1 : 0;
        $datosInsertarAnuncio = [
            $conexion->lastInsertId(),
            $_POST['id_usuario'],
            $_POST['anuncio']['titulo'],
            'activo',
            $_POST['anuncio']['ubicacion'],
            $_POST['tipoVendedor'],
            $_POST['anuncio']['nombreConcesionario'],
            $ivaIncluido
        ];
        $sentenciaInsertarAnuncio = $conexion->prepare($insertarAnuncio);
        $sentenciaInsertarAnuncio->execute($datosInsertarAnuncio);
        $respuesta['mensaje'] = "Anuncio creado correctamente";
    } else {
        $respuesta['mensaje'] = "Acción no reconocida";
    }
}catch(Exception $e){
    $respuesta['mensaje'] = "Error en el servidor: " . $e->getMessage();
}

echo json_encode($respuesta);
?>