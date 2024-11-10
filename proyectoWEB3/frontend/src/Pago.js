// Pago.js
import React, { useState } from 'react';
import './Pago.css';

// Función para formatear moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

const Pago = ({ onClose, totalAmount, user, cartItems, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState("Confirmar pago");
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentMethodClick = (method) => {
    if (!formData.address.trim() || formData.phone.length !== 10) {
      alert("Por favor, completa todos los campos correctamente.");
    } else {
      setSelectedPaymentMethod(method);
      setConfirmationText(method === 'contraentrega' ? "Confirmar envío" : "Confirmar pago");
      setShowConfirmation(true);
    }
  };

  const handleConfirmPayment = async () => {
    const compraData = {
      id_usuario: user.id,
      tipo_pago: selectedPaymentMethod,
      productos: cartItems.map(item => ({
        id: item.id,
        cantidad: item.quantity,
      })),
      total: totalAmount,
      direccion: formData.address,
      telefono: formData.phone
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/crear_compra/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraData),
      });

      const result = await response.json();
      console.log(result); // Para verificar la respuesta en la consola
      if (result.status === 'success') {
        setShowThankYouMessage(true); // Cambia el estado para mostrar el mensaje
        onPaymentSuccess(); // Vaciar el carrito
      } else {
        alert('Error al procesar la compra');
      }
    } catch (error) {
      console.error('Error al crear la compra:', error);
      alert('Error al procesar la compra');
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="pago-overlay">
      <div className="pago-modal">
        {showThankYouMessage ? (
          <div className="thank-you-message">
            <h2>GRACIAS por tu compra</h2>
            <p>Pronto nos pondremos en contacto contigo para confirmar el pago</p>
            <button type="button" className="close-button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : showConfirmation ? (
          <div className="confirmation-modal">
            <h2>{confirmationText}</h2>
            <p>¿Estás seguro de que deseas proceder?</p>
            <p className="total-amount">Total a pagar: {formatCurrency(totalAmount)}</p>
            <div className="button-container">
              <button type="button" className="back-button" onClick={handleCloseConfirmation}>
                Volver
              </button>
              <button type="button" className="pay-button" onClick={handleConfirmPayment}>
                Confirmar
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2>Métodos de Pago</h2>
            <label className="address-label">
              Dirección de envío
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ingresa la dirección de envío"
                required
              />
            </label>
            <label className="phone-label">
              Número de Teléfono
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Número de 10 dígitos"
                maxLength="10"
                required
              />
            </label>
            <p>Selecciona tu método de pago preferido:</p>
            <div className="payment-options">
              <button
                className="payment-button"
                onClick={() => handlePaymentMethodClick('transferencia')}
                disabled={!formData.address.trim() || formData.phone.length !== 10}
              >
                Pago Electrónico
              </button>
              <button
                className="payment-button"
                onClick={() => handlePaymentMethodClick('contraentrega')}
                disabled={!formData.address.trim() || formData.phone.length !== 10}
              >
                Pago Contraentrega
              </button>
            </div>
            <button className="close-button" onClick={onClose}>Cerrar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Pago;
