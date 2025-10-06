import React, { useState } from 'react';

function Turnos() {
  const [isLogged, setIsLogged] = useState(false);
  const [loginForm, setLoginForm] = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');

  // Ejemplo de turnos agendados
  const [turnos] = useState([
    {
      nombre: 'Ana',
      correo: 'ana@email.com',
      fecha: '2025-10-10',
      hora: '10:00',
      trabajo: 'Softgel',
      retiro: true,
    },
    {
      nombre: 'Luis',
      correo: 'luis@email.com',
      fecha: '2025-10-12',
      hora: '12:00',
      trabajo: 'Semipermanente',
      retiro: false,
    },
  ]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Usuario y contraseña fijos para ejemplo
    if (loginForm.usuario === 'Day' && loginForm.password === 'Damaris') {
      setIsLogged(true);
      setError('');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  if (!isLogged) {
    return (
      <section className="Agendados">
        <div className="contenedor container">
          <h4>Login requerido</h4>
          <form onSubmit={handleLoginSubmit} style={{ maxWidth: 350, margin: '0 auto' }}>
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">Usuario</label>
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
              <label htmlFor="password" className="form-label">Contraseña</label>
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
            <button type="submit" className="btn btn-primary w-100">Ingresar</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="Agendados">
      <div className="contenedor container">
        <h4>Turnos Agendados</h4>
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Trabajo</th>
              <th>Retiro</th>
            </tr>
          </thead>
          <tbody>
            {turnos.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No hay turnos agendados.</td>
              </tr>
            ) : (
              turnos.map((t, idx) => (
                <tr key={idx}>
                  <td>{t.nombre}</td>
                  <td>{t.correo}</td>
                  <td>{t.fecha}</td>
                  <td>{t.hora}</td>
                  <td>{t.trabajo}</td>
                  <td>{t.retiro ? 'Sí' : 'No'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Turnos;