import { Button, Card, CardBody, CardTitle, CardText, CardImg } from "reactstrap";
import "./mainAnuncios.css";
import { useNavigate, useLocation } from "react-router-dom";
import { GoArrowRight} from "react-icons/go";

const MostrarAnuncios = (props) => {
  const { anuncios } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const { marca, modelo, anio } = location.state || {};

  // Filtrar anuncios basado en los criterios de búsqueda
  const anunciosFiltrados = anuncios.filter(anuncio => {
    if (marca && !anuncio.vehiculo_marca.toLowerCase().includes(marca.toLowerCase())) return false;
    if (modelo && !anuncio.vehiculo_modelo.toLowerCase().includes(modelo.toLowerCase())) return false;
    if (anio && anuncio.vehiculo_anio != anio) return false;
    return true;
  });

  const tieneFiltro = marca || modelo || anio;

  if (!anunciosFiltrados || anunciosFiltrados.length === 0) {
    return <p>No hay anuncios disponibles que coincidan con tu búsqueda.</p>;
  }

  const handleClickAnuncio = (id_anuncio) => {
    navigate(`/anuncio/${id_anuncio}`, { state: { id_anuncio: id_anuncio } });
  }

  return (
    <div className="anuncios-container">
      {tieneFiltro && (
        <div className="filtros-activos">
          <p>Filtros<GoArrowRight/>&nbsp; {marca && `Marca: ${marca}`} {modelo && `Modelo: ${modelo}`} {anio && `Año: ${anio}`}</p>
          <div>
          <button onClick={() => navigate("/", { replace: true })}>Todos los anuncios</button>
          <button>Más filtros</button>
          </div>
        </div>
      )}
      {anunciosFiltrados.map((anuncio) => {
        const fotoPrincipal = anuncio.fotos.find(foto => foto.es_principal === 1) || anuncio.fotos[0];

        return (
          <Card key={anuncio.anuncio_id_anuncio} className="anuncio-card" onClick={() => handleClickAnuncio(anuncio.anuncio_id_anuncio)}>
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
                <strong>Año:</strong> {anuncio.vehiculo_anio}<br />
                <strong>Kilómetros:</strong> {anuncio.vehiculo_kms}<br />
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
