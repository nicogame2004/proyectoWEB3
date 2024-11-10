import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { IAProvider } from './IAContext';
import { CartContext } from './CartContext'; // Importa CartContext
import HomePage from './HomePage';
import SalesPage from './SalesPage';
import ChatPage from './ChatPage';
import CartPage from './CartPage';
import AddProductPage from './AddProductPage';
import VerifyToken from './VerifyToken';
import ProtectedRoute from './ProtectedRoute';
import UsersPage from './UsersPage';
import { FaSignOutAlt } from 'react-icons/fa';
import ReCAPTCHA from "react-google-recaptcha";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);

  const { clearCart } = useContext(CartContext); // Accede a clearCart desde el contexto del carrito

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    clearCart(); // Limpia el carrito al cerrar sesión
  };

  const handleRegisterClick = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setMessage('');
    setCaptchaToken(null);
  };

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const hasUpperCase = /[A-Z]/;
    const hasNumber = /[0-9]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!hasUpperCase.test(password)) {
      return 'La contraseña debe tener al menos una letra mayúscula';
    }
    if (!hasNumber.test(password)) {
      return 'La contraseña debe tener al menos un número';
    }
    if (!hasSpecialChar.test(password)) {
      return 'La contraseña debe tener al menos un carácter especial';
    }
    return '';
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setMessage("Por favor, completa el reCAPTCHA");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    const userData = { name, email, password, captcha: captchaToken };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.');
      } else {
        setMessage(`Error en el registro: ${data.message || 'Inténtalo de nuevo'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectar con el servidor');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setMessage("Por favor, completa el reCAPTCHA");
      return;
    }

    const credentials = { email, password, captcha: captchaToken };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setShowLoginModal(false);
      } else {
        setMessage(`Error al iniciar sesión: ${data.message || 'Inténtalo de nuevo'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectar con el servidor');
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  return (
    <IAProvider>
      <Router>
        <div className="navbar">
          <div className="logo-container">
            <img src="logo.png" alt="Logo" className="navbar-logo" />
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
                  <>
                    <Link to="/add-product">
                      <button className="admin-button">Administrador</button>
                    </Link>
                    <Link to="/users">
                      <button className="admin-button">Usuarios</button>
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <button className="login-button" onClick={handleLoginClick}>
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onLoginClick={handleLoginClick}
                user={user}
                onLogoutClick={handleLogout}
              />
            }
          />
          <Route
            path="/sales"
            element={
              <SalesPage
                onLoginClick={handleLoginClick}
                user={user}
                onLogoutClick={handleLogout}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <ChatPage
                onLoginClick={handleLoginClick}
                user={user}
                onLogoutClick={handleLogout}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                user={user}
                onLoginClick={handleLoginClick}
                onLogoutClick={handleLogout}
              />
            }
          />
          <Route path="/verify" element={<VerifyToken />} />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddProductPage user={user} onLogoutClick={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute user={user}>
                <UsersPage user={user} onLogoutClick={handleLogout} />
              </ProtectedRoute>
            }
          />
        </Routes>

        {showLoginModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={closeModal}>&times;</span>
              <h2>Iniciar Sesión</h2>
              <form onSubmit={handleLoginSubmit}>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className='recaptcha'>
                  <ReCAPTCHA
                    sitekey="6Lf1P3kqAAAAAKoWObRxFBkwGVL2_vD4utHBq67h"
                    onChange={handleCaptchaChange}
                  />
                </div>
                <button type="submit">Iniciar Sesión</button>
              </form>
              <p>
                ¿No tienes cuenta?{' '}
                <span className="register-link" onClick={handleRegisterClick}>
                  Regístrate aquí
                </span>
              </p>
              {message && <p>{message}</p>}
            </div>
          </div>
        )}

        {showRegisterModal && (
          <div className="modal">
            <div className="register-modal-content">
              <span className="close-button" onClick={closeModal}>&times;</span>
              <h2>Crear Cuenta</h2>
              <form onSubmit={handleRegisterSubmit}>
                <input
                  type="text"
                  placeholder="Nombre Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className='recaptcha'>
                  <ReCAPTCHA
                    sitekey="6Lf1P3kqAAAAAKoWObRxFBkwGVL2_vD4utHBq67h"
                    onChange={handleCaptchaChange}
                  />
                </div>
                <button type="submit">Registrarse</button>
              </form>
              {message && <p>{message}</p>}
            </div>
          </div>
        )}
      </Router>
    </IAProvider>
  );
}

export default App;
