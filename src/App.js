import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "reactstrap";
import { Component } from "react";
import Header from "./components/header/header.js";
import Footer from "./components/footer/footer.js";
import VentanaLogin from "./components/login/VentanaLogin.js";
import VentanaRegistro from "./components/registro/VentanaRegistro.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logueado: false,
      usuarioLogueado: "",
    };
  }

  toggleLogin() {
    this.setState({ mostrarLogin: !this.state.mostrarLogin });
  }

  toggleRegistro() {
    this.setState({ mostrarRegistro: !this.state.mostrarRegistro, mostrarLogin: false});
  }

  login(usuario) {
    this.setState({
      logueado: true,
      mostrarLogin: false,
      usuarioLogueado: usuario,
    });
  }

  registro(usuario){
    this.setState({
      logueado: true,
      mostrarRegistro: false,
      usuarioLogueado: usuario,
    });
  }

  render() {
    return (
      <div>
        <Header
          toggleLogin={() => this.toggleLogin()}
        />

        <VentanaLogin
          mostrar={this.state.mostrarLogin}
          toggle={() => this.toggleLogin()}
          login={(usuario) => this.login(usuario)}
          toggleRegistro={() => this.toggleRegistro()}
        />
        <VentanaRegistro
          mostrar={this.state.mostrarRegistro}
          toggle={() => this.toggleRegistro()}
          registro={(usuario) => this.registro(usuario)}
        />
      </div>
    );
  }
}
export default App;
