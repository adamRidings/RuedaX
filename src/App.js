import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Component } from "react";
import Header from "./components/header/header.js";
import VentanaLogin from "./components/login/VentanaLogin.js";
import VentanaRegistro from "./components/registro/VentanaRegistro.js";
import MostrarAnuncios from "./components/mainAnuncios/mainAnuncios.js";
import VentanaFiltroAvanzado from "./components/filtroAvanzado/filtroAvanzado.js";
import Anuncio from "./components/anuncios/anuncios.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InfoPage from "./components/info/InfoPage";
import Vender from "./components/vender/vender.js";
import { toast, ToastContainer } from "react-toastify";
import VentanaPerfilUsuario from "./components/perfil/VentanaPerfilUsuario.js";
import axios from "axios";
import { PHPVEHICULOS } from "./components/datos.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logueado: false,
      usuarioLogueado: "",
      id_usuarioLogueado: "",
      token: localStorage.getItem("rx_token") || "",
      mostrarLogin: false,
      mostrarRegistro: false,
      mostrarPerfil: false,
      mostrarFiltroAvanzado: false,
      anuncios: [],
      cargandoAnuncios: false,
      errorAnuncios: "",
    };
    this.logoutTimer = null;
  }

  componentDidMount() {
    this.obtenerAnuncios();
  }

  // Obtiene los anuncios del backend
  obtenerAnuncios() {
    axios
      .post(
        PHPVEHICULOS,
        { action: "obtenerAnuncios" },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        console.log("Anuncios obtenidos:", response.data.anuncios);
        this.setState({ anuncios: response.data.anuncios, cargandoAnuncios: false, errorAnuncios: "" });
      })
      .catch((error) => {
        console.error("Error al obtener anuncios:", error);
        this.setState({ cargandoAnuncios: false, errorAnuncios: "No se pudieron cargar los anuncios." });
      });
  }

  // Toggle modales
  toggleLogin() {
    this.setState({ mostrarLogin: !this.state.mostrarLogin });
  }

  toggleRegistro() {
    this.setState({
      mostrarRegistro: !this.state.mostrarRegistro,
      mostrarLogin: false,
    });
  }

  togglePerfil() {
    this.setState({ mostrarPerfil: !this.state.mostrarPerfil });
  }

  toggleFiltroAvanzado() {
    this.setState({ mostrarFiltroAvanzado: !this.state.mostrarFiltroAvanzado });
  }

  // Cierra sesión y limpia token/temporizador
  cerrarSesion() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
    this.setState({
      logueado: false,
      mostrarPerfil: false,
      usuarioLogueado: "",
      id_usuarioLogueado: "",
      datosUsuarioLogueado: null,
      token: "",
    });
    localStorage.removeItem("rx_token");
  }

  // Programa logout según expiración del token
  scheduleTokenTimeout(token) {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
    if (!token) return;
    try {
      const payloadB64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
      const expMs = payload.exp ? payload.exp * 1000 : 0;
      const now = Date.now();
      const timeoutMs = expMs - now;
      if (timeoutMs > 0) {
        this.logoutTimer = setTimeout(() => {
          this.cerrarSesion();
          toast.warning("Tu sesión ha expirado vuelve a iniciar sesión")
        }, timeoutMs);
      }
    } catch (e) {
      console.warn("No se pudo programar expiración de token", e);
    }
  }

  // Setea estado tras login/registro y guarda token
  loguearUsuario(usuario, id_usuario, datosUsuario, token) {
    this.setState({
      logueado: true,
      mostrarLogin: false,
      mostrarRegistro: false,
      usuarioLogueado: usuario,
      id_usuarioLogueado: id_usuario,
      datosUsuarioLogueado: datosUsuario,
      token: token || "",
    });
    if (token) {
      localStorage.setItem("rx_token", token);
      this.scheduleTokenTimeout(token);
    }
  }

  // Actualiza datos del usuario logueado en el estado
  actualizarDatosUsuarioLogueado(nuevosDatos) {
    this.setState({
      datosUsuarioLogueado: nuevosDatos,
    });
  }

  render() {
    return (
      <Router>
        <>
          {console.log(this.state.anuncios)}
          <ToastContainer position="top-right" autoClose={3000} />

          {this.state.logueado && (
            <VentanaPerfilUsuario
              mostrar={this.state.mostrarPerfil}
              toggle={() => this.togglePerfil()}
              datosUsuario={this.state.datosUsuarioLogueado}
              cerrarSesion={() => this.cerrarSesion()}
              token={this.state.token}
              onAuthError={() => this.cerrarSesion()}
              actualizarDatosUsuario={(nuevosDatos) =>
                this.actualizarDatosUsuarioLogueado(nuevosDatos)
              }
            />
          )}

          <Routes>
            {/* Pagina de inicio */}
            <Route
              path="/"
              element={
                <>
                  <Header
                    toggleLogin={() => this.toggleLogin()}
                    togglePerfil={() => this.togglePerfil()}
                    logueado={this.state.logueado}
                  />

                  <MostrarAnuncios
                    anuncios={this.state.anuncios}
                    logueado={this.state.logueado}
                    token={this.state.token}
                    id_usuario={this.state.id_usuarioLogueado}
                    cargando={this.state.cargandoAnuncios}
                    errorCargando={this.state.errorAnuncios}
                    onAuthError={() => this.cerrarSesion()}
                    toggleFiltroAvanzado={() => this.toggleFiltroAvanzado()}
                  />

                    <VentanaFiltroAvanzado
                      mostrar={this.state.mostrarFiltroAvanzado}
                      toggle={() => this.toggleFiltroAvanzado()}
                    />

                  <VentanaLogin
                    mostrar={this.state.mostrarLogin}
                    toggle={() => this.toggleLogin()}
                    login={(usuario, id_usuario, datosUsuario, token) =>
                      this.loguearUsuario(usuario, id_usuario, datosUsuario, token)
                    }
                    toggleRegistro={() => this.toggleRegistro()}
                  />

                  <VentanaRegistro
                    mostrar={this.state.mostrarRegistro}
                    toggle={() => this.toggleRegistro()}
                    registro={(usuario, id_usuario, datosUsuario, token) =>
                      this.loguearUsuario(usuario, id_usuario, datosUsuario, token)
                    }
                  />
                </>
              }
            />

            {/* Página venta */}
            <Route
              path="/vender"
              element={
                <>
                  <Header
                    toggleLogin={() => this.toggleLogin()}
                    togglePerfil={() => this.togglePerfil()}
                    logueado={this.state.logueado}
                  />

                  <VentanaLogin
                    mostrar={this.state.mostrarLogin}
                    toggle={() => this.toggleLogin()}
                    login={(usuario, id_usuario, datosUsuario, token) =>
                      this.loguearUsuario(usuario, id_usuario, datosUsuario, token)
                    }
                    toggleRegistro={() => this.toggleRegistro()}
                  />

                  <VentanaRegistro
                    mostrar={this.state.mostrarRegistro}
                    toggle={() => this.toggleRegistro()}
                    registro={(usuario, id_usuario, datosUsuario, token) =>
                      this.loguearUsuario(usuario, id_usuario, datosUsuario, token)
                    }
                  />

                  <Vender
                    logueado={this.state.logueado}
                    usuarioLogueado={this.state.usuarioLogueado}
                    id_usuarioLogueado={this.state.id_usuarioLogueado}
                    token={this.state.token}
                    onAuthError={() => this.cerrarSesion()}
                  />
                </>
              }
            />

            {/* Página anuncio */}
            <Route
              path="/anuncio/:id"
              element={
                <>
                  <Header
                    toggleLogin={() => this.toggleLogin()}
                    togglePerfil={() => this.togglePerfil()}
                    logueado={this.state.logueado}
                  />

                  <VentanaLogin
                    mostrar={this.state.mostrarLogin}
                    toggle={() => this.toggleLogin()}
                    login={(usuario, id_usuario, datosUsuario) =>
                      this.loguearUsuario(usuario, id_usuario, datosUsuario)
                    }
                    toggleRegistro={() => this.toggleRegistro()}
                  />

                  <VentanaRegistro
                    mostrar={this.state.mostrarRegistro}
                    toggle={() => this.toggleRegistro()}
                    registro={(usuario, id_usuario, datosUsuario) =>
                      this.loguearUsuario(usuario, id_usuario, datosUsuario)
                    }
                  />

                  <Anuncio
                    anuncios={this.state.anuncios}
                    logueado={this.state.logueado}
                    usuarioLogueado={this.state.usuarioLogueado}
                    id_usuarioLogueado={this.state.id_usuarioLogueado}
                    token={this.state.token}
                    onAuthError={() => this.cerrarSesion()}
                  />
                </>
              }
            />

            {/* Páginas informativas */}
            <Route
              path="/info"
              element={
                <>
                  <Header
                    toggleLogin={() => this.toggleLogin()}
                    togglePerfil={() => this.togglePerfil()}
                    logueado={this.state.logueado}
                  />

                  <VentanaLogin
                    mostrar={this.state.mostrarLogin}
                    toggle={() => this.toggleLogin()}
                    login={(usuario, id_usuario, datosUsuario, token) =>
                      this.loguearUsuario(usuario, id_usuario, datosUsuario, token)
                    }
                    toggleRegistro={() => this.toggleRegistro()}
                  />

                  <VentanaRegistro
                    mostrar={this.state.mostrarRegistro}
                    toggle={() => this.toggleRegistro()}
                    registro={(usuario, id_usuario, datosUsuario, token) =>
                      this.loguearUsuario(usuario, id_usuario, datosUsuario, token)
                    }
                  />

                  <InfoPage />
                </>
              }
            />
          </Routes>
        </>
      </Router>
    );
  }
}
export default App;
