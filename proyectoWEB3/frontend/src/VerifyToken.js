import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './VerifyToken.css'; // Importamos el archivo CSS
import { FaSignOutAlt } from 'react-icons/fa'; // Importamos el icono de logout

function VerifyToken() {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null); // Estado para el usuario
  const navigate = useNavigate(); // Obtenemos la función navigate

  // Cargar usuario desde localStorage si existe
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Usuario cargado desde localStorage:', storedUser);
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/verificar_usuario/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Usuario verificado con éxito. Ahora puedes iniciar sesión.');
      } else {
        setMessage('Token no válido o ya usado. Verifica nuevamente.');
      }
    } catch (error) {
      setMessage('Error en la verificación. Inténtalo de nuevo.');
    }
  };

  const handleGoHome = () => {
    navigate('/'); // Navega a la página inicial
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <>
      {/* Barra de navegación */}
      <div className="navbar">
        <div className="logo-container">
          <img src="/BYT.jpg" alt="Logo" className="navbar-logo" />
          <h1 className="navbar-title">Build Your Tech</h1>
        </div>
        <div className="header-buttons">
          {user ? (
            <div className="user-menu">
              <button className="logout-icon-button" onClick={handleLogout}>
                <FaSignOutAlt size={24} />
              </button>
              <span className="user-name"> {user.name}</span>
              {user.email.endsWith('@upc.edu.co') && (
                <Link to="/add-product">
                  <button className="admin-button">Administrador</button>
                </Link>
              )}
            </div>
          ) : (
            <button className="login-button" onClick={() => navigate('/')}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="verify-container">
        <div className="verify-content">
          <h2>Verificar Cuenta</h2>
          <form onSubmit={handleSubmit} className="verify-form">
            <input
              type="text"
              placeholder="Ingresa tu token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <div className="form-buttons">
              <button type="submit">Verificar</button>
              <button type="button" onClick={handleGoHome}>
                Volver a Inicio
              </button>
            </div>
          </form>
          {message && <p className="verify-message">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default VerifyToken;
