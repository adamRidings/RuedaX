import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import { useState } from "react";
import "./filtroAvanzado.css";
import { useNavigate } from "react-router-dom";

const VentanaFiltroAvanzado = (props) => {
  const navigate = useNavigate();
  const [marcaAv, setMarcaAv] = useState("");
  const [modeloAv, setModeloAv] = useState("");
  const [kilometroDesde, setKilometroDesde] = useState("");
  const [kilometroHasta, setKilometroHasta] = useState("");
  const [combustible, setCombustible] = useState("");
  const [transmision, setTransmision] = useState("");
  const [color, setColor] = useState("");
  const [numPuertas, setNumPuertas] = useState("");
  const [potenciaDesde, setPotenciaDesde] = useState("");
  const [potenciaHasta, setPotenciaHasta] = useState("");
  const [tipoCarroceria, setTipoCarroceria] = useState("");
  const [precioDesde, setPrecioDesde] = useState("");
  const [precioHasta, setPrecioHasta] = useState("");

  // Limpia todos los campos del filtro
  const resetFiltros = () => {
    setMarcaAv("");
    setModeloAv("");
    setKilometroDesde("");
    setKilometroHasta("");
    setCombustible("");
    setTransmision("");
    setColor("");
    setNumPuertas("");
    setPotenciaDesde("");
    setPotenciaHasta("");
    setTipoCarroceria("");
    setPrecioDesde("");
    setPrecioHasta("");
  };

  // Navega a la home con los filtros aplicados
  const aplicarFiltros = () => {
    navigate("/", { 
      state: { 
        marcaAv,
        modeloAv,
        kilometroDesde, 
        kilometroHasta, 
        combustible, 
        transmision, 
        color, 
        numPuertas, 
        potenciaDesde, 
        potenciaHasta, 
        tipoCarroceria, 
        precioDesde, 
        precioHasta 
      } 
    });
    props.toggle();
  };

  return (
    <Modal isOpen={props.mostrar} toggle={props.toggle} className="filtro-avanzado-modal">
      <ModalHeader toggle={props.toggle}>Filtro Avanzado</ModalHeader>
      <ModalBody>
        <FormGroup className="filtro-avanzado-field">
            <Label for="marca">Marca</Label>
            <Input
              type="text"
              id="marca"
              placeholder="Marca"
              value={marcaAv}
              onChange={(e) => setMarcaAv(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="filtro-avanzado-field">
            <Label for="modelo">Modelo</Label>
            <Input
              type="text"
              id="modelo"
              placeholder="Modelo"
              value={modeloAv}
              onChange={(e) => setModeloAv(e.target.value)}
            />
          </FormGroup>
        <div className="field-pair">
          <FormGroup className="filtro-avanzado-field">
            <Label for="kilometrosVehiculoDesde">Kilómetros desde</Label>
            <Input
              type="number"
              id="kilometrosVehiculoDesde"
              placeholder="kilómetros desde"
              value={kilometroDesde}
              onChange={(e) => setKilometroDesde(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="filtro-avanzado-field">
            <Label for="kilometrosVehiculoHasta">Kilómetros hasta</Label>
            <Input
              type="number"
              id="kilometrosVehiculoHasta"
              placeholder="kilómetros hasta"
              value={kilometroHasta}
              onChange={(e) => setKilometroHasta(e.target.value)}
            />
          </FormGroup>
        </div>
        <FormGroup className="filtro-avanzado-field">
          <Label for="combustibleVehiculo">Combustible</Label>
          <Input type="select" id="combustibleVehiculo" value={combustible} onChange={(e) => setCombustible(e.target.value)}>
            <option value="">Tipo de motor</option>
            <option value="Hibrido">Híbrido</option>
            <option value="Hibrido enchufable">Híbrido enchufable</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diesel">Diésel</option>
            <option value="Electrico">Eléctrico</option>
            <option value="GLP (Gas Licuado de Petróleo)">
              GLP (Gas Licuado de Petróleo)
            </option>
            <option value="GNC (Gas Natural Comprimido)">
              GNC (Gas Natural Comprimido)
            </option>
          </Input>
        </FormGroup>
        <FormGroup className="filtro-avanzado-field">
          <Label for="transmisionVehiculo">Transmisión</Label>
          <Input type="select" id="transmisionVehiculo" value={transmision} onChange={(e) => setTransmision(e.target.value)}>
            <option value="">Tipo de transmisión</option>
            <option value="manual">Manual</option>
            <option value="automatico">Automático</option>
          </Input>
        </FormGroup>
        <FormGroup className="filtro-avanzado-field">
          <Label for="colorVehiculo">Color</Label>
          <Input
            type="text"
            id="colorVehiculo"
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </FormGroup>
        <FormGroup className="filtro-avanzado-field">
          <Label for="numPuertasVehiculo">Número de puertas</Label>
          <Input
            type="number"
            id="numPuertasVehiculo"
            placeholder="Número de puertas"
            value={numPuertas}
            onChange={(e) => setNumPuertas(e.target.value)}
          />
        </FormGroup>
        <div className="field-pair">
          <FormGroup className="filtro-avanzado-field">
            <Label for="potenciaDesde">Potencia desde (CV)</Label>
            <Input
              type="number"
              id="potenciaDesde"
              placeholder="Potencia desde"
              value={potenciaDesde}
              onChange={(e) => setPotenciaDesde(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="filtro-avanzado-field">
            <Label for="potenciaHasta">Potencia hasta (CV)</Label>
            <Input
              type="number"
              id="potenciaHasta"
              placeholder="Potencia hasta"
              value={potenciaHasta}
              onChange={(e) => setPotenciaHasta(e.target.value)}
            />
          </FormGroup>
        </div>
        <FormGroup className="filtro-avanzado-field">
          <Label for="tipoCarroceria">Tipo de carrocería</Label>
          <Input type="select" id="tipoCarroceria" value={tipoCarroceria} onChange={(e) => setTipoCarroceria(e.target.value)}>
            <option value="">Tipo de carrocería</option>
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
          </Input>
        </FormGroup>
        <div className="field-pair">
          <FormGroup className="filtro-avanzado-field">
            <Label for="precioDesde">Precio desde (€)</Label>
            <Input
              type="number"
              id="precioDesde"
              placeholder="Precio desde"
              value={precioDesde}
              onChange={(e) => setPrecioDesde(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="filtro-avanzado-field">
            <Label for="precioHasta">Precio hasta (€)</Label>
            <Input
              type="number"
              id="precioHasta"
              placeholder="Precio hasta"
              value={precioHasta}
              onChange={(e) => setPrecioHasta(e.target.value)}
            />
          </FormGroup>
        </div>
      </ModalBody>
      <ModalFooter className="footerFiltros">
        <Button className="btnAplicar" onClick={aplicarFiltros} >Aplicar Filtros</Button>
        <Button className="btnCerrar" onClick={() => { resetFiltros(); props.toggle(); }}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VentanaFiltroAvanzado;
