<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

define("SERVIDOR_BD", "localhost");
define("USUARIO_BD", "jose");
define("CLAVE_BD", "josefa");
define("NOMBRE_BD", "bd_ruedax");

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

$respuesta = [];

try {
    $conexion = new PDO(
        "mysql:host=" . SERVIDOR_BD . ";dbname=" . NOMBRE_BD,
        USUARIO_BD,
        CLAVE_BD,
        [
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'",
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );

    // Detectar acción: puede venir en JSON o en $_POST (multipart)
    $action = null;
    if (is_array($data) && isset($data["action"])) {
        $action = $data["action"];
    } elseif (isset($_POST["action"])) {
        $action = $_POST["action"];
    }

    /* ==========================
       CREAR ANUNCIO
       ========================== */
    if ($action === "crearAnuncio") {

        if (!is_array($data)) {
            $respuesta['mensaje'] = "Datos JSON no válidos.";
            echo json_encode($respuesta);
            exit;
        }

        $id_usuario   = $data['id_usuario'] ?? null;
        $tipoVendedor = $data['tipoVendedor'] ?? "particular";
        $vehiculo     = $data['vehiculo'] ?? [];
        $anuncio      = $data['anuncio'] ?? [];

        if (!$id_usuario || empty($vehiculo) || empty($anuncio)) {
            $respuesta['mensaje'] = "Faltan datos para crear el anuncio.";
            echo json_encode($respuesta);
            exit;
        }

        // INSERTAR VEHÍCULO
        $insertarVehiculo = "INSERT INTO `vehiculos`
            (`id_usuario`, `marca`, `modelo`, `color`, `kms`, `anio`,
             `tipo_motor`, `cv`, `descripcion`, `tipo_carroceria`, `precio`,
             `version`, `num_puertas`, `transmision`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $datosInsertarVehiculo = [
            $id_usuario,
            $vehiculo['marca'] ?? "",
            $vehiculo['modelo'] ?? "",
            $vehiculo['color'] ?? null,
            $vehiculo['kilometros'] ?? 0,
            $vehiculo['anio'] ?? null,
            $vehiculo['tipo_motor'] ?? null,
            $vehiculo['potencia'] ?? null,
            $vehiculo['descripcion'] ?? null,
            $vehiculo['tipo_carroceria'] ?? null,
            $vehiculo['precio'] ?? 0,
            $vehiculo['version'] ?? "",
            $vehiculo['num_puertas'] ?? 0,
            $vehiculo['transmision'] ?? "manual"
        ];

        $sentenciaInsertarVehiculo = $conexion->prepare($insertarVehiculo);
        $sentenciaInsertarVehiculo->execute($datosInsertarVehiculo);
        $id_vehiculo = $conexion->lastInsertId();

        $respuesta['id_vehiculo'] = $id_vehiculo;

        // INSERTAR ANUNCIO
        $insertarAnuncio = "INSERT INTO `anuncios`
            (`id_vehiculo`, `id_usuario`, `titulo`, `fecha_created`,
             `estado`, `ubicacion`, `tipo_vendedor`, `nombre_empresa`, `iva_incluido`)
            VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)";

        $ivaIncluido = ($tipoVendedor === 'concesionario') ? 1 : 0;

        $datosInsertarAnuncio = [
            $id_vehiculo,
            $id_usuario,
            $anuncio['titulo'] ?? "",
            'activo',
            $anuncio['ubicacion'] ?? "",
            $tipoVendedor,
            $anuncio['nombreConcesionario'] ?? null,
            $ivaIncluido
        ];

        $sentenciaInsertarAnuncio = $conexion->prepare($insertarAnuncio);
        $sentenciaInsertarAnuncio->execute($datosInsertarAnuncio);

        $respuesta['mensaje'] = "Anuncio creado correctamente";
    }

    /* ==========================
       INSERTAR IMÁGENES
       ========================== */ 
    else if ($action === "insertarImagenes") {

        $id_vehiculo = $_POST["id_vehiculo"] ?? null;
        $fotos       = $_FILES["fotos"] ?? null;
        $fotosGuardadas = 0;

        if ($id_vehiculo !== null && $fotos !== null) {

            $rutaGuardar = __DIR__ . "/../uploads/vehiculos/";

            if (!is_dir($rutaGuardar)) {
                mkdir($rutaGuardar, 0777, true);
            }

            $totalNumFotos = count($fotos["name"]);

            for ($i = 0; $i < $totalNumFotos; $i++) {

                if ($fotos["error"][$i] !== UPLOAD_ERR_OK) {
                    continue;
                }

                // comprobar que sea imagen
                $infoImg = @getimagesize($fotos["tmp_name"][$i]);
                if ($infoImg === false) {
                    continue;
                }

                $extension = strtolower(pathinfo($fotos["name"][$i], PATHINFO_EXTENSION));

                // limitar extensiones
                if (!in_array($extension, ["jpg", "jpeg", "png", "gif", "webp", "jfif", "avif"])) {
                    continue;
                }

                $nombreUnico  = uniqid("vehiculo_" . $id_vehiculo . "_") . "." . $extension;
                $rutaCompleta = $rutaGuardar . $nombreUnico;
                $rutaBD       = "uploads/vehiculos/" . $nombreUnico;

                if (move_uploaded_file($fotos["tmp_name"][$i], $rutaCompleta)) {
                    // La primera foto es la principal
                    $esPrincipal = ($i === 0) ? 1 : 0;

                    $insertarImagen = "INSERT INTO fotos_vehiculos
                        (id_vehiculo, ruta, es_principal, orden)
                        VALUES (?, ?, ?, ?)";

                    $sentenciaInsertarImagen = $conexion->prepare($insertarImagen);
                    $sentenciaInsertarImagen->execute([
                        $id_vehiculo,
                        $rutaBD,
                        $esPrincipal,
                        $i
                    ]);

                    $fotosGuardadas++;
                }
            }
        }

        if ($fotosGuardadas > 0) {
            $respuesta['mensaje'] = "Imágenes subidas correctamente";
        } else {
            $respuesta['mensaje'] = "No se subieron imágenes válidas";
        }

        echo json_encode($respuesta);
        exit;
    }

    /* ==========================
       OBTENER ANUNCIOS
       ========================== */ else if ($action === "obtenerAnuncios") {

        $getAnuncios = "
        SELECT
            -- ANUNCIOS
            a.id_anuncio            AS anuncio_id_anuncio,
            a.id_vehiculo           AS anuncio_id_vehiculo,
            a.id_usuario            AS anuncio_id_usuario,
            a.titulo                AS anuncio_titulo,
            a.fecha_created         AS anuncio_fecha,
            a.estado                AS anuncio_estado,
            a.ubicacion             AS anuncio_ubicacion,
            a.tipo_vendedor         AS anuncio_tipo_vendedor,
            a.nombre_empresa        AS anuncio_nombre_empresa,
            a.iva_incluido          AS anuncio_iva_incluido,

            -- VEHICULOS
            v.id_vehiculo           AS vehiculo_id_vehiculo,
            v.id_usuario            AS vehiculo_id_usuario,
            v.tipo                  AS vehiculo_tipo,
            v.marca                 AS vehiculo_marca,
            v.modelo                AS vehiculo_modelo,
            v.color                 AS vehiculo_color,
            v.kms                   AS vehiculo_kms,
            v.anio                  AS vehiculo_anio,
            v.tipo_motor            AS vehiculo_tipo_motor,
            v.cv                    AS vehiculo_cv,
            v.descripcion           AS vehiculo_descripcion,
            v.tipo_carroceria       AS vehiculo_tipo_carroceria,
            v.precio                AS vehiculo_precio,
            v.version               AS vehiculo_version,
            v.num_puertas           AS vehiculo_num_puertas,
            v.transmision           AS vehiculo_transmision,

            -- USUARIOS
            u.id_usuario            AS usuario_id_usuario,
            u.nombre                AS usuario_nombre,
            u.apellidos             AS usuario_apellidos,
            u.email                 AS usuario_email,
            u.user_name             AS usuario_user_name,

            -- FOTOS (TODAS LAS DEL VEHÍCULO)
            f.id_foto               AS foto_id_foto,
            f.ruta                  AS foto_ruta,
            f.es_principal          AS foto_es_principal,
            f.orden                 AS foto_orden

        FROM anuncios a
        INNER JOIN vehiculos v ON a.id_vehiculo = v.id_vehiculo
        INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
        LEFT JOIN fotos_vehiculos f ON f.id_vehiculo = v.id_vehiculo
        WHERE a.estado = 'activo'
        ORDER BY a.fecha_created DESC, f.orden ASC, f.id_foto ASC
    ";

        $sentenciaGetAnuncios = $conexion->prepare($getAnuncios);
        $sentenciaGetAnuncios->execute();
        $rows = $sentenciaGetAnuncios->fetchAll(PDO::FETCH_ASSOC);

        // Agrupar por anuncio para que cada uno tenga un array de fotos
        $anunciosAgrupados = [];

        foreach ($rows as $row) {
            $idAnuncio = $row['anuncio_id_anuncio'];

            // Si todavía no hemos creado la entrada del anuncio, la creamos
            if (!isset($anunciosAgrupados[$idAnuncio])) {
                $anunciosAgrupados[$idAnuncio] = [
                    // ANUNCIO
                    'anuncio_id_anuncio'      => $row['anuncio_id_anuncio'],
                    'anuncio_id_vehiculo'     => $row['anuncio_id_vehiculo'],
                    'anuncio_id_usuario'      => $row['anuncio_id_usuario'],
                    'anuncio_titulo'          => $row['anuncio_titulo'],
                    'anuncio_fecha'           => $row['anuncio_fecha'],
                    'anuncio_estado'          => $row['anuncio_estado'],
                    'anuncio_ubicacion'       => $row['anuncio_ubicacion'],
                    'anuncio_tipo_vendedor'   => $row['anuncio_tipo_vendedor'],
                    'anuncio_nombre_empresa'  => $row['anuncio_nombre_empresa'],
                    'anuncio_iva_incluido'    => $row['anuncio_iva_incluido'],

                    // VEHÍCULO
                    'vehiculo_id_vehiculo'    => $row['vehiculo_id_vehiculo'],
                    'vehiculo_id_usuario'     => $row['vehiculo_id_usuario'],
                    'vehiculo_tipo'           => $row['vehiculo_tipo'],
                    'vehiculo_marca'          => $row['vehiculo_marca'],
                    'vehiculo_modelo'         => $row['vehiculo_modelo'],
                    'vehiculo_color'          => $row['vehiculo_color'],
                    'vehiculo_kms'            => $row['vehiculo_kms'],
                    'vehiculo_anio'           => $row['vehiculo_anio'],
                    'vehiculo_tipo_motor'     => $row['vehiculo_tipo_motor'],
                    'vehiculo_cv'             => $row['vehiculo_cv'],
                    'vehiculo_descripcion'    => $row['vehiculo_descripcion'],
                    'vehiculo_tipo_carroceria' => $row['vehiculo_tipo_carroceria'],
                    'vehiculo_precio'         => $row['vehiculo_precio'],
                    'vehiculo_version'        => $row['vehiculo_version'],
                    'vehiculo_num_puertas'    => $row['vehiculo_num_puertas'],
                    'vehiculo_transmision'    => $row['vehiculo_transmision'],

                    // USUARIO
                    'usuario_id_usuario'      => $row['usuario_id_usuario'],
                    'usuario_nombre'          => $row['usuario_nombre'],
                    'usuario_apellidos'       => $row['usuario_apellidos'],
                    'usuario_email'           => $row['usuario_email'],
                    'usuario_user_name'       => $row['usuario_user_name'],

                    // FOTOS (ARRAY)
                    'fotos' => []
                ];
            }

            // Añadir foto si existe (LEFT JOIN puede traer NULL)
            if (!empty($row['foto_id_foto'])) {
                $anunciosAgrupados[$idAnuncio]['fotos'][] = [
                    'id_foto'      => $row['foto_id_foto'],
                    'ruta'         => $row['foto_ruta'],
                    'es_principal' => $row['foto_es_principal'],
                    'orden'        => $row['foto_orden']
                ];
            }
        }

        // Pasar a array indexado para el JSON
        $respuesta['anuncios'] = array_values($anunciosAgrupados);
    } else {
        $respuesta['mensaje'] = "Acción no reconocida";
    }
} catch (Exception $e) {
    $respuesta['mensaje'] = "Error en el servidor: " . $e->getMessage();
}

echo json_encode($respuesta);
exit;
