<?php
const JWT_SECRET = "claveSecretaAdam";
const JWT_EXP_SECONDS = 3600; 

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function crear_jwt(array $payload, $expSeconds = JWT_EXP_SECONDS) {
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $payload['exp'] = time() + $expSeconds;

    $segments = [
        base64url_encode(json_encode($header)),
        base64url_encode(json_encode($payload))
    ];

    $signing_input = implode('.', $segments);
    $signature = hash_hmac('sha256', $signing_input, JWT_SECRET, true);
    $segments[] = base64url_encode($signature);

    return implode('.', $segments);
}

function verificar_jwt($jwt) {
    if (!$jwt) return false;
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) return false;

    list($headerB64, $payloadB64, $sigB64) = $parts;
    $signing_input = $headerB64 . '.' . $payloadB64;
    $signature = base64url_decode($sigB64);
    $expected = hash_hmac('sha256', $signing_input, JWT_SECRET, true);

    if (!hash_equals($expected, $signature)) return false;

    $payload = json_decode(base64url_decode($payloadB64), true);
    if (!is_array($payload)) return false;
    if (isset($payload['exp']) && time() > $payload['exp']) return false;

    return $payload;
}

function obtener_token_de_request(array $data = []) {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    if (isset($headers['Authorization'])) {
        if (preg_match('/Bearer\\s(.*)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    // fallback por si llega en el body
    if (isset($data['token'])) {
        return $data['token'];
    }
    return null;
}

function requerir_auth(array $data = []) {
    $token = obtener_token_de_request($data);
    $payload = verificar_jwt($token);
    if (!$payload) {
        http_response_code(401);
        echo json_encode(["mensaje" => "Token inválido o expirado"]);
        exit;
    }
    return $payload;
}
