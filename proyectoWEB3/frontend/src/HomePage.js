// HomePage.js
import React, { useState } from 'react';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';

function HomePage({ onLoginClick, user, onLogoutClick }) {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const isAdmin = user && user.role === 'ADMIN'; // Verifica si el rol es 'Admin'

  const handleTryNowClick = () => {
    if (user) {
      navigate('/chat'); // Redirects to the chat page if authenticated
    } else {
      onLoginClick(); // Shows the login modal if not authenticated
    }
  };

  return (
    <div className="App">
      <header className="navbar">
        <div className="logo-container">
          <img src="/BYT.jpg" alt="Logo" className="navbar-logo" />
          <span className="navbar-title">BUILD-YOUR-TECH</span>
        </div>
        
        {user ? (
          <div className="user-info">
            <button className="user-name" onClick={toggleDropdown}>
              {user.name}
            </button>
            
            {dropdownVisible && (
              <div className="dropdown-menu">
                {isAdmin && (
                  <>
                    <Link to="/add-product">
                      <button className="dropdown-item">Productos</button>
                    </Link>
                    <Link to="/users">
                      <button className="dropdown-item">Usuarios</button>
                    </Link>
                  </>
                )}
                <button className="dropdown-item" onClick={onLogoutClick}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-button" onClick={onLoginClick}>
            <span className="user-icon">&#128100;</span> INICIAR SESIÓN
          </button>
        )}
      </header>

      <div className="welcome-container">
        <div className="welcome-content">
          <img src="/IAlogo.png" alt="Asesoría IA" className="welcome-logo" />
          <h1 className="welcome-title">Bienvenido a BUILD-YOUR-TECH</h1>
          <p className="welcome-description">
            ¿TIENES PROBLEMAS PARA ELEGIR TU MÁQUINA IDEAL?
            Prueba nuestra IA, que en base a tus necesidades te dará las mejores recomendaciones para que puedas llevar un computador de acuerdo a tus requerimientos.
          </p>

          <div className="welcome-buttons">
            <Link to="/sales">
              <button className="welcome-button skip-button">Omitir</button>
            </Link>
            <button className="welcome-button try-now-button" onClick={handleTryNowClick}>Probar Ahora</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
