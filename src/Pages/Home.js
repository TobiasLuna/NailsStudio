import React from "react";

function Home() {
  return (
    <div style={{ backgroundColor: "#212121" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">LOVERS STUDIO</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">LOVERS</h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <a className="nav-link" href="#INICIO">INICIO</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#SERVICIOS">SERVICIOS</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#CURSOS">CURSOS</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#PRECIOS">PRECIOS</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#TURNO">TURNO</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Sección INICIO */}
      <section id="INICIO" className="home">
        <div className="container inicio item">
          <div className="text">
            <h4>Manos que inspiran, uñas que brillan</h4>
            <p>
              En LOVERS STUDIO, nos especializamos en 
              realzar la belleza de tus manos con diseños únicos y 
              cuidados profesionales. Descubre un mundo de colores,
              estilos y tendencias que se adaptan a tu personalidad. 
              Porque tus uñas no solo son un detalle, ¡son tu mejor 
              accesorio!
            </p>
            <a href="/#TURNO"><button className="btn-contacto">PEDIR TURNO</button></a>
          </div>
          <div className="imagen">
            <img src={process.env.PUBLIC_URL + "/images/inicio.jpeg"} alt="" />
          </div>
        </div>
      </section>

      {/* Sección SERVICIOS */}
      <section id="SERVICIOS" className="ser sect">
        <div className="container tarjetas item">
          {/* Tarjetas de servicios */}
          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header">
              <i className="fi fi-ts-finger-nail"></i>
            </div>
            <div className="card-body">
              <h5 className="card-title">SOFTGEL</h5>
              <p className="card-text">
                Extensiones ligeras y flexibles que lucen naturales y cómodas.
              </p>
            </div>
          </div>
          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header">
              <i className="fi fi-tr-finger-nail"></i>
            </div>
            <div className="card-body">
              <h5 className="card-title">SEMIPERMANENTE</h5>
              <p className="card-text">
                Manicura duradera con esmalte en gel que ofrece brillo y resistencia por semanas.
              </p>
            </div>
          </div>
          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header">
              <i className="fi fi-ts-polish-brush"></i>
            </div>
            <div className="card-body">
              <h5 className="card-title">NAILSART</h5>
              <p className="card-text">
                Diseños personalizados para uñas que reflejan tu estilo único.
              </p>
            </div>
          </div>
          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header">
              <i className="fi fi-ts-polish-bottle"></i>
            </div>
            <div className="card-body">
              <h5 className="card-title">CAPPING</h5>
              <p className="card-text">
                Refuerzo de uñas naturales con gel para mayor protección y fuerza.
              </p>
            </div>
          </div>
          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header">
              <i className="fi fi-ts-two-nails"></i>
            </div>
            <div className="card-body">
              <h5 className="card-title">PRESS-ON</h5>
              <p className="card-text"></p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección CURSOS */}
      <section id="CURSOS" className="container curso">
        <h2>CURSOS</h2>
        <p>
          Los cursos son personalizados, el día y horario es a coordinar,
          los materiales son aportados.
          se pide una seña de $10.000 
          para poder reservar el curso,
          cada uno de ellos dura una hora y media para que
          la alumna esté tranquila al realizar los prácticas y
          haga todo a tu tiempo
        </p>
        <div className="tarjetas">
          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header">
              <img src={process.env.PUBLIC_URL + "/images/semi.jpeg"} alt="" />
            </div>
            <div className="card-body">
              <h5 className="card-title">SEMIPERMANENTE</h5>
              <p className="card-text">
                $30.000
              </p>
            </div>
          </div>
          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header">
              <img src={process.env.PUBLIC_URL + "/images/softgel.jpeg"} alt="" />
            </div>
            <div className="card-body">
              <h5 className="card-title">SOFTGEL</h5>
              <p className="card-text">
                $35.000
              </p>
            </div>
          </div>
          <div className="card" style={{ maxWidth: "18rem" }}>
            <div className="card-header">
              <img src={process.env.PUBLIC_URL + "/images/nailsart.jpeg"} alt="" />
            </div>
            <div className="card-body">
              <h5 className="card-title">NAILS ART</h5>
              <p className="card-text">
                $45.000
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección PRECIOS */}
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

      {/* Sección TURNO */}
      <section id="TURNO" className="contacto">
        <div className="contenedor container">
          <h4>PEDIR TURNO</h4>
          {/* Aquí puedes agregar la lógica de mensajes y formularios más adelante */}
          <form className="formulario">
            <div className="form-grup form-floating mb-3 ">
              <input type="text" className="form-control" id="nombre" placeholder="Nombre" required />
              <label htmlFor="nombre">Nombre</label>
            </div>
            <div className="form-grup form-floating mb-3 ">
              <input type="email" className="form-control" id="correo" placeholder="name@example.com" required />
              <label htmlFor="correo">Correo</label>
            </div>
            <div className="form-grup mb-3 ">
              <input placeholder="dd/mm/yyyy" type="date" className="form-control" id="fecha" required />
            </div>
            <select className="form-grup form-select form-select-sm" aria-label="Small select example">
              <option value="">Seleccione una hora</option>
              {/* Opciones de hora */}
            </select>
            <select className="form-grup form-select form-select-sm" aria-label="Small select example">
              <option value="">Seleccione el trabajo</option>
              {/* Opciones de trabajo */}
            </select>
            <div className="form-grup radio">
              <span>¿Necesita retiro?</span>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="si" id="flexCheckDefault" />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  sí
                </label>
              </div>
            </div>
            <button type="submit" className="form-grup btn-contacto">Agendar</button>
          </form>
          <form>
            <div className="modificar">
              <p>¿Requiere modificar o cancelar?</p>
              <span>Ingrese su codigo</span>
              <div className="input-group flex-nowrap">
                <span className="input-group-text" id="addon-wrapping">#</span>
                <input type="text" className="form-control" placeholder="Ingrese su código" aria-label="id" aria-describedby="addon-wrapping" />
              </div>
              <button type="submit" className="botones">MODIFICAR</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;