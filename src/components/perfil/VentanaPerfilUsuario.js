import "./perfilUsuario.css";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Label,
    FormGroup,
    Alert,
} from "reactstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconEdit from "../../assets/icons/edit.png";
import axios from "axios";
import { PHPUSUARIO } from "../datos";
import { toast } from "react-toastify";

const VentanaPerfilUsuario = (props) => {
    const navigate = useNavigate();
    const [verAlerta, setVerAlerta] = useState(false);
    const [msgAlerta, setmsgAlerta] = useState("");
    const [colorAlerta, setcolorAlerta] = useState("info");
    const [editarActivo, setEditarActivo] = useState(false); // <- AHORA ES STATE
    const [nuevoEmail, setNuevoEmail] = useState("");
    const [nuevoUserName, setNuevoUserName] = useState("");

    const datosUsuario = props.datosUsuario;

    const actualizarUsuario = () => {
        const authToken = props.token || localStorage.getItem("rx_token");
        if (!authToken) {
            setmsgAlerta("Sesión no disponible, inicia sesión de nuevo.");
            setcolorAlerta("danger");
            setVerAlerta(true);
            return;
        }
        // Validar email
        if (!esEmailValido(nuevoEmail)) {
            setmsgAlerta("El email ingresado no es válido.");
            setcolorAlerta("danger");
            setVerAlerta(true);
            return;
        }

        // Validar nombre de usuario
        if (!esUserNameValido(nuevoUserName)) {
            setmsgAlerta("El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.");
            setcolorAlerta("danger");
            setVerAlerta(true);
            return;
        }

        axios.post(PHPUSUARIO, {
            id_usuario: datosUsuario.id_usuario,
            email: nuevoEmail,
            user_name: nuevoUserName
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                }
            })
            .then(res => {
                toast.dismiss();

                if (res.data.mensaje === "Usuario actualizado correctamente.") {
                    toast.success("Usuario actualizado correctamente.");
                    props.actualizarDatosUsuario({
                        ...datosUsuario,
                        email: res.data.email,
                        user_name: res.data.user_name
                    });
                    setEditarActivo(false);
                    setVerAlerta(false);
                } else {
                    setmsgAlerta("Error al actualizar el usuario.");
                    setcolorAlerta("danger");
                    setVerAlerta(true);
                }
            }).catch((err) => {
                if (err?.response?.status === 401 && props.onAuthError) {
                    setmsgAlerta("Sesión expirada, inicia sesión nuevamente.");
                    props.onAuthError();
                } else {
                    setmsgAlerta("Error conectando con el servidor.");
                }
                setcolorAlerta("danger");
                setVerAlerta(true);
            });
    };

    function esEmailValido(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function esUserNameValido(userName) {
        const regex = /^[a-zA-Z0-9_]{3,20}$/;
        return regex.test(userName);
    }

    const handleChange = (event) => {
        let target = event.target;

        if (target.id === "emailUsuario") {
            setNuevoEmail(target.value);
        }

        if (target.id === "userName") {
            setNuevoUserName(target.value);
        }
    };

    const editarCampo = () => {
        setEditarActivo(prev => {
            const nuevo = !prev;

            if (nuevo) {
                setNuevoEmail(datosUsuario.email);
                setNuevoUserName(datosUsuario.user_name);
                setmsgAlerta("Ahora puedes editar email y nombre de usuario.");
                setcolorAlerta("info");
                setVerAlerta(true);
            } else {
                setVerAlerta(false);
            }

            return nuevo;
        });
    };

    const irAFavoritos = () => {
        props.toggle(); // cerrar modal
        navigate("/", {
            state: {
                verFavoritos: true,
                id_usuario: datosUsuario?.id_usuario,
            },
        });
    };

    return (
        <Modal
            isOpen={props.mostrar}
            toggle={props.toggle}
            className="modal-perfil-usuario"
        >
            <ModalHeader toggle={props.toggle} className="modal-perfil-header">
                Perfil de Usuario
            </ModalHeader>

            <ModalBody className="modal-perfil-body">
                <h5 className="modal-perfil-titulo-seccion">Datos personales</h5>

                <FormGroup className="modal-perfil-field">
                    <Label for="nombreUsuario">Nombre</Label>
                    <Input
                        type="text"
                        id="nombreUsuario"
                        value={datosUsuario["nombre"]}
                        readOnly
                    />
                </FormGroup>

                <FormGroup className="modal-perfil-field modal-perfil-field-dos-columnas">
                    <div className="modal-perfil-col">
                        <Label for="apellidoUsuario">Apellido</Label>
                        <Input
                            type="text"
                            id="apellidoUsuario"
                            value={datosUsuario["apellidos"]}
                            readOnly
                        />
                    </div>

                    <div className="modal-perfil-col modal-perfil-col-username">
                        <Label for="userName">Nombre de usuario</Label>
                        <div className="modal-perfil-input-icon">
                            <Input
                                type="text"
                                id="userName"
                                onChange={handleChange}
                                value={editarActivo ? nuevoUserName : datosUsuario["user_name"]}
                                readOnly={!editarActivo}
                            />
                            <img
                                src={iconEdit}
                                alt="Icono editar"
                                className="icono-editar"
                                onClick={editarCampo}
                            />
                        </div>
                    </div>
                </FormGroup>

                <FormGroup className="modal-perfil-field">
                    <Label for="emailUsuario">Email</Label>
                    <div className="modal-perfil-input-icon">
                        <Input
                            type="email"
                            id="emailUsuario"
                            onChange={handleChange}
                            value={editarActivo ? nuevoEmail : datosUsuario["email"]}
                            readOnly={!editarActivo}
                        />
                        <img
                            src={iconEdit}
                            alt="Icono editar"
                            className="icono-editar"
                            onClick={editarCampo}
                        />
                    </div>
                </FormGroup>
            </ModalBody>

            <ModalFooter className="modal-perfil-footer">
                <Alert
                    color={colorAlerta}
                    isOpen={verAlerta}
                    className="alert-perfil-usuario"
                >
                    {msgAlerta}
                </Alert>

                {editarActivo && (
                    <Button type="submit" className="btn-cerrar-perfil" onClick={actualizarUsuario}>
                        Guardar cambios
                    </Button>
                )}

                <Button onClick={props.toggle} className="btn-cerrar-perfil">
                    Cerrar
                </Button>

                <Button type="button" onClick={props.cerrarSesion} className="btn-cerrar-perfil">
                    Sign out
                </Button>

                <Button type="button" onClick={irAFavoritos} className="btn-cerrar-perfil">
                    Ver Favoritos
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default VentanaPerfilUsuario;
