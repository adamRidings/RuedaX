import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PHPVEHICULOS } from "../datos";
import "./vender.css";
import { toast } from "react-toastify";

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
    const [fotos, setFotos] = useState([]);

    const handleImagenChange = (e) => {
        //Convertir FileList a Array
        setFotos(Array.from(e.target.files));
    }

    const subirAnuncio = (e) => {
        e.preventDefault();

        if (!props.logueado) {
            toast.error("Debes iniciar sesión para publicar un anuncio.");
            return;
        }

        axios.post(PHPVEHICULOS, {
            action: "crearAnuncio",
            id_usuario: props.id_usuarioLogueado,
            tipoVendedor: tipoVendedor,
            vehiculo: {
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
            anuncio: {
                titulo: titulo,
                ubicacion: ubicacion,
                nombreConcesionario: nombreConcesionario ? nombreConcesionario : null,
            }
        }).then((res) => {
            if (res.data.mensaje === "Anuncio creado correctamente") {
                const id_vehiculo = res.data.id_vehiculo;

                // Subir imágenes solo si hay
                if (fotos.length > 0) {
                    const formData = new FormData();
                    formData.append("action", "insertarImagenes");
                    formData.append("id_vehiculo", id_vehiculo);

                    fotos.forEach((foto) => {
                        formData.append("fotos[]", foto);
                    });

                    axios
                        .post(PHPVEHICULOS, formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        })
                        .then((resImagenes) => {
                            if (resImagenes.data.mensaje === "Imágenes subidas correctamente") {
                                toast.success("Anuncio publicado con éxito");
                                navigate("/");
                            } else {
                                toast.error("Error al subir las imágenes: " + resImagenes.data.mensaje);
                            }
                        })
                        .catch(() => {
                            toast.error("Error al subir las imágenes.");
                        });

                } else {
                    // No hay fotos, pero el anuncio se ha creado bien
                    toast.success("Anuncio publicado con éxito (sin fotos).");
                    navigate("/");
                }

            } else {
                toast.error("Error al publicar el anuncio: " + res.data.mensaje);
            }
        }).catch(() => {
            toast.error("Error al comunicar con el servidor.");
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

            <form className="form-vender" onSubmit={subirAnuncio} encType="multipart/form-data">
                <section className="form-section" style={{ userSelect: "none", WebkitUserSelect: "none" }}>
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
                                <option value="">Selecciona tipo de motor</option>
                                <option value="Hibrido">Híbrido</option>
                                <option value="Hibrido enchufable">Híbrido enchufable</option>
                                <option value="Gasolina">Gasolina</option>
                                <option value="Diesel">Diésel</option>
                                <option value="Electrico">Eléctrico</option>
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
                                <option value="">Selecciona...</option>
                                <option value="manual">Manual</option>
                                <option value="automatico">Automática</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Potencia (CV)</label>
                            <input
                                type="number"
                                min="1"
                                max="2000"
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
                                <option value="">Selecciona tipo de carrocería</option>
                                <option value="Berlina">Berlina</option>
                                <option value="Compacto">Compacto</option>
                                <option value="SUV">SUV</option>
                                <option value="Crossover">Crossover</option>
                                <option value="Coupé">Coupé</option>
                                <option value="Cabrio">Cabrio</option>
                                <option value="Touring">Touring</option>
                                <option value="Mono volumen">Monovolumen</option>
                                <option value="Todo terreno">Todoterreno</option>
                                <option value="Pick-up">Pick-up</option>
                                <option value="Furgoneta">Furgoneta</option>
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

                        <div className="form-field">
                            <label>Fotos del vehiculo</label>
                            <input
                                type="file"
                                multiple
                                onChange={handleImagenChange}
                                accept="image/*"
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
                    <button type="button" onClick={() => navigate("/")} className="btn-primary">
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