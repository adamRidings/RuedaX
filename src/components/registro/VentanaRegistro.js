import { useState } from "react";
import "./registro.css";
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
import { PHPREGISTRO } from "../datos.js";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const VentanaRegistro = (props) => {
  const { className } = props;

  const [nombre, setNombre] = useState();
  const [apellido, setApellido] = useState();
  const [email, setEmail] = useState();
  const [usuario, setUsuario] = useState();
  const [clave, setClave] = useState();

  const [verAlerta, setVerAlerta] = useState(false);
  const [msgAlerta, setmsgAlerta] = useState();
  const [colorAlerta, setcolorAlerta] = useState();

  const registro = (nombre, apellido, email, usuario, clave) => {
    axios
      .post(PHPREGISTRO, {
        nombre: nombre,
        apellido: apellido,
        email: email,
        usuario: usuario,
        clave: clave,
      },
        {
          headers: { "Content-Type": "application/json" }
        })
      .then((res) => {
        if (res.data.mensaje === "Acceso correcto") {
          toast.success("Registro exitoso");
          props.registro(usuario, res.data.id_usuario);
        } else {
          setVerAlerta(true);
          setcolorAlerta("warning");
          setmsgAlerta(res.data.mensaje);
        }
      });
  };

  function esEmailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function claveValida(clave) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return regex.test(clave);
  }



  const validarDatos = () => {
    if ( !nombre || !apellido || !email || !usuario || !clave) {
      setVerAlerta(true);
      setcolorAlerta("danger");
      setmsgAlerta("Campos vacios");
    }else if(!esEmailValido(email)){
      setVerAlerta(true);
      setcolorAlerta("danger");
      setmsgAlerta("Email no válido");
    }else if(!claveValida(clave)){
      setVerAlerta(true);
      setcolorAlerta("danger");
      setmsgAlerta("Clave no válida, debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial");
    } else {
      registro(nombre, apellido, email, usuario, clave);
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

    if (target.name === "nombre") {
      setNombre(target.value);
    }

    if (target.name === "apellido") {
      setApellido(target.value);
    }

    if (target.name === "email") {
      setEmail(target.value);
    }

  };
  return (
    <Modal isOpen={props.mostrar} toggle={props.toggle} className={className}>
      <ModalHeader toggle={props.toggle}>Crear Cuenta</ModalHeader>
      <ModalBody>
        <FormGroup row>
          <Label sm={2}> Nombre </Label>
          <Input
            onChange={handleChange}
            id="nombre"
            name="nombre"
            type="Text"
          />
        </FormGroup>
        <FormGroup row>
          <Label sm={2}> Apellido </Label>
          <Input
            onChange={handleChange}
            id="apellido"
            name="apellido"
            type="Text"
          />
        </FormGroup>
        <FormGroup row>
          <Label sm={2}> Email </Label>
          <Input
            onChange={handleChange}
            id="email"
            name="email"
            type="Text"
          />
        </FormGroup>
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
        <span className ="texto-registrarse">Aceptar terminos y condiciones</span>
        <input type="checkbox" className="checkTerminos"/>
        <Button color="primary" onClick={() => validarDatos()}>
          Regístrate
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VentanaRegistro;