import React, { useState } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function Home() {
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    fecha: "",
    hora: "",
    trabajo: "",
    retiro: false,
  });

  const [codigo, setCodigo] = useState("");
  const [turnoEncontrado, setTurnoEncontrado] = useState(null);
  const [nuevoTrabajo, setNuevoTrabajo] = useState("");

  // Manejar inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validar que la fecha no sea anterior a hoy
  const ValidarFecha = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // ignorar horas
    const fechaSeleccionada = new Date(formData.fecha);
    if (fechaSeleccionada < hoy) {
      alert("La fecha seleccionada no puede ser anterior a hoy.");
      return false;
    }
    return true;
  };

  // Validar si ya existe un turno en la misma fecha/hora
  const validarTurno = async (fecha, hora) => {
    try {
      const turnosRef = collection(db, "turnos");
      const q = query(
        turnosRef,
        where("fecha", "==", fecha),
        where("hora", "==", hora)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // true = libre, false = ocupado
    } catch (error) {
      console.error("Error al validar el turno:", error);
      return false;
    }
  };

  // Agendar turno
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ValidarFecha()) return;

    const disponible = await validarTurno(formData.fecha, formData.hora);
    if (!disponible) {
      alert("Ese turno ya está ocupado, por favor elija otra hora.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "turnos"), formData);
      alert(`Turno agendado con éxito. Tu código es: ${docRef.id}`);
      setFormData({
        nombre: "",
        usuario: "",
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

  // Buscar turno por código
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

  // Modificar trabajo del turno
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

  // Cancelar turno
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
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg fixed-top" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            LOVERS STUDIO
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                LOVERS
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <a className="nav-link" href="#INICIO">Inicio</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#SERVICIOS">Servicios</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#CURSOS">Cursos</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#PRECIOS">Precios</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#TURNO">Turnos</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* SECCIÓN TURNOS */}
      <section id="TURNO" className="contacto">
        <div className="contenedor container">
          <h4>PEDIR TURNO</h4>
          <form className="formulario" onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
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

            <div className="form-floating mb-3">
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

            <div className="mb-3">
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
              className="form-select mb-3"
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
              className="form-select mb-3"
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

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="retiro"
                name="retiro"
                checked={formData.retiro}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="retiro">
                ¿Necesita retiro?
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              Agendar
            </button>
          </form>

          {/* Modificar o cancelar turno */}
          <form onSubmit={buscarTurno} className="mt-5">
            <p>¿Requiere modificar o cancelar?</p>
            <div className="input-group mb-3">
              <span className="input-group-text">#</span>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su código"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary">Buscar</button>
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
