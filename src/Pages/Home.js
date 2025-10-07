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

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validar que la fecha no sea anterior a hoy
  const validarFecha = () => {
    const hoy = new Date();
    const fechaSeleccionada = new Date(formData.fecha);
    if (fechaSeleccionada < hoy) {
      alert("La fecha seleccionada no puede ser anterior a hoy.");
      return false;
    }
    return true;
  };

  // Validar disponibilidad del turno
  const validarTurno = async (fecha, hora) => {
    try {
      const turnosRef = collection(db, "turnos");
      const q = query(
        turnosRef,
        where("fecha", "==", fecha),
        where("hora", "==", hora)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // true = disponible, false = ocupado
    } catch (error) {
      console.error("Error al validar el turno:", error);
      return false;
    }
  };

  // Guardar un nuevo turno
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFecha()) return;

    const disponible = await validarTurno(formData.fecha, formData.hora);
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
      const docRef = await addDoc(collection(db, "turnos"), formData);
      Swal.fire({
        icon: "success",
        title: "¡Turno reservado!",
        text: `Tu reserva fue registrada con éxito 🎉, Codigo: ${docRef.id}`,
        confirmButtonColor: "#3085d6",
      });
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, intenta nuevamente más tarde.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Buscar un turno por ID
  const buscarTurno = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "turnos", codigo);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTurnoEncontrado({ id: docSnap.id, ...docSnap.data() });
        setNuevoTrabajo(docSnap.data().trabajo);
      } else {
        Swal.fire({
          icon: "error",
          title: "Modificar",
          text: "No se encontró ningún turno con ese código.",
          confirmButtonColor: "#d33",
        });
        setTurnoEncontrado(null);
      }
    } catch (error) {
      console.error("Error al buscar el turno:", error);
    }
  };

  // Modificar un turno existente
  const modificarTurno = async () => {
    try {
      const docRef = doc(db, "turnos", codigo);
      await updateDoc(docRef, { trabajo: nuevoTrabajo });
      Swal.fire({
        icon: "success",
        title: "¡Turno Modificado!",
        text: "Tu turno fue modificado con éxito 🎉",
        confirmButtonColor: "#3085d6",
      });
      setTurnoEncontrado(null);
      setCodigo("");
    } catch (error) {
      console.error("Error al modificar el turno:", error);
    }
  };

  // Cancelar un turno existente
  const cancelarTurno = async () => {
    try {
      const docRef = doc(db, "turnos", codigo);
      await deleteDoc(docRef);
      Swal.fire({
        icon: "success",
        title: "¡Turno Cancelado!",
        text: "Tu turno fue cancelado con éxito 🎉",
        confirmButtonColor: "#3085d6",
      });
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
          <a className="navbar-brand" href="#">LOVERS STUDIO</a>
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
                <li className="nav-item"><a className="nav-link" href="#INICIO">Inicio</a></li>
                <li className="nav-item"><a className="nav-link" href="#SERVICIOS">Servicios</a></li>
                <li className="nav-item"><a className="nav-link" href="#CURSOS">Cursos</a></li>
                <li className="nav-item"><a className="nav-link" href="#PRECIOS">Precios</a></li>
                <li className="nav-item"><a className="nav-link" href="#TURNO">Turnos</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* INICIO */}
      <section id="INICIO" className="home">
        <div className="container inicio item">
          <div className="text">
            <h4>Manos que inspiran, uñas que brillan</h4>
            <p>
              En LOVERS STUDIO, nos especializamos en realzar la belleza de tus manos
              con diseños únicos y cuidados profesionales. Descubre un mundo de colores,
              estilos y tendencias que se adaptan a tu personalidad. Porque tus uñas no solo
              son un detalle, ¡son tu mejor accesorio!
            </p>
            <a href="/#TURNO">
              <button className="btn-contacto">PEDIR TURNO</button>
            </a>
          </div>
          <div className="imagen">
            <img src="/images/inicio.jpeg" alt="Inicio" />
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="SERVICIOS" className="ser sect">
        <div className="container tarjetas item">
          {/* Tarjetas de servicios */}
          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header"><i className="fi fi-ts-finger-nail"></i></div>
            <div className="card-body">
              <h5 className="card-title">SOFTGEL</h5>
              <p className="card-text">Extensiones ligeras y flexibles que lucen naturales y cómodas.</p>
            </div>
          </div>

          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header"><i className="fi fi-tr-finger-nail"></i></div>
            <div className="card-body">
              <h5 className="card-title">SEMIPERMANENTE</h5>
              <p className="card-text">Manicura duradera con esmalte en gel que ofrece brillo y resistencia por semanas.</p>
            </div>
          </div>

          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header"><i className="fi fi-ts-polish-brush"></i></div>
            <div className="card-body">
              <h5 className="card-title">NAILSART</h5>
              <p className="card-text">Diseños personalizados para uñas que reflejan tu estilo único.</p>
            </div>
          </div>

          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header"><i className="fi fi-ts-polish-bottle"></i></div>
            <div className="card-body">
              <h5 className="card-title">CAPPING</h5>
              <p className="card-text">Refuerzo de uñas naturales con gel para mayor protección y fuerza.</p>
            </div>
          </div>

          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header"><i className="fi fi-ts-two-nails"></i></div>
            <div className="card-body">
              <h5 className="card-title">PRESS-ON</h5>
              <p className="card-text">Uñas listas para usar con diseños únicos y prácticos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CURSOS */}
      <section id="CURSOS" className="container curso">
        <h2>CURSOS</h2>
        <p>
          Los cursos son personalizados, el día y horario es a coordinar, los materiales son aportados.
          Se pide una seña de $10.000 para poder reservar el curso, cada uno de ellos dura una hora y media
          para que la alumna esté tranquila al realizar las prácticas y haga todo a su tiempo.
        </p>
        <div className="tarjetas">
          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header"><img src="/images/semi.jpeg" alt="Curso Semipermanente" /></div>
            <div className="card-body">
              <h5 className="card-title">SEMIPERMANENTE</h5>
              <p className="card-text">$30.000</p>
            </div>
          </div>

          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header"><img src="/images/softgel.jpeg" alt="Curso Softgel" /></div>
            <div className="card-body">
              <h5 className="card-title">SOFTGEL</h5>
              <p className="card-text">$35.000</p>
            </div>
          </div>

          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header"><img src="/images/nailsart.jpeg" alt="Curso Nails Art" /></div>
            <div className="card-body">
              <h5 className="card-title">NAILS ART</h5>
              <p className="card-text">$45.000</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section id="PRECIOS" className="art">
        <div className="container item">
          <h4>PRECIOS</h4>
          <h5>SOFTGEL LISO..................$</h5>
          <h5>SOFTGEL + DISEÑO SIMPLE..................$</h5>
          <h5>SOFTGEL FULL..................$</h5>
          <h5>SOFTGEL + APLIQUES..................$</h5>
          <h5>SEMIPERMANENTE..................$</h5>
          <h5>CAPPING..................$</h5>
          <h5>PRESS ON..................$</h5>
          <h5>PRESS ON FULL SET..................$</h5>
        </div>
      </section>

      {/* TURNOS */}
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
