// SalesPage.js
import React, { useContext, useState, useEffect } from 'react';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';

function SalesPage({ onLoginClick, user, onLogoutClick }) {
  const { addToCart, getTotalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [products, setProducts] = useState([]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const isAdmin = user && user.role === 'ADMIN';

  const handleIaClick = () => {
    if (user) {
      navigate('/chat');
    } else {
      onLoginClick();
    }
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/productos/')
      .then(response => {
        if (!response.ok) throw new Error("Error al obtener los productos");
        return response.json();
      })
      .then(data => setProducts(data.slice(0, 30))) // Solo muestra los primeros 30 productos
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleAddToCart = (product) => {
    if (user) {
      addToCart(product);
    } else {
      onLoginClick();
    }
  };

  return (
    <div className="App">
      <header className="navbar">
        <button className="logo-button" onClick={() => navigate('/')}>
          <img src="/BYT.jpg" alt="Logo" className="navbar-logo" />
          <span className="navbar-title">BUILD-YOUR-TECH</span>
        </button>
        <div className="search-bar">
          <input type="text" placeholder="Buscar..." />
          <button className="search-button">
            <span role="img" aria-label="search">&#128269;</span>
          </button>
        </div>
        <div className="header-buttons">
          <Link to="/cart">
            <div className="cart-button">
              <span role="img" aria-label="cart">&#128722;</span>
              {getTotalItems() > 0 && (
                <span className="cart-count">{getTotalItems()}</span>
              )}
            </div>
          </Link>

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
        </div>
      </header>

      <div className="hero">
        <img src="/BYT.jpg" alt="Logo" className="logo" />
        <p className="slogan">Computadores a tu medida guiado por innovación</p>
      </div>

      <div className="ia-section">
        <div className="ia-text">
          ¿Necesitas Asesoría? Pregúntale a nuestra IA para llevar el mejor equipo según tus necesidades.
        </div>
        <button className="ia-button" onClick={handleIaClick}>
          <img src="/IAlogo.png" alt="Asesoría IA" className="ia-icon" />
          <span className="ia-label">Asesoría IA</span>
        </button>
      </div>

      <div className="products-bar">
        <h2 className="products-title">Productos destacados</h2>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.img} alt={product.description} className="product-img" />
            <div className="product-info">
              <p className="product-description">{product.description}</p>
              <p className="product-price">{formatCurrency(parseFloat(product.price.replace('$', '')) || 0)}</p>
              {product.info && (
                <div className="product-details">
                  <p><strong>Procesador:</strong> {product.info.procesador}</p>
                  <p><strong>RAM:</strong> {product.info.ram}</p>
                  <p><strong>Almacenamiento:</strong> {product.info.almacenamiento}</p>
                  <p><strong>Gráfica:</strong> {product.info.grafica}</p>
                </div>
              )}
              <button className="add-to-cart" onClick={() => handleAddToCart(product)}>
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pie de página */}
      <footer className="footer">
        <div className="footer-section">
          <h3>Sobre Build Your Tech</h3>
          <ul>
            <li>Sobre nosotros</li>
            <li>Contáctanos</li>
            <li>Vacantes</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Ayuda</h3>
          <ul>
            <li>Preguntas frecuentes</li>
            <li>Cómo comprar</li>
            <li>Política de devoluciones</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Comunidad</h3>
          <ul>
            <li>Blog</li>
            <li>Sorteos</li>
            <li>Afíliate</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Síguenos</h3>
          <div className="social-icons">
            <span>Facebook</span>
            <span>Twitter</span>
            <span>Instagram</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SalesPage;
