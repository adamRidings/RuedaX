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


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logueado: false,
      usuarioLogueado: "",
      id_usuarioLogueado: "",
      mostrarLogin: false,
      mostrarRegistro: false,
    };
  }

  toggleLogin() {
    this.setState({ mostrarLogin: !this.state.mostrarLogin });
  }

  toggleRegistro() {
    this.setState({ mostrarRegistro: !this.state.mostrarRegistro, mostrarLogin: false });
  }

  login(usuario, id_usuario) {
    this.setState({
      logueado: true,
      mostrarLogin: false,
      usuarioLogueado: usuario,
      id_usuarioLogueado: id_usuario
    });
  }

  registro(usuario, id_usuario) {
    this.setState({
      logueado: true,
      mostrarRegistro: false,
      usuarioLogueado: usuario,
      id_usuarioLogueado: id_usuario
    });
  }

  render() {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />

        <Router>
          <Routes>
            {/* Pagina de inicio */}
            <Route path="/" element={
              <>

                <Header
                  toggleLogin={() => this.toggleLogin()}
                  logueado={this.state.logueado}
                />

                <VentanaLogin
                  mostrar={this.state.mostrarLogin}
                  toggle={() => this.toggleLogin()}
                  login={(usuario, id_usuario) => this.login(usuario, id_usuario)}
                  toggleRegistro={() => this.toggleRegistro()}
                />

                <VentanaRegistro
                  mostrar={this.state.mostrarRegistro}
                  toggle={() => this.toggleRegistro()}
                  registro={(usuario, id_usuario) => this.registro(usuario, id_usuario)}
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
                    login={(usuario, id_usuario) => this.login(usuario, id_usuario)}
                    toggleRegistro={() => this.toggleRegistro()}
                  />

                  <VentanaRegistro
                    mostrar={this.state.mostrarRegistro}
                    toggle={() => this.toggleRegistro()}
                    registro={(usuario, id_usuario) => this.registro(usuario, id_usuario)}
                  />

                  <Vender usuarioLogueado={this.state.usuarioLogueado} id_usuarioLogueado={this.state.id_usuarioLogueado} />
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
