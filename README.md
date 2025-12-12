# RuedaX

Aplicación de compraventa de vehículos con frontend React y backend PHP (JWT). Este README resume instalación, entorno, scripts y plan de pruebas mínimo.

## Requisitos y entorno
- Node 18+ y npm
- PHP 8+ con MySQL
- Backend servido en `http://localhost/RuedaX/php` (ajusta según tu host)
- Variables de entorno recomendadas (backend):
  - `JWT_SECRET` (mover la clave fuera del código)
  - Credenciales de BD: host, user, pass, nombre BD

## Instalación
1. `npm install`
2. Configura el backend (PHP) con las credenciales y `JWT_SECRET` en variables de entorno/constantes seguras.
3. Arranca frontend: `npm start` (CRA en `http://localhost:3000`).
4. Arranca backend PHP (Apache/XAMPP o similar) sirviendo `/php` y `/uploads`.

## Scripts útiles
- `npm start` – modo desarrollo.
- `npm run build` – build producción.
- `npm test` – test runner de CRA (ajusta para unitarios).
- Lint rápido: `npx eslint ./src` (usa la config CRA incluida).
- Formato opcional: `npx prettier "src/**/*.{js,jsx,css,md}" --check`.

## Endpoints clave (PHP)
- `login.php` / `registro.php` – devuelven token JWT.
- `vehiculos.php` – acciones `obtenerAnuncios`, `crearAnuncio`, `insertarImagenes`, `aniadir_quitar_favorito`, `obtenerFavoritos`, `obtener_favorito` (protegidos con Bearer).
- `usuario.php` – actualización de usuario (Bearer).

## Plan de pruebas (resumen)
Columna sugerida: ID | Objetivo | Datos/Pasos | Resultado esperado | Prioridad | Estado.

- TC-01 Login válido (Crítico): credenciales correctas → acceso, token recibido.
- TC-02 Login inválido (Alto): pass errónea → mensaje error, sin token.
- TC-03 Token expirado (Crítico): usar token caducado en favoritos → 401, logout, aviso.
- TC-04 Registro duplicado (Alto): email/user existente → “ya existe”, no crea cuenta.
- TC-05 Crear anuncio con fotos (Crítico): datos obligatorios + 2 JPG → anuncio en listado, fotos visibles.
- TC-06 Crear anuncio sin fotos (Medio): datos obligatorios → anuncio en listado sin fotos.
- TC-07 Subir archivo no imagen (Alto): JPG + .exe → .exe rechazado, error mostrado.
- TC-08 Eliminar/ocultar anuncio (Crítico): desaparece de listado público.
- TC-09 Favorito persistente (Crítico): marcar/desmarcar → persiste tras recarga y reentrar.
- TC-10 Filtros combinados (Alto): marca+precio+kms → solo coincidencias; vacío si no hay match.
- TC-11 Validaciones formularios (Alto): obligatorios vacíos/formato inválido → bloquea envío, muestra mensajes.
- TC-12 Compatibilidad (Medio): Chrome/Firefox/Edge móvil/desktop → UI usable, sin solapes.
- TC-13 Rendimiento (Medio): `/php/vehiculos.php` acción `obtenerAnuncios` < umbral; subir imágenes < umbral.
- TC-14 Accesibilidad (Medio): tabulación completa, foco visible, textos alternativos, contraste AA (axe/lighthouse).

## Ejecución de pruebas
- Manual: seguir TC con datos de prueba y registrar Estado/Evidencia.
- Automático sugerido (no incluido):
  - Unit/Integración PHP: tests de endpoints login/registro/anuncios/favoritos contra BD de pruebas (PHPUnit o scripts curl en CI).
  - E2E (Cypress/Playwright): flujos login+favorito y publicar anuncio (incluyendo subida de archivos y expiración de token simulada).
  - Accesibilidad: auditoría con `npx lighthouse` o `axe` en vistas principales.

## Criterio de salida
- 100% de TC críticos aprobados, sin bloqueantes/altos abiertos.
- Incidencias documentadas y reprobadas tras corrección.
