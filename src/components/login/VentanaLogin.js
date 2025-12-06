import { useState } from "react";
import "./login.css";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Col,
  Label,
  FormGroup,
  Alert,
} from "reactstrap";
import { PHPLOGIN } from "../datos.js";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const VentanaLogin = (props) => {
  const { className } = props;

  const [usuario, setUsuario] = useState();
  const [clave, setClave] = useState();

  const [verAlerta, setVerAlerta] = useState(false);
  const [msgAlerta, setmsgAlerta] = useState();
  const [colorAlerta, setcolorAlerta] = useState();

  const login = (usuario, clave) => {
    var md5 = require("md5");
    axios
      .post(PHPLOGIN, {
        usuario: usuario,
        clave: md5(clave),
      },
        {
          headers: { "Content-Type": "application/json" }
        })
      .then((res) => {
        console.log(res.data);
        if (res.data.mensaje === "Acceso correcto") {
          setVerAlerta(true);
          setcolorAlerta("success");
          setmsgAlerta("Login exitoso");
          props.login(usuario);
        } else {
          setVerAlerta(true);
          setcolorAlerta("warning");
          setmsgAlerta("Usurio y/o clave erroneos");
        }
      });
  };

  const validarDatos = () => {
    if (!usuario || !clave) {
      setVerAlerta(true);
      setcolorAlerta("danger");
      setmsgAlerta("Campos vacios");
    } else {
      login(usuario, clave);
    }
  };

  const handleChange = (event) => {
    let target = event.target;

    if (target.name === "usuario") {
      setUsuario(target.value);
    }

    if (target.name === "clave") {
      setClave(target.value);
    }
  };
  return (
    <Modal isOpen={props.mostrar} toggle={props.toggle} className={className}>
      <ModalHeader toggle={props.toggle}>Iniciar sesión</ModalHeader>
      <ModalBody>
        <FormGroup row>
          <Label sm={2}> Usuario </Label>
          <Input
            onChange={handleChange}
            id="usuario"
            name="usuario"
            type="Text"
          />
        </FormGroup>
        <FormGroup row>
          <Label sm={2}> Clave </Label>
          <Input
            onChange={handleChange}
            id="clave"
            name="clave"
            type="password"
          />
        </FormGroup>
        <Alert isOpen={verAlerta} color={colorAlerta}>
          {msgAlerta}
        </Alert>
      </ModalBody>
      <ModalFooter>
        <span className ="texto-registrarse">¿No tienes cuenta? </span>
        <Button color="link" onClick={props.toggleRegistro}>
          Regístrate
        </Button>
        <Button color="primary" onClick={() => validarDatos()}>
          Login
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VentanaLogin;
