// addproductopage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AddProductPage.css';

const AddProductPage = ({ user, onLogoutClick }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [productId, setProductId] = useState('');
  const [productData, setProductData] = useState({
    producto: '',
    descripcion: '',
    precio: '',
    procesador: '',
    ram: '',
    almacenamiento: '',
    grafica: '',
    imagenUrl: ''
  });
  const [isEditable, setIsEditable] = useState(false);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isIdSearched, setIsIdSearched] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const isAdmin = user && user.role === 'ADMIN'; // Verifica si el rol es 'Admin'

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/productos_texto/');
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error('Error al cargar todos los productos:', error);
        setAllProducts(generatePlaceholderProducts());
      }
    };
    fetchAllProducts();
  }, []);

  const generatePlaceholderProducts = () => {
    const placeholderProducts = [];
    for (let i = 1; i <= 10; i++) {
      placeholderProducts.push({
        id: i,
        producto: `Producto ${i}`,
        descripcion: `Descripción del producto ${i}`,
        precio: `$${i * 10}`,
        procesador: `Procesador ${i}`,
        ram: `${i * 2} GB`,
        almacenamiento: `${i * 50} GB`,
        grafica: `Gráfica ${i}`,
        imagenUrl: `http://example.com/image${i}.jpg`
      });
    }
    return placeholderProducts;
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/productos/${productId}`);
      if (!response.ok) {
        throw new Error('Producto no encontrado');
      }
      const data = await response.json();
      setProductData({
        producto: data.producto,
        descripcion: data.descripcion,
        precio: data.precio,
        procesador: data.procesador,
        ram: data.ram,
        almacenamiento: data.almacenamiento,
        grafica: data.grafica,
        imagenUrl: data.imagenUrl
      });
      setIsEditable(false);
      setShowConfirmButtons(false);
      setIsIdSearched(true);
    } catch (error) {
      console.error('Error:', error);
      setProductData({
        producto: '',
        descripcion: '',
        precio: '',
        procesador: '',
        ram: '',
        almacenamiento: '',
        grafica: '',
        imagenUrl: ''
      });
      setIsEditable(false);
      alert('Producto no encontrado');
    } 
  };

  const handleCreate = () => {
    setProductData({
      producto: '',
      descripcion: '',
      precio: '',
      procesador: '',
      ram: '',
      almacenamiento: '',
      grafica: '',
      imagenUrl: ''
    });
    setProductId('');
    setIsEditable(true);
    setShowConfirmButtons(true);
    setIsIdSearched(false);
    setConfirmationMessage('¿Seguro que quieres crear el nuevo producto?');
  };

  const handleEdit = () => {
    setIsEditable(true);
    setShowConfirmButtons(true);
    setConfirmationMessage('¿Seguro que quieres confirmar los cambios?');
  };
  
  const handleDelete = () => {
    setShowConfirmButtons(true);
    setConfirmationMessage('¿Seguro que quieres eliminar el producto?');
  };
  
  const handleConfirm = () => {
    setShowConfirmationModal(true);
  };
  
  const handleCancel = () => {
    setIsEditable(false);
    setShowConfirmButtons(false);
    setShowConfirmationModal(false);
    setProductData({
      producto: '',
      descripcion: '',
      precio: '',
      procesador: '',
      ram: '',
      almacenamiento: '',
      grafica: '',
      imagenUrl: ''
    });
    setProductId('');
  };
  
  // Validar que todos los campos estén llenos
  const validateFields = (data) => {
    return Object.values(data).every((value) => value !== '');
  };
  
  // Función para crear un nuevo producto
  const handleCreateConfirm = async () => {
    if (!validateFields(productData)) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/productos/crear/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }
  
      const data = await response.json();
      alert(data.success || 'Producto creado exitosamente');
      setProductData({
        producto: '',
        descripcion: '',
        precio: '',
        procesador: '',
        ram: '',
        almacenamiento: '',
        grafica: '',
        imagenUrl: ''
      });
      setProductId('');
      setIsEditable(false);
      setShowConfirmButtons(false);
    } catch (error) {
      console.error('Error al crear el producto:', error);
      alert('Error al crear el producto');
    }
  };
  
  const handleUpdate = async () => {
    if (!validateFields(productData)) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/productos/${productId}/editar/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }
  
      const data = await response.json();
      alert(data.success || 'Producto actualizado');
      setIsEditable(false);
      setShowConfirmButtons(false);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      alert('Error al actualizar el producto');
    }
  };
  
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/productos/${productId}/eliminar/`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }
  
      const data = await response.json();
      alert(data.success || 'Producto eliminado');
      setProductData({
        producto: '',
        descripcion: '',
        precio: '',
        procesador: '',
        ram: '',
        almacenamiento: '',
        grafica: '',
        imagenUrl: ''
      });
      setProductId('');
      setIsEditable(false);
      setShowConfirmButtons(false);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Error al eliminar el producto');
    }
  };
  
  const finalConfirm = () => {
    setShowConfirmationModal(false);
    if (confirmationMessage === '¿Seguro que quieres eliminar el producto?') {
      handleDeleteConfirm();
    } else if (confirmationMessage === '¿Seguro que quieres crear el nuevo producto?') {
      handleCreateConfirm();
    } else if (confirmationMessage === '¿Seguro que quieres confirmar los cambios?') {
      handleUpdate();
    }

     // Restablecer el estado después de la confirmación de cualquier acción
  setIsIdSearched(false); // Permite que el botón "Crear" se reactive
  setProductId('');
  setProductData({
    producto: '',
    descripcion: '',
    precio: '',
    procesador: '',
    ram: '',
    almacenamiento: '',
    grafica: '',
    imagenUrl: ''
  });
  };

  // Nueva función handleLogout
  const handleLogout = () => {
    onLogoutClick();
    navigate('/');
  };

  return (
    <div className="add-product-page">
      <div className="add-product-header">
        <button className="logo-button" onClick={() => navigate('/')}>
          <img src="/BYT.jpg" alt="Logo" className="navbar-logo" />
          <span className="navbar-title">BUILD-YOUR-TECH</span>
        </button>
        <div className="header-buttons">
          {user && (
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
                  <button className="dropdown-item" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
          <button className="back-button" onClick={() => navigate('/sales')}>X</button>
        </div>
      </div>

      <div className="add-product-content">
        <h2>Gestión de Productos</h2>

        <div className="product-management-section">
          <div className="search-section">
            <input
              type="text"
              placeholder="ID de producto"
              value={productId}
              onChange={(e) => {
                const id = e.target.value;
                setProductId(id);
                setShowConfirmButtons(false);
                setIsEditable(false);
                setProductData({
                  producto: '',
                  descripcion: '',
                  precio: '',
                  procesador: '',
                  ram: '',
                  almacenamiento: '',
                  grafica: '',
                  imagenUrl: ''
                });
                setIsIdSearched(false);
              }}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              🔍
            </button>
          </div>

          <div className="action-buttons">
            <button
              className="action-button"
              onClick={handleCreate}
              disabled={isIdSearched}
            >
              Crear
            </button>
            <button
              className="action-button"
              onClick={handleEdit}
              disabled={!isIdSearched}
            >
              Editar
            </button>
            <button
              className="action-button"
              onClick={handleDelete}
              disabled={!isIdSearched}
            >
              Eliminar
            </button>
          </div>

          <div className="product-details-columns">
            {/* Primera columna */}
            <div className="product-column">
              <div className="product-field">
                <label>Producto:</label>
                <input
                  type="text"
                  value={productData.producto}
                  onChange={(e) => setProductData({ ...productData, producto: e.target.value })}
                  readOnly={!isEditable}
                  className="product-input"
                />
              </div>
              <div className="product-field">
                <label>Procesador:</label>
                <input
                  type="text"
                  value={productData.procesador}
                  onChange={(e) => setProductData({ ...productData, procesador: e.target.value })}
                  readOnly={!isEditable}
                  className="product-input"
                />
              </div>
              <div className="product-field">
                <label>Gráfica:</label>
                <input
                  type="text"
                  value={productData.grafica}
                  onChange={(e) => setProductData({ ...productData, grafica: e.target.value })}
                  readOnly={!isEditable}
                  className="product-input"
                />
              </div>
            </div>

            {/* Segunda columna con campos ajustados */}
            <div className="product-column">
              <div className="product-field small">
                <label>Precio:</label>
                <input
                  type="text"
                  value={productData.precio}
                  onChange={(e) => setProductData({ ...productData, precio: e.target.value })}
                  readOnly={!isEditable}
                  className="product-input-small"  // Tamaño reducido
                />
              </div>
              <div className="product-field small">
                <label>RAM:</label>
                <input
                  type="text"
                  value={productData.ram}
                  onChange={(e) => setProductData({ ...productData, ram: e.target.value })}
                  readOnly={!isEditable}
                  className="product-input-small"  // Tamaño reducido
                />
              </div>
              <div className="product-field small">
                <label>Almacenamiento:</label>
                <input
                  type="text"
                  value={productData.almacenamiento}
                  onChange={(e) => setProductData({ ...productData, almacenamiento: e.target.value })}
                  readOnly={!isEditable}
                  className="product-input-small"  // Tamaño reducido
                />
              </div>
            </div>

            {/* Tercera columna */}
            <div className="product-column">
              <div className="product-field">
                <label>Imagen URL:</label>
                <input
                  type="text"
                  value={productData.imagenUrl}
                  onChange={(e) => setProductData({ ...productData, imagenUrl: e.target.value })}
                  readOnly={!isEditable}
                  className="product-input"
                />
              </div>
              <div className="product-field">
                <label>Descripción:</label>
                <textarea
                  value={productData.descripcion}
                  onChange={(e) => setProductData({ ...productData, descripcion: e.target.value })}
                  readOnly={!isEditable}
                  className="description-input"
                />
              </div>
            </div>
          </div>

          {showConfirmButtons && (
            <div className="confirm-buttons">
              <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
              <button className="confirm-button" onClick={handleConfirm}>Confirmar</button>
            </div>
          )}

          {showConfirmationModal && (
            <div className="confirmation-modal">
              <p>{confirmationMessage}</p>
              <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
              <button className="confirm-button" onClick={finalConfirm}>Confirmar</button>
            </div>
          )}
        </div>

        <h2>Todos los Productos</h2>
        <div className="product-table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Procesador</th>
                <th>RAM</th>
                <th>Almacenamiento</th>
                <th>Gráfica</th>
                <th>Imagen</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.producto}</td>
                  <td>{product.descripcion}</td>
                  <td>{product.precio}</td>
                  <td>{product.procesador}</td>
                  <td>{product.ram}</td>
                  <td>{product.almacenamiento}</td>
                  <td>{product.grafica}</td>
                  <td>{product.imagenUrl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;

