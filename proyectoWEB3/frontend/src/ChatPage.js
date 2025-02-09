//CHATPAGE.JS
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIA } from './IAContext';
import { CartContext } from './CartContext';
import './ChatPage.css';

const ChatPage = ({ user, onLoginClick, onLogoutClick }) => {
  const { updateResponses } = useIA();
  const { addToCart, getTotalItems } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [showAdvancedQuestions, setShowAdvancedQuestions] = useState(false);
  const [productosRecomendados, setProductosRecomendados] = useState([]);
  const [formData, setFormData] = useState({
    userType: '',
    careerOrProfession: '',
    pcType: '',
    gamesOrActivities: '',
    advancedFeatures: '',
    osPreference: [],
    brandPreference: [],
    memory: [],
    storage: [],
    budget:  0,
  });
  const [recommendation, setRecommendation] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showResultsButton, setShowResultsButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0); // Estado para controlar el índice del producto mostrado
  const navigate = useNavigate();

  // Verificación de autenticación
  useEffect(() => {
    console.log('Usuario actual en ChatPage:', user);
    if (!user) {
      navigate('/'); // Redirige a la página de inicio si el usuario no está autenticado
    }
  }, [user, navigate]);

 // Obtener recomendaciones
 const fetchRecomendaciones = useCallback(async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/obtener-recomendaciones-detalles/${user.id}/`);
    const data = await response.json();
    setProductosRecomendados(data);
    setShowResults(true); // Mostrar los resultados
    setShowResultsButton(false); // Ocultar el botón después de mostrar los resultados
  } catch (error) {
    console.error("Error al obtener recomendaciones:", error);
  }
}, [user]);


  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const isAdmin = user && user.role === 'ADMIN'; // Verifica si el rol es 'Admin'

  const handleLogout = () => {
    onLogoutClick();
    navigate('/');
  };

  // Maneja el cambio de valores del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "budget") {
      // Permite solo números en el campo de presupuesto
      const numericValue = value.replace(/\D/g, ""); // Elimina cualquier carácter que no sea número
      setFormData({ ...formData, [name]: numericValue });
    } else if (type === 'checkbox') {
      const updatedFeatures = checked
        ? [...formData[name], value]
        : formData[name].filter(feature => feature !== value);
      setFormData({ ...formData, [name]: updatedFeatures });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  // Validar cada paso para asegurarse de que el campo no esté vacío
  const validateStep = () => {
    if (step === 0 && !formData.userType) {
        setErrorMessage('Por favor selecciona tu perfil.');
        return false;
    }
    if (step === 1 && !formData.careerOrProfession && formData.userType !== 'Gamer' && formData.userType !== 'Uso Doméstico') {
        setErrorMessage('Por favor selecciona tu carrera o profesión.');
        return false;
    }
    if (step === 2 && !formData.pcType) {
        setErrorMessage('Por favor selecciona el tipo de computador.');
        return false;
    }
    if (step === 3 && !formData.advancedFeatures) {
        setErrorMessage('Por favor selecciona si deseas acceder a características avanzadas.');
        return false;
    }
    if (step === 4 && showAdvancedQuestions && !formData.memory.length) {
        setErrorMessage('Por favor selecciona al menos una opción de memoria RAM.');
        return false;
    }
    if (step === 5 && showAdvancedQuestions && !formData.storage.length) {
        setErrorMessage('Por favor selecciona al menos una opción de almacenamiento.');
        return false;
    }
    if (step === 6 && showAdvancedQuestions && !formData.osPreference.length) {
        setErrorMessage('Por favor selecciona al menos una opción de sistema operativo.');
        return false;
    }
    if (step === 7 && showAdvancedQuestions && !formData.brandPreference.length) {
        setErrorMessage('Por favor selecciona al menos una opción de marca.');
        return false;
    }
    if (step === 8 && (!formData.budget || isNaN(formData.budget) || Number(formData.budget) <= 0)) {
        setErrorMessage('Por favor ingresa un presupuesto válido.');
        return false;
    }
    // Si todas las validaciones pasan, elimina cualquier mensaje de error
    setErrorMessage('');
    return true;
};


  // Manejador para avanzar en el formulario y enviar la recomendación
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) {
        return;
    }

    if (!user) {
        setRecommendation("Por favor inicia sesión antes de enviar el formulario.");
        return;
    }

    if (step === 3 && formData.advancedFeatures === 'No') {
        setStep(8);
    } else if (step < 8) {
        setStep(step + 1);
    } else {
        // Mostrar el mensaje de "Procesando..." y activar el cargador
        setRecommendation("Procesando los resultados del formulario, por favor espere un momento...");
        setLoading(true);  // Activa el símbolo de carga

        updateResponses('userType', formData.userType);
        updateResponses('careerOrProfession', formData.careerOrProfession);
        updateResponses('pcType', formData.pcType);
        updateResponses('gamesOrActivities', formData.gamesOrActivities);
        updateResponses('advancedFeatures', formData.advancedFeatures);
        updateResponses('osPreference', formData.osPreference);
        updateResponses('brandPreference', formData.brandPreference);
        updateResponses('memory', formData.memory);
        updateResponses('storage', formData.storage);
        updateResponses('budget', formData.budget);

        const responseData = {
            userType: formData.userType,
            careerOrProfession: formData.careerOrProfession,
            pcType: formData.pcType,
            advancedFeatures: formData.advancedFeatures,
            osPreference: formData.osPreference,
            brandPreference: formData.brandPreference,
            memory: formData.memory,
            storage: formData.storage,
            budget: formData.budget,
            user_id: user ? user.id : null
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/save-form/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responseData),
            });

            const data = await response.json();
            if (data.success) {
                await fetch(`http://127.0.0.1:8000/api/recomendaciones/${user.id}/`);
                setRecommendation("Tus datos han sido guardados correctamente en la base de datos.");
                setShowResultsButton(true); // Muestra el botón de "Mostrar Resultados"
            } else {
                setRecommendation("Hubo un error al guardar tus datos. Por favor, intenta nuevamente.");
            }
        } catch (error) {
            console.error('Error:', error);
            setRecommendation("Error al conectar con el servidor. Por favor, intenta nuevamente.");
        } finally {
            setLoading(false);  // Desactiva el símbolo de carga al finalizar
        }
    }
};




  
  const handleBack = () => {
    if (step === 8 && formData.advancedFeatures === 'No') {
      setStep(3);
    } else {
      const resetForm = {
        userType: step === 0 ? '' : formData.userType,
        careerOrProfession: step === 1 ? '' : formData.careerOrProfession,
        pcType: step === 2 ? '' : formData.pcType,
        gamesOrActivities: step === 1 && (formData.userType === 'Gamer' || formData.userType === 'Uso Doméstico') ? '' : formData.gamesOrActivities,
        advancedFeatures: step === 3 ? '' : formData.advancedFeatures,
        memory: step === 4 ? [] : formData.memory,
        storage: step === 5 ? [] : formData.storage,
        osPreference: step === 6 ? [] : formData.osPreference,
        brandPreference: step === 7 ? [] : formData.brandPreference,
        budget: step === 8 ? '' : formData.budget
      };
      setFormData(resetForm);
      setStep(step - 1);
    }
  };


  // Funciones para cambiar de producto
  const handleNextProduct = () => {
    setCurrentProductIndex((prevIndex) =>
      prevIndex < productosRecomendados.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePreviousProduct = () => {
    setCurrentProductIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : productosRecomendados.length - 1
    );
  };

  // Pasos del formulario según la selección
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <label>¿Cuál de las siguientes opciones describe mejor tu perfil?</label>
            <select name="userType" value={formData.userType} onChange={handleInputChange}>
              <option value="">Selecciona tu perfil</option>
              <option value="Estudiante">Estudiante</option>
              <option value="Profesional">Profesional</option>
              <option value="Gamer">Gamer</option>
              <option value="Uso Doméstico">Uso Doméstico</option>
            </select>
          </>
        );
      case 1:
        if (formData.userType === 'Estudiante') {
          return (
            <>
              <label>¿En qué carrera estás estudiando?</label>
              <select name="careerOrProfession" value={formData.careerOrProfession} onChange={handleInputChange}>
                <option value="">Selecciona tu carrera</option>
                <option value="Ingeniería">Ingeniería</option>
                <option value="Diseño Gráfico">Diseño Gráfico</option>
                <option value="Ciencias de la Computación">Ciencias de la Computación</option>
                <option value="Medicina">Medicina</option>
                <option value="Derecho">Derecho</option>
                <option value="Arquitectura">Arquitectura</option>
                <option value="Economía">Economía</option>
                <option value="Psicología">Psicología</option>
                <option value="Educación">Educación</option>
                <option value="Comunicación Social">Comunicación Social</option>
                <option value="Filosofía">Filosofía</option>
                <option value="Química">Química</option>
                <option value="Biología">Biología</option>
              </select>
            </>
          );
        } else if (formData.userType === 'Profesional') {
          return (
            <>
              <label>¿Cuál es tu profesión o campo laboral?</label>
              <select name="careerOrProfession" value={formData.careerOrProfession} onChange={handleInputChange}>
                <option value="">Selecciona tu profesión</option>
                <option value="Diseñador Gráfico">Diseñador Gráfico</option>
                <option value="Ingeniero">Ingeniero</option>
                <option value="Programador">Programador/Desarrollador</option>
                <option value="Médico">Médico</option>
                <option value="Arquitecto">Arquitecto</option>
                <option value="Abogado">Abogado</option>
                <option value="Contador">Contador</option>
                <option value="Fotógrafo">Fotógrafo</option>
                <option value="Editor de Video">Editor de Video</option>
                <option value="Docente">Docente</option>
                <option value="Psicólogo">Psicólogo</option>
                <option value="Investigador">Investigador</option>
                <option value="Científico">Científico</option>
              </select>
            </>
          );
        } else if (formData.userType === 'Gamer') {
          return (
            <>
              <label>¿Qué tipo de juegos sueles jugar?</label>
              <select name="gamesOrActivities" value={formData.gamesOrActivities} onChange={handleInputChange}>
                <option value="">Selecciona tu tipo de juegos</option>
                <option value="Casuales">Juegos casuales</option>
                <option value="Competitivos">Juegos competitivos en línea</option>
                <option value="AAA">Juegos AAA</option>
              </select>
            </>
          );
        } else {
          return (
            <>
              <label>¿Para qué actividades principales usarás el computador?</label>
              <select name="gamesOrActivities" value={formData.gamesOrActivities} onChange={handleInputChange}>
                <option value="">Selecciona tu uso principal</option>
                <option value="Navegar">Navegar por Internet</option>
                <option value="Streaming">Streaming de videos y música</option>
                <option value="Edición Básica">Edición básica de fotos y videos</option>
              </select>
            </>
          );
        }
      case 2:
        return (
          <>
            <label>¿Prefieres un computador portátil o de escritorio?</label>
            <select name="pcType" value={formData.pcType} onChange={handleInputChange}>
              <option value="">Selecciona el tipo de PC</option>
              <option value="Portátil">Portátil</option>
              <option value="Escritorio">De escritorio</option>
              <option value="Indiferente">Indiferente</option>
            </select>
          </>
        );
      case 3:
        return (
          <>
            <label>¿Quieres acceder a características avanzadas?</label>
            <select name="advancedFeatures" value={formData.advancedFeatures} onChange={(e) => {
              handleInputChange(e);
              setShowAdvancedQuestions(e.target.value === 'Sí');
            }}>
              <option value="">Selecciona una opción</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </>
        );
      case 4:
        if (showAdvancedQuestions) {
          return (
            <>
              <label>Memoria RAM</label>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="memory"
                    value="8GB"
                    checked={formData.memory.includes("8GB")}
                    onChange={handleInputChange}
                  />
                  8 GB
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="memory"
                    value="16GB"
                    checked={formData.memory.includes("16GB")}
                    onChange={handleInputChange}
                  />
                  16 GB
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="memory"
                    value="32GB"
                    checked={formData.memory.includes("32GB")}
                    onChange={handleInputChange}
                  />
                  32 GB
                </label>
              </div>
            </>
          );
        }
        break;
      case 5:
        if (showAdvancedQuestions) {
          return (
            <>
              <label>Almacenamiento</label>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="storage"
                    value="256GB"
                    checked={formData.storage.includes("256GB")}
                    onChange={handleInputChange}
                  />
                  256 GB SSD
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="storage"
                    value="512GB"
                    checked={formData.storage.includes("512GB")}
                    onChange={handleInputChange}
                  />
                  512 GB SSD
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="storage"
                    value="1TB"
                    checked={formData.storage.includes("1TB")}
                    onChange={handleInputChange}
                  />
                  1 TB SSD
                </label>
              </div>
            </>
          );
        }
        break;
      case 6:
        if (showAdvancedQuestions) {
          return (
            <>
              <label>Sistema Operativo</label>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="osPreference"
                    value="Windows"
                    checked={formData.osPreference.includes("Windows")}
                    onChange={handleInputChange}
                  />
                  Windows
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="osPreference"
                    value="MacOS"
                    checked={formData.osPreference.includes("MacOS")}
                    onChange={handleInputChange}
                  />
                  MacOS
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="osPreference"
                    value="Linux"
                    checked={formData.osPreference.includes("Linux")}
                    onChange={handleInputChange}
                  />
                  Linux
                </label>
              </div>
            </>
          );
        }
        break;
      case 7:
        if (showAdvancedQuestions) {
          return (
            <>
              <label>Marca</label>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="brandPreference"
                    value="HP"
                    checked={formData.brandPreference.includes("HP")}
                    onChange={handleInputChange}
                  />
                  HP
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="brandPreference"
                    value="Dell"
                    checked={formData.brandPreference.includes("Dell")}
                    onChange={handleInputChange}
                  />
                  Dell
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="brandPreference"
                    value="Apple"
                    checked={formData.brandPreference.includes("Apple")}
                    onChange={handleInputChange}
                  />
                  Apple
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="brandPreference"
                    value="Lenovo"
                    checked={formData.brandPreference.includes("Lenovo")}
                    onChange={handleInputChange}
                  />
                  Lenovo
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="brandPreference"
                    value="Asus"
                    checked={formData.brandPreference.includes("Asus")}
                    onChange={handleInputChange}
                  />
                  Asus
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="brandPreference"
                    value="Acer"
                    checked={formData.brandPreference.includes("Acer")}
                    onChange={handleInputChange}
                  />
                  Acer
                </label>
              </div>
            </>
          );
        }
        break;
      case 8:
        return (
          <>
            <label>¿Cuál es tu presupuesto máximo para el computador?</label>
            <input
  type="text"  // Cambia de "number" a "text"
  name="budget"
  value={formData.budget}
  onChange={handleInputChange}
  placeholder="Ingresa tu presupuesto"
  className="budget-input"
/>

          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button className="logo-button" onClick={() => navigate('/')}>
          <img src="/BYT.jpg" alt="Logo" className="navbar-logo" />
          <span className="navbar-title">BUILD-YOUR-TECH</span>
        </button>
        <h2>Formulario de asesoría</h2>
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
                  <button className="dropdown-item" onClick={handleLogout}>
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


          <button className="back-button" onClick={() => navigate('/sales')}>
            X
          </button>
        </div>
      </div>

      <div className="form-container">
    <form onSubmit={handleSubmit}>
        {renderStep()}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="button-container">
            {step > 0 && (
                <button
                    type="button"
                    className="back-step-button"
                    onClick={handleBack}
                >
                    Atrás
                </button>
            )}
            <button type="submit" className="next-step-button">
                {step < 8 ? 'Siguiente' : 'Finalizar'}
            </button>
        </div>
    </form>

    {/* Mostrar el mensaje de recomendación de la IA */}
    {recommendation && (
        <div className="recommendation-box">
            <h3>Recomendación de la IA:</h3>
            <p>{recommendation}</p>
        </div>
    )}

    {/* Mostrar el símbolo de carga debajo del mensaje de recomendación */}
    {loading && (
        <div className="spinner">
            <div className="double-spinner"></div>
        </div>
    )}

    {showResultsButton && (
        <button className="show-results-button" onClick={fetchRecomendaciones}>
            Mostrar Resultados
        </button>
    )}
</div>




      {showResults && productosRecomendados.length > 0 && (
        <div className="results-section">
          <h2>Productos Recomendados</h2>
          <div className="products-container">
            <button onClick={handlePreviousProduct} className="nav-button">⬅</button>
            <div className="product-card">
              <img src={productosRecomendados[currentProductIndex].imagen} alt={productosRecomendados[currentProductIndex].nombre} className="product-img" />
              <div className="product-info">
                <h3>{productosRecomendados[currentProductIndex].nombre}</h3>
                <p>{productosRecomendados[currentProductIndex].descripcion}</p>
                <p><strong>Precio:</strong> ${productosRecomendados[currentProductIndex].precio}</p>
                <p><strong>Puntuación:</strong> {productosRecomendados[currentProductIndex].puntuacion}</p>
                <p><strong>Razones:</strong> {productosRecomendados[currentProductIndex].razones}</p>
                {productosRecomendados[currentProductIndex].info_producto && (
                  <div className="product-details">
                    <p><strong>Procesador:</strong> {productosRecomendados[currentProductIndex].info_producto.procesador}</p>
                    <p><strong>RAM:</strong> {productosRecomendados[currentProductIndex].info_producto.ram}</p>
                    <p><strong>Almacenamiento:</strong> {productosRecomendados[currentProductIndex].info_producto.almacenamiento}</p>
                    <p><strong>Gráfica:</strong> {productosRecomendados[currentProductIndex].info_producto.grafica}</p>
                  </div>
                )}
              <button className="add-to-cart" onClick={() => {
                const productoActual = productosRecomendados[currentProductIndex];
                
                // Usa el ID numérico si está disponible
                const productoId = productoActual.id || productoActual.producto_id || currentProductIndex;

                addToCart({
                  id: productoId,  // Asegúrate de que sea un número o un valor que cumpla con los requisitos del backend
                  description: productoActual?.nombre || 'Producto sin nombre',
                  img: productoActual?.imagen || 'url_de_imagen_por_defecto.jpg',
                  price: productoActual?.precio || '0',
                  quantity: 1,  // Cantidad inicial
                });
              }}>
                Agregar al carrito
              </button>
              </div>
            </div>
            <button onClick={handleNextProduct} className="nav-button">➡</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
