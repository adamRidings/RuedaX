import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PHPVEHICULOS } from "../datos";
import "./vender.css";

const Vender = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const tipoVendedor = location.state?.tipo || "particular";

    //Datos formulario necesarios para inseratar vehiculo y anuncio
    const [titulo, setTitulo] = useState();
    const [ubicacion, setUbicacion] = useState();
    const [nombreConcesionario, setNombreConcesionario] = useState();
    const [marca, setMarca] = useState();
    const [modelo, setModelo] = useState();
    const [version, setVersion] = useState();
    const [anio, setAnio] = useState();
    const [kilometros, setKilometros] = useState();
    const [precio, setPrecio] = useState();
    const [tipo_motor, setTipo_motor] = useState();
    const [transmision, setTransmision] = useState();
    const [descripcion, setDescripcion] = useState();
    const [tipo_carroceria, setTipo_carroceria] = useState();
    const [color, setColor] = useState();
    const [num_puertas, setNum_puertas] = useState();
    const [potencia, setPotencia] = useState();

    const subirAnuncio = (e) => {
        e.preventDefault();
        
        axios.post(PHPVEHICULOS, {
            action:"crearAnuncio",
            id_usuario: props.usuarioLogueado,
            tipoVendedor: tipoVendedor,
            vehiculo:{
                marca: marca,
                modelo: modelo,
                version: version,
                anio: anio,
                kilometros: kilometros,
                precio: precio,
                tipo_motor: tipo_motor,
                transmision: transmision,
                potencia: potencia,
                tipo_carroceria: tipo_carroceria,
                color: color,
                num_puertas: num_puertas,
                descripcion: descripcion,
            },
            anuncio:{
                titulo: titulo,
                ubicacion: ubicacion,
                nombreConcesionario: nombreConcesionario? nombreConcesionario : null,
            }
        }).then((res) => {
            if(res.data.mensaje === "Anuncio creado correctamente"){
                alert("Anuncio publicado con éxito");
                navigate("/");
            } else {
                alert("Error al publicar el anuncio: " + res.data.mensaje);
            }
        });
    };
    return (
        <main className="vender-main">
            <div className="vender-header">
                <h2>Crear anuncio como {tipoVendedor.toLowerCase()}</h2>
                <p className="vender-subtitle">
                    Rellena los datos del vehículo y la información del anuncio para publicarlo en RuedaX.
                </p>
            </div>

            <form className="form-vender" onSubmit={subirAnuncio}>
                {/* BLOQUE: Datos del vehículo */}
                <section className="form-section">
                    <h3>Datos del vehículo</h3>
                    <div className="form-grid">
                        <div className="form-field">
                            <label>Marca</label>
                            <input
                                type="text"
                                value={marca}
                                onChange={(e) => setMarca(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Modelo</label>
                            <input
                                type="text"
                                value={modelo}
                                onChange={(e) => setModelo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Versión</label>
                            <input
                                type="text"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Año</label>
                            <input
                                type="number"
                                min="1920"
                                max="2025"
                                value={anio}
                                onChange={(e) => setAnio(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Kilómetros</label>
                            <input
                                type="number"
                                min="0"
                                value={kilometros}
                                onChange={(e) => setKilometros(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Precio (EUR)</label>
                            <input
                                type="number"
                                min="0"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Tipo motor</label>
                            <select
                                value={tipo_motor}
                                onChange={(e) => setTipo_motor(e.target.value)}
                                required
                            >
                                <option value="" disabled>Selecciona...</option>
                                <option value="Gasolina">Gasolina</option>
                                <option value="Diésel">Diésel</option>
                                <option value="Eléctrico">Eléctrico</option>
                                <option value="Híbrido">Híbrido</option>
                                <option value="Híbrido enchufable">Híbrido enchufable</option>
                                <option value="GLP (Gas Licuado de Petróleo)">GLP (Gas Licuado de Petróleo)</option>
                                <option value="GNC (Gas Natural Comprimido)">GNC (Gas Natural Comprimido)</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Transmisión</label>
                            <select
                                value={transmision}
                                onChange={(e) => setTransmision(e.target.value)}
                                required
                            >
                                <option value="" disabled>Selecciona...</option>
                                <option value="Manual">Manual</option>
                                <option value="Automática">Automática</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Potencia (CV)</label>
                            <input
                                type="number"
                                min="40"
                                max="1000"
                                value={potencia}
                                onChange={(e) => setPotencia(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Carrocería</label>
                            <select
                                value={tipo_carroceria}
                                onChange={(e) => setTipo_carroceria(e.target.value)}
                                required
                            >
                                <option value="" disabled>Selecciona...</option>
                                <option value="Compacto">Compacto</option>
                                <option value="Berlina">Berlina</option>
                                <option value="SUV">SUV</option>
                                <option value="Coupé">Coupé</option>
                                <option value="Cabrio">Cabrio</option>
                                <option value="Familiar">Familiar</option>
                                <option value="Monovolumen">Monovolumen</option>
                                <option value="Furgoneta">Furgoneta</option>
                                <option value="Todoterreno">Todoterreno</option>
                                <option value="Pick-up">Pick-up</option>
                                <option value="Deportivo">Deportivo</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Color</label>
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Nº puertas</label>
                            <input
                                type="number"
                                min="2"
                                max="7"
                                value={num_puertas}
                                onChange={(e) => setNum_puertas(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* BLOQUE: Datos del anuncio */}
                <section className="form-section">
                    <h3>Datos del anuncio</h3>
                    <div className="form-grid">
                        <div className="form-field form-field-full">
                            <label>Título del anuncio</label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field form-field-full">
                            <label>Descripción</label>
                            <textarea
                                rows="5"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Ubicación</label>
                            <input
                                type="text"
                                value={ubicacion}
                                onChange={(e) => setUbicacion(e.target.value)}
                                required
                            />
                        </div>

                        {tipoVendedor === "concesionario" && (
                            <div className="form-field">
                                <label>Nombre del concesionario</label>
                                <input
                                    type="text"
                                    value={nombreConcesionario}
                                    onChange={(e) => setNombreConcesionario(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                    </div>
                </section>

                <div className="form-actions">
                    <button onClick={() => navigate("/")} className="btn-primary">
                        Volver
                    </button>
                    <button type="submit" className="btn-primary">
                        Publicar anuncio
                    </button>
                </div>
            </form>
        </main>
    );
};
export default Vender;