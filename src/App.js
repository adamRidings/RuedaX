import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "reactstrap";
import { Component } from "react";
import Header from "./components/header/header.js";
import Footer from "./components/footer/footer.js";
import VentanaLogin from "./components/login/VentanaLogin.js";
import VentanaRegistro from "./components/registro/VentanaRegistro.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Vender from "./components/vender/vender.js";
import { ToastContainer } from "react-toastify";
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
      mostrarLogin: false,
      mostrarRegistro: false,
      mostrarPerfil: false,
      anuncios: [],
    };
  }

  componentDidMount() {
    this.obtenerAnuncios();
  }

  obtenerAnuncios() {
    axios.post(PHPVEHICULOS, { action: "obtenerAnuncios" })
      .then(response => {
        console.log("Anuncios obtenidos:", response.data.anuncios);
        this.setState({ anuncios: response.data.anuncios });
      })
      .catch(error => {
        console.error("Error al obtener anuncios:", error);
      });
  }

  toggleLogin() {
    this.setState({ mostrarLogin: !this.state.mostrarLogin });
  }

  toggleRegistro() {
    this.setState({ mostrarRegistro: !this.state.mostrarRegistro, mostrarLogin: false });
  }

  togglePerfil() {
    this.setState({ mostrarPerfil: !this.state.mostrarPerfil });
  }

  cerrarSesion() {  
    this.setState({
      logueado: false,
      mostrarPerfil: false,
      usuarioLogueado: "",
      id_usuarioLogueado: "",
      datosUsuarioLogueado: null
    });
  }

  loguearUsuario(usuario, id_usuario, datosUsuario) {
    this.setState({
      logueado: true,
      mostrarLogin: false,
      mostrarRegistro: false,
      usuarioLogueado: usuario,
      id_usuarioLogueado: id_usuario,
      datosUsuarioLogueado: datosUsuario
    });
  }

  actualizarDatosUsuarioLogueado(nuevosDatos) {
    this.setState({
      datosUsuarioLogueado: nuevosDatos
    });
  }

  render() {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />

        {this.state.logueado && (
        <VentanaPerfilUsuario
                  mostrar={this.state.mostrarPerfil}
                  toggle={() => this.togglePerfil()}
                  datosUsuario={this.state.datosUsuarioLogueado}
                  cerrarSesion={() => this.cerrarSesion()}
                  actualizarDatosUsuario={(nuevosDatos) => this.actualizarDatosUsuarioLogueado(nuevosDatos)}
        />)}

        <Router>
          <Routes>
            {/* Pagina de inicio */}
            <Route path="/" element={
              <>

                <Header
                  toggleLogin={() => this.toggleLogin()}
                  togglePerfil={() => this.togglePerfil()}
                  logueado={this.state.logueado}
                />

                <VentanaLogin
                  mostrar={this.state.mostrarLogin}
                  toggle={() => this.toggleLogin()}
                  login={(usuario, id_usuario, datosUsuario) => this.loguearUsuario(usuario, id_usuario, datosUsuario)}
                  toggleRegistro={() => this.toggleRegistro()}
                />

                <VentanaRegistro
                  mostrar={this.state.mostrarRegistro}
                  toggle={() => this.toggleRegistro()}
                  registro={(usuario, id_usuario, datosUsuario) => this.loguearUsuario(usuario, id_usuario, datosUsuario)}
                />
              </>
            }
            />

            {/* Página venta */}
            <Route
              path="/vender" element={
                <>
                  <Header
                    toggleLogin={() => this.toggleLogin()}
                    logueado={this.state.logueado}
                  />

                  <VentanaLogin
                    mostrar={this.state.mostrarLogin}
                    toggle={() => this.toggleLogin()}
                    login={(usuario, id_usuario, datosUsuario) => this.loguearUsuario(usuario, id_usuario, datosUsuario)}
                    toggleRegistro={() => this.toggleRegistro()}
                  />

                  <VentanaRegistro
                    mostrar={this.state.mostrarRegistro}
                    toggle={() => this.toggleRegistro()}
                    registro={(usuario, id_usuario, datosUsuario) => this.loguearUsuario(usuario, id_usuario, datosUsuario)}
                  />

                  <Vender logueado={this.state.logueado} usuarioLogueado={this.state.usuarioLogueado} id_usuarioLogueado={this.state.id_usuarioLogueado} />
                </>
              }
            />
          </Routes>
        </Router>
      </>
    );
  }
}
export default App;
