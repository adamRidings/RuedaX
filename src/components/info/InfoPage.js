import { GoArrowLeft } from "react-icons/go";
import "./infoPage.css";

// Página informativa estática con secciones básicas
const InfoPage = () => {
  return (
    <main className="info-page">
      <h1>Sobre RuedaX</h1>
      <section className="header">
        <p className="info-intro">
          RuedaX nace para facilitar la compraventa de vehículos con
          transparencia y sencillez. Aquí tienes todo lo básico: quiénes somos,
          contacto, preguntas frecuentes, blog y términos.
        </p>
        <button
          type="button"
          className="info-back"
          onClick={() => window.history.back()}
        >
          <GoArrowLeft/> Volver
        </button>
      </section>

      <section className="info-block">
        <h2>Quiénes somos</h2>
        <ul className="info-list">
          <li>Equipo multidisciplinar en tecnología y automoción.</li>
          <li>Anuncios verificados y control básico de calidad.</li>
          <li>Soporte cercano para particulares y concesionarios.</li>
        </ul>
      </section>
      <section className="info-block">
        <h2>Contacto</h2>
        <ul className="info-list">
          <li>Email: soporte@ruedax.com</li>
          <li>Teléfono: +34 900 000 000</li>
          <li>Horario: L-V 9:00-18:00</li>
        </ul>
      </section>
      <section className="info-block">
        <h2>Preguntas frecuentes</h2>
        <ul className="info-list">
          <li>
            ¿Cómo publico un anuncio? Regístrate, entra en Vender y completa el
            formulario.
          </li>
          <li>¿Puedo subir varias fotos? Sí, añade tantas como necesites.</li>
          <li>
            ¿Qué pasa con mis datos? Solo se usan para gestionar tu cuenta y
            anuncios.
          </li>
        </ul>
      </section>
      <section className="info-block">
        <h2>Blog</h2>
        <ul className="info-list">
          <li>Consejos para revisar un coche de segunda mano.</li>
          <li>Tendencias de movilidad y energía.</li>
          <li>Novedades de la comunidad RuedaX.</li>
        </ul>
      </section>
      <section className="info-block">
        <h2>Términos y privacidad</h2>
        <ul className="info-list">
          <li>
            Uso responsable de la plataforma; prohibido contenido fraudulento.
          </li>
          <li>
            Protección de datos según RGPD; puedes ejercer tus derechos en
            cualquier momento.
          </li>
          <li>Usa credenciales fuertes y no compartas tu cuenta.</li>
        </ul>
      </section>
    </main>
  );
};

export default InfoPage;
