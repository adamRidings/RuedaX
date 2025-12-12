import { useLocation, useNavigate } from "react-router-dom";
import "./anuncios.css";
import {
  Button,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from "reactstrap";
import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";

const Anuncio = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const id_anuncio = location.state?.id_anuncio;
  const datosAnuncio = props.anuncios.find(
    (anuncio) => anuncio.anuncio_id_anuncio == id_anuncio
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState(false);

  if (!datosAnuncio) {
    return <p>Anuncio no encontrado.</p>;
  }

  const handleContactar = () => {

  };

  const next = () => {
    if (position) return;
    const nextIndex =
      activeIndex === datosAnuncio.fotos.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (position) return;
    const nextIndex =
      activeIndex === 0 ? datosAnuncio.fotos.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (position) return;
    setActiveIndex(newIndex);
  };

  const slides =
    datosAnuncio.fotos && datosAnuncio.fotos.length > 0
      ? datosAnuncio.fotos.map((foto, index) => (
          <CarouselItem
            onExiting={() => setPosition(true)}
            onExited={() => setPosition(false)}
            key={index}
          >
            <img
              src={`http://localhost/RuedaX/${foto.ruta}`}
              alt={`Foto ${index + 1} del vehículo`}
              className="carousel-image"
            />
          </CarouselItem>
        ))
      : [
          <CarouselItem key="placeholder">
            <img
              src="https://via.placeholder.com/800x600?text=Sin+imagen"
              alt="Sin imagen"
              className="carousel-image"
            />
          </CarouselItem>,
        ];
  return (
    <main className="anuncio-detalle">
      <div className="anuncio-header">
        <Button
          color="secondary"
          onClick={() => navigate(-1)}
          className="btn-back"
        >
          <GoArrowLeft />
        </Button>
        <h1>{datosAnuncio.anuncio_titulo}</h1>
        <p className="anuncio-ubicacion">{datosAnuncio.anuncio_ubicacion}</p>
      </div>

      <div className="anuncio-content">
        <div className="anuncio-imagenes">
          <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
            className="carousel"
          >
            <CarouselIndicators
              items={slides}
              activeIndex={activeIndex}
              onClickHandler={goToIndex}
            />
            {slides}
            <CarouselControl
              direction="prev"
              directionText="Previous"
              onClickHandler={previous}
            />
            <CarouselControl
              direction="next"
              directionText="Next"
              onClickHandler={next}
            />
          </Carousel>
        </div>

        <div className="anuncio-info">
          <div className="anuncio-precio">
            <h2>{datosAnuncio.vehiculo_precio} €</h2>
            <Button onClick={handleContactar} className="btn-contactar">
              Contactar al vendedor
            </Button>
          </div>

          <div className="anuncio-detalles">
            <div className="detalle-item">
              <span className="detalle-label">Marca</span>
              <span className="detalle-value">
                {datosAnuncio.vehiculo_marca}
              </span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">Modelo</span>
              <span className="detalle-value">
                {datosAnuncio.vehiculo_modelo}
              </span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">Año</span>
              <span className="detalle-value">
                {datosAnuncio.vehiculo_anio}
              </span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">Kilómetros</span>
              <span className="detalle-value">
                {datosAnuncio.vehiculo_kms} km
              </span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">Combustible</span>
              <span className="detalle-value">
                {datosAnuncio.vehiculo_tipo_motor}
              </span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">Transmisión</span>
              <span className="detalle-value">
                {datosAnuncio.vehiculo_transmision}
              </span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">Carrocería</span>
              <span className="detalle-value">
                {datosAnuncio.vehiculo_tipo_carroceria}
              </span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">Color</span>
              <span className="detalle-value">
                {datosAnuncio.vehiculo_color}
              </span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">Puertas</span>
              <span className="detalle-value">
                {datosAnuncio.vehiculo_num_puertas}
              </span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">Potencia</span>
              <span className="detalle-value">
                {datosAnuncio.vehiculo_cv} CV
              </span>
            </div>
          </div>

          <div className="anuncio-descripcion">
            <h3>Descripción del vehículo</h3>
            <p>
              {datosAnuncio.vehiculo_descripcion} 
            </p>
          </div>

          <div className="anuncio-vendedor">
            <h3>Información del vendedor</h3>
            <div className="vendedor-info">
              <p>
                <strong>Nombre:</strong>{" "}
                {datosAnuncio.usuario_nombre +
                  " " +
                  datosAnuncio.usuario_apellidos}
              </p>
              <p>
                <strong>Tipo de vendedor:</strong>{" "}
                {datosAnuncio.anuncio_tipo_vendedor}
              </p>
              {datosAnuncio.anuncio_nombre_empresa && (
                <p>
                  <strong>Empresa:</strong>{" "}
                  {datosAnuncio.anuncio_nombre_empresa}
                </p>
              )}
              <p>
                <strong>Publicado:</strong>{" "}
                {new Date(datosAnuncio.anuncio_fecha).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Anuncio;
