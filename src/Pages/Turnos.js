import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";

function Turnos() {
  const [isLogged, setIsLogged] = useState(false);
  const [loginForm, setLoginForm] = useState({ usuario: "", password: "" });
  const [error, setError] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [turnoEditando, setTurnoEditando] = useState(null);
  const [datosEdicion, setDatosEdicion] = useState({
    trabajo: "",
    fecha: "",
    hora: "",
  });
  const [vistaMovil, setVistaMovil] = useState(window.innerWidth < 768);

  // Detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setVistaMovil(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cargar turnos desde Firestore
  const cargarTurnos = async () => {
    try {
      const q = query(collection(db, "turnos"), orderBy("fecha", "desc"));
      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTurnos(lista);
    } catch (error) {
      console.error("Error al cargar turnos:", error);
    }
  };

  useEffect(() => {
    if (isLogged) {
      cargarTurnos();
    }
  }, [isLogged]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginForm.usuario === "Day" && loginForm.password === "Damaris") {
      setIsLogged(true);
      setError("");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  // Validar que la fecha no sea anterior a hoy
  const validarFecha = (fecha) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(fecha);
    if (fechaSeleccionada < hoy) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La fecha seleccionada no puede ser anterior a hoy.",
        confirmButtonColor: "#d33",
      });
      return false;
    }
    return true;
  };

  // Validar disponibilidad del turno (excluyendo el turno actual)
  const validarTurno = async (fecha, hora, idExcluir) => {
    try {
      const turnosRef = collection(db, "turnos");
      const q = query(
        turnosRef,
        where("fecha", "==", fecha),
        where("hora", "==", hora)
      );
      const querySnapshot = await getDocs(q);

      const turnosOcupados = querySnapshot.docs.filter(doc => doc.id !== idExcluir);
      return turnosOcupados.length === 0;
    } catch (error) {
      console.error("Error al validar el turno:", error);
      return false;
    }
  };

  const eliminarTurno = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "turnos", id));
        setTurnos(turnos.filter((t) => t.id !== id));
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El turno ha sido eliminado.",
          confirmButtonColor: "#3085d6",
        });
      } catch (error) {
        console.error("Error al eliminar turno:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el turno.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const iniciarEdicion = (turno) => {
    setTurnoEditando(turno.id);
    setDatosEdicion({
      trabajo: turno.trabajo,
      fecha: turno.fecha,
      hora: turno.hora,
    });
  };

  const cancelarEdicion = () => {
    setTurnoEditando(null);
    setDatosEdicion({ trabajo: "", fecha: "", hora: "" });
  };

  const handleEdicionChange = (e) => {
    const { name, value } = e.target;
    setDatosEdicion({ ...datosEdicion, [name]: value });
  };

  const guardarEdicion = async (id) => {
    if (!validarFecha(datosEdicion.fecha)) return;

    const disponible = await validarTurno(
      datosEdicion.fecha,
      datosEdicion.hora,
      id
    );

    if (!disponible) {
      Swal.fire({
        icon: "error",
        title: "Turno ocupado",
        text: "Ese horario ya está reservado. Elige otro 😉",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      await updateDoc(doc(db, "turnos", id), datosEdicion);
      setTurnos(
        turnos.map((t) =>
          t.id === id ? { ...t, ...datosEdicion } : t
        )
      );
      Swal.fire({
        icon: "success",
        title: "¡Turno Modificado!",
        text: "El turno fue modificado con éxito 🎉",
        confirmButtonColor: "#3085d6",
      });
      cancelarEdicion();
    } catch (error) {
      console.error("Error al modificar turno:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo modificar el turno.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Vista de tarjetas para móvil
  const TarjetaTurno = ({ turno }) => (
    <div className="card mb-3" style={{ backgroundColor: "#2c2c2c", border: "1px solid #444" }}>
      <div className="card-body">
        <h5 className="card-title text-white">{turno.nombre}</h5>
        <p className="card-text text-light mb-1">
          <strong>Usuario:</strong> {turno.usuario}
        </p>
        <p className="card-text text-light mb-1">
          <strong>Fecha:</strong> {turno.fecha}
        </p>
        <p className="card-text text-light mb-1">
          <strong>Hora:</strong> {turno.hora}
        </p>
        <p className="card-text text-light mb-1">
          <strong>Trabajo:</strong> {turno.trabajo}
        </p>
        <p className="card-text text-light mb-3">
          <strong>Retiro:</strong> {turno.retiro ? "Sí" : "No"}
        </p>

        {turnoEditando === turno.id ? (
          <div className="border-top pt-3 mt-3">
            <h6 className="text-white mb-3">Editar Turno</h6>
            <div className="mb-3">
              <label className="form-label text-light">Fecha:</label>
              <input
                type="date"
                className="form-control"
                name="fecha"
                value={datosEdicion.fecha}
                onChange={handleEdicionChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-light">Hora:</label>
              <select
                className="form-select"
                name="hora"
                value={datosEdicion.hora}
                onChange={handleEdicionChange}
              >
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
                <option value="19:00">19:00</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label text-light">Trabajo:</label>
              <select
                className="form-select"
                name="trabajo"
                value={datosEdicion.trabajo}
                onChange={handleEdicionChange}
              >
                <option value="SOFTGEL">SOFTGEL</option>
                <option value="SEMIPERMANENTE">SEMIPERMANENTE</option>
                <option value="CAPPING">CAPPING</option>
                <option value="PRESS-ON">PRESS-ON</option>
              </select>
            </div>
            <div className="d-grid gap-2">
              <button
                className="btn btn-success"
                onClick={() => guardarEdicion(turno.id)}
              >
                Guardar Cambios
              </button>
              <button
                className="btn btn-secondary"
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="d-grid gap-2">
            <button
              className="btn btn-warning"
              onClick={() => iniciarEdicion(turno)}
            >
              Modificar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => eliminarTurno(turno.id)}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (!isLogged) {
    return (
      <section className="Agendados" style={{ minHeight: "100vh", paddingTop: "80px" }}>
        <div className="container contenedor">
          <h4 className="text-center mb-4">Login requerido</h4>
          <form
            onSubmit={handleLoginSubmit}
            style={{ maxWidth: 350, margin: "0 auto" }}
          >
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">
                Usuario
              </label>
              <input
                type="text"
                className="form-control"
                id="usuario"
                name="usuario"
                value={loginForm.usuario}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">
              Ingresar
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="Agendados" style={{ minHeight: "100vh", paddingTop: "80px" }}>
      <div className="container contenedor">
        <h4 className="text-center mb-4">Turnos Agendados</h4>

        {vistaMovil ? (
          // Vista de tarjetas para móvil
          <div>
            {turnos.length === 0 ? (
              <div className="alert alert-info text-center">
                No hay turnos agendados.
              </div>
            ) : (
              turnos.map((t) => <TarjetaTurno key={t.id} turno={t} />)
            )}
          </div>
        ) : (
          // Vista de tabla para desktop
          <div className="table-responsive">
            <table className="table table-striped table-dark">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Trabajo</th>
                  <th>Retiro</th>
                  <th style={{ minWidth: "200px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {turnos.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No hay turnos agendados.
                    </td>
                  </tr>
                ) : (
                  turnos.map((t) => (
                    <React.Fragment key={t.id}>
                      <tr>
                        <td>{t.nombre}</td>
                        <td>{t.usuario}</td>
                        <td>{t.fecha}</td>
                        <td>{t.hora}</td>
                        <td>{t.trabajo}</td>
                        <td>{t.retiro ? "Sí" : "No"}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2 mb-1"
                            onClick={() => iniciarEdicion(t)}
                          >
                            Modificar
                          </button>
                          <button
                            className="btn btn-danger btn-sm mb-1"
                            onClick={() => eliminarTurno(t.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                      {turnoEditando === t.id && (
                        <tr>
                          <td colSpan="7" style={{ backgroundColor: "#2c2c2c" }}>
                            <div className="p-3">
                              <h6 className="mb-3">Editar Turno</h6>
                              <div className="row g-3">
                                <div className="col-md-4">
                                  <label className="form-label">Fecha:</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="fecha"
                                    value={datosEdicion.fecha}
                                    onChange={handleEdicionChange}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">Hora:</label>
                                  <select
                                    className="form-select"
                                    name="hora"
                                    value={datosEdicion.hora}
                                    onChange={handleEdicionChange}
                                  >
                                    <option value="13:00">13:00</option>
                                    <option value="14:00">14:00</option>
                                    <option value="15:00">15:00</option>
                                    <option value="16:00">16:00</option>
                                    <option value="17:00">17:00</option>
                                    <option value="18:00">18:00</option>
                                    <option value="19:00">19:00</option>
                                  </select>
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">Trabajo:</label>
                                  <select
                                    className="form-select"
                                    name="trabajo"
                                    value={datosEdicion.trabajo}
                                    onChange={handleEdicionChange}
                                  >
                                    <option value="SOFTGEL">SOFTGEL</option>
                                    <option value="SEMIPERMANENTE">SEMIPERMANENTE</option>
                                    <option value="CAPPING">CAPPING</option>
                                    <option value="PRESS-ON">PRESS-ON</option>
                                  </select>
                                </div>
                              </div>
                              <div className="mt-3">
                                <button
                                  className="btn btn-success btn-sm me-2"
                                  onClick={() => guardarEdicion(t.id)}
                                >
                                  Guardar
                                </button>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={cancelarEdicion}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Turnos;