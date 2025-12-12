import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
} from "reactstrap";
import "./mainAnuncios.css";
import { useNavigate, useLocation } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import axios from "axios";
import { PHPVEHICULOS } from "../datos";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MostrarAnuncios = (props) => {
  const { anuncios, cargando, errorCargando } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const { marca, modelo, anio, verFavoritos, id_usuario } = location.state || {};
  const [anunciosFavoritos, setAnunciosFavoritos] = useState([]);
  const [cargandoFavoritos, setCargandoFavoritos] = useState(false);
  const [errorFavoritos, setErrorFavoritos] = useState("");

  useEffect(() => {
    if (!verFavoritos || !id_usuario) {
      setAnunciosFavoritos([]);
      setErrorFavoritos("");
      return;
    }
    const authToken = props.token || localStorage.getItem("rx_token");
    if (!authToken) {
      setAnunciosFavoritos([]);
      setErrorFavoritos("No hay sesión para cargar favoritos.");
      if (verFavoritos && props.logueado) {
        toast.error("Sesión no disponible, inicia sesión de nuevo.");
        props.onAuthError?.();
      }
      return;
    }

    const fetchFavoritos = async () => {
      try {
        setCargandoFavoritos(true);
        const { data } = await axios.post(
          PHPVEHICULOS,
          { action: "obtenerFavoritos", id_usuario },
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` } }
        );
        setAnunciosFavoritos(data?.anuncios || []);
        setErrorFavoritos("");
      } catch (err) {
        console.error("Error cargando favoritos", err);
        if (err?.response?.status === 401 && props.onAuthError) {
          setErrorFavoritos("Sesión expirada, inicia sesión de nuevo.");
          props.onAuthError();
        } else {
          setErrorFavoritos("No se pudieron cargar tus favoritos.");
        }
        setAnunciosFavoritos([]);
      } finally {
        setCargandoFavoritos(false);
      }
    };

    fetchFavoritos();
  }, [verFavoritos, id_usuario, props.token]);

  // Filtrar anuncios basado en los criterios de búsqueda
  const {
    marcaAv,
    modeloAv,
    kilometroDesde,
    kilometroHasta,
    combustible,
    transmision,
    color,
    numPuertas,
    potenciaDesde,
    potenciaHasta,
    tipoCarroceria,
    precioDesde,
    precioHasta,
  } = location.state || {};

  const baseAnuncios = verFavoritos ? anunciosFavoritos : anuncios;

  // Fi
  console.log("Filtros aplicados:", { marca, modelo, anio });
  const anunciosFiltrados = baseAnuncios.filter((anuncio) => {
    if (
      marca &&
      !anuncio.vehiculo_marca.toLowerCase().includes(marca.toLowerCase())
    )
      return false;
    if (
      modelo &&
      !anuncio.vehiculo_modelo.toLowerCase().includes(modelo.toLowerCase())
    )
      return false;
    if (
      marcaAv &&
      !anuncio.vehiculo_marca.toLowerCase().includes(marcaAv.toLowerCase())
    )
      return false;
    if (
      modeloAv &&
      !anuncio.vehiculo_modelo.toLowerCase().includes(modeloAv.toLowerCase())
    )
      return false;
    if (anio && anuncio.vehiculo_anio != anio) return false;
    if (kilometroDesde && anuncio.vehiculo_kms < kilometroDesde) return false;
    if (kilometroHasta && anuncio.vehiculo_kms > kilometroHasta) return false;
    if (combustible && anuncio.vehiculo_tipo_motor !== combustible)
      return false;
    if (transmision && anuncio.vehiculo_transmision !== transmision)
      return false;
    if (
      color &&
      !anuncio.vehiculo_color.toLowerCase().includes(color.toLowerCase())
    )
      return false;
    if (numPuertas && anuncio.vehiculo_num_puertas != numPuertas) return false;
    if (potenciaDesde && anuncio.vehiculo_cv < potenciaDesde) return false;
    if (potenciaHasta && anuncio.vehiculo_cv > potenciaHasta) return false;
    if (tipoCarroceria && anuncio.vehiculo_tipo_carroceria !== tipoCarroceria)
      return false;
    if (precioDesde && anuncio.vehiculo_precio < precioDesde) return false;
    if (precioHasta && anuncio.vehiculo_precio > precioHasta) return false;

    return true;
  });

  const tieneFiltro =
    marca ||
    modelo ||
    marcaAv ||
    modeloAv ||
    anio ||
    kilometroDesde ||
    kilometroHasta ||
    combustible ||
    transmision ||
    color ||
    numPuertas ||
    potenciaDesde ||
    potenciaHasta ||
    tipoCarroceria ||
    precioDesde ||
    precioHasta;

  const handleClickAnuncio = (id_anuncio) => {
    navigate(`/anuncio/${id_anuncio}`, { state: { id_anuncio: id_anuncio } });
  };

  if (verFavoritos && !id_usuario) {
    return <div className="anuncios-container">No se indicó usuario.</div>;
  }

  return (
    <div className="anuncios-container">
      {cargando && <p>Cargando anuncios...</p>}
      {errorCargando && <p>{errorCargando}</p>}
      {!cargando && !errorCargando && baseAnuncios.length === 0 && !verFavoritos && (
        <p>No hay anuncios disponibles.</p>
      )}
      {verFavoritos && (
        <div className="filtros-activos">
          <p>Viendo tus favoritos</p>
          <div>
            <button onClick={() => navigate("/", { replace: true, state: null })}>
              Todos los anuncios
            </button>
          </div>
        </div>
      )}

      {verFavoritos && cargandoFavoritos && <p>Cargando favoritos...</p>}
      {verFavoritos && errorFavoritos && <p>{errorFavoritos}</p>}
      {verFavoritos && !cargandoFavoritos && !errorFavoritos && anunciosFavoritos.length === 0 && (
        <p>No tienes favoritos guardados.</p>
      )}

      {tieneFiltro && (
        <div className="filtros-activos">
          <p>
            Filtros <GoArrowRight />{" "}
          </p>
          <div className="filtros-list">
            {marca && <span className="filtro-badge">Marca: {marca}</span>}
            {modelo && <span className="filtro-badge">Modelo: {modelo}</span>}
            {marcaAv && <span className="filtro-badge">Marca: {marcaAv}</span>}
            {modeloAv && (
              <span className="filtro-badge">Modelo: {modeloAv}</span>
            )}
            {anio && <span className="filtro-badge">Año: {anio}</span>}
            {kilometroDesde && (
              <span className="filtro-badge">Km desde: {kilometroDesde}</span>
            )}
            {kilometroHasta && (
              <span className="filtro-badge">Km hasta: {kilometroHasta}</span>
            )}
            {combustible && (
              <span className="filtro-badge">Combustible: {combustible}</span>
            )}
            {transmision && (
              <span className="filtro-badge">Transmisión: {transmision}</span>
            )}
            {color && <span className="filtro-badge">Color: {color}</span>}
            {numPuertas && (
              <span className="filtro-badge">Puertas: {numPuertas}</span>
            )}
            {potenciaDesde && (
              <span className="filtro-badge">CV desde: {potenciaDesde}</span>
            )}
            {potenciaHasta && (
              <span className="filtro-badge">CV hasta: {potenciaHasta}</span>
            )}
            {tipoCarroceria && (
              <span className="filtro-badge">Carrocería: {tipoCarroceria}</span>
            )}
            {precioDesde && (
              <span className="filtro-badge">Precio desde: {precioDesde}€</span>
            )}
            {precioHasta && (
              <span className="filtro-badge">Precio hasta: {precioHasta}€</span>
            )}
          </div>
          <div>
            <button onClick={() => navigate("/", { replace: true })}>
              Todos los anuncios
            </button>
            <button onClick={() => props.toggleFiltroAvanzado()}>
              Más filtros
            </button>
          </div>
        </div>
      )}
      {anunciosFiltrados.map((anuncio) => {
        const fotoPrincipal =
          anuncio.fotos.find((foto) => foto.es_principal === 1) ||
          anuncio.fotos[0];

        return (
          <Card
            key={anuncio.anuncio_id_anuncio}
            className="anuncio-card"
            onClick={() => handleClickAnuncio(anuncio.anuncio_id_anuncio)}
          >
            {fotoPrincipal && (
              <CardImg
                top
                width="100%"
                src={`http://localhost/RuedaX/${fotoPrincipal.ruta}`}
                alt="Imagen del anuncio"
              />
            )}

            <CardBody>
              <CardTitle tag="h5">{anuncio.anuncio_titulo}</CardTitle>

              <CardText>
                <strong>Año:</strong> {anuncio.vehiculo_anio}
                <br />
                <strong>Kilómetros:</strong> {anuncio.vehiculo_kms}
                <br />
                <strong>Precio:</strong> {anuncio.vehiculo_precio} €<br />
                <strong>Ubicación:</strong> {anuncio.anuncio_ubicacion}
              </CardText>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default MostrarAnuncios;
