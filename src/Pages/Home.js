import React, { useState } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

function Home() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    fecha: "",
    hora: "",
    trabajo: "",
    retiro: false,
  });

  const [codigo, setCodigo] = useState("");
  const [turnoEncontrado, setTurnoEncontrado] = useState(null);
  const [nuevoTrabajo, setNuevoTrabajo] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "turnos"), formData);
      alert(`Turno agendado con éxito. Tu código es: ${docRef.id}`);
      setFormData({
        nombre: "",
        correo: "",
        fecha: "",
        hora: "",
        trabajo: "",
        retiro: false,
      });
    } catch (error) {
      console.error("Error al guardar el turno:", error);
      alert("Hubo un problema al agendar el turno");
    }
  };

  const buscarTurno = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "turnos", codigo);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTurnoEncontrado({ id: docSnap.id, ...docSnap.data() });
        setNuevoTrabajo(docSnap.data().trabajo);
      } else {
        alert("No se encontró ningún turno con ese código");
        setTurnoEncontrado(null);
      }
    } catch (error) {
      console.error("Error al buscar el turno:", error);
    }
  };

  const modificarTurno = async () => {
    try {
      const docRef = doc(db, "turnos", codigo);
      await updateDoc(docRef, { trabajo: nuevoTrabajo });
      alert("Turno modificado con éxito");
      setTurnoEncontrado(null);
      setCodigo("");
    } catch (error) {
      console.error("Error al modificar el turno:", error);
    }
  };

  const cancelarTurno = async () => {
    try {
      const docRef = doc(db, "turnos", codigo);
      await deleteDoc(docRef);
      alert("Turno cancelado");
      setTurnoEncontrado(null);
      setCodigo("");
    } catch (error) {
      console.error("Error al cancelar el turno:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#212121" }}>
      {/* ...Navbar, INICIO, SERVICIOS, CURSOS, PRECIOS... */}

      {/* Sección TURNO */}
      <section id="TURNO" className="contacto">
        <div className="contenedor container">
          <h4>PEDIR TURNO</h4>
          <form className="formulario" onSubmit={handleSubmit}>
            <div className="form-grup form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              <label htmlFor="nombre">Nombre</label>
            </div>
            <div className="form-grup form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="usuario"
                name="usuario"
                placeholder="Usuario"
                value={formData.usuario}
                onChange={handleChange}
                required
              />
              <label htmlFor="usuario">Usuario</label>
            </div>
            <div className="form-grup mb-3">
              <input
                type="date"
                className="form-control"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </div>
            <select
              className="form-grup form-select form-select-sm mb-3"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una hora</option>
              <option value="10:00">10:00</option>
              <option value="12:00">12:00</option>
              <option value="14:00">14:00</option>
            </select>
            <select
              className="form-grup form-select form-select-sm mb-3"
              name="trabajo"
              value={formData.trabajo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione el trabajo</option>
              <option value="SOFTGEL">SOFTGEL</option>
              <option value="SEMIPERMANENTE">SEMIPERMANENTE</option>
              <option value="CAPPING">CAPPING</option>
              <option value="PRESS-ON">PRESS-ON</option>
            </select>
            <div className="form-grup radio mb-3">
              <span>¿Necesita retiro?</span>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="retiro"
                  name="retiro"
                  checked={formData.retiro}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="retiro">
                  Sí
                </label>
              </div>
            </div>
            <button type="submit" className="form-grup btn-contacto">
              Agendar
            </button>
          </form>

          {/* Modificar o cancelar turno */}
          <form onSubmit={buscarTurno}>
            <div className="modificar mt-5">
              <p>¿Requiere modificar o cancelar?</p>
              <span>Ingrese su código</span>
              <div className="input-group flex-nowrap mb-3">
                <span className="input-group-text" id="addon-wrapping">#</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese su código"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="botones">Buscar</button>
            </div>
          </form>

          {turnoEncontrado && (
            <div className="mt-3">
              <h5>Turno encontrado:</h5>
              <p><strong>Nombre:</strong> {turnoEncontrado.nombre}</p>
              <p><strong>Trabajo actual:</strong> {turnoEncontrado.trabajo}</p>
              <select
                className="form-select mb-2"
                value={nuevoTrabajo}
                onChange={(e) => setNuevoTrabajo(e.target.value)}
              >
                <option value="SOFTGEL">SOFTGEL</option>
                <option value="SEMIPERMANENTE">SEMIPERMANENTE</option>
                <option value="CAPPING">CAPPING</option>
                <option value="PRESS-ON">PRESS-ON</option>
              </select>
              <button className="btn btn-warning me-2" onClick={modificarTurno}>
                Modificar
              </button>
              <button className="btn btn-danger" onClick={cancelarTurno}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;