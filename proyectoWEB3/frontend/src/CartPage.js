// CartPage.js
import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';
import Pago from './Pago';

const CartPage = ({ user, onLoginClick, onLogoutClick }) => {
  const { cartItems, removeFromCart, getTotalCost, updateQuantity, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [showPago, setShowPago] = useState(false);

  const handlePaymentClick = () => {
    setShowPago(true); // Abre la ventana de pago
  };

  const closePago = () => {
    setShowPago(false); // Cierra la ventana de pago
  };

  const onPaymentSuccess = () => {
    clearCart(); // Vaciar el carrito tras un pago exitoso
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="logo-button" onClick={() => navigate('/')}>
          <img src="/BYT.jpg" alt="Logo" className="navbar-logo" />
          <span className="navbar-title">BUILD-YOUR-TECH</span>
        </button>
        <h2>Carrito de Compras</h2>
        <button className="back-button" onClick={() => navigate('/sales')}>X</button>
      </div>
      <div className="cart-container">
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">No hay productos en el carrito.</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-left">
                    <img src={item.img} alt={item.description} className="cart-item-img" />
                    <div className="cart-item-details">
                      <p className="cart-item-description">{item.description}</p>
                      <p className="cart-item-price">{formatCurrency(parseFloat(item.price.replace('$', '')) || 0)}</p>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-button" onClick={() => removeFromCart(index)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3>Total: {formatCurrency(getTotalCost())}</h3>
              <button className="payment-button" onClick={handlePaymentClick}>Pagar</button>
            </div>
          </>
        )}
      </div>
      {showPago && (
        <Pago
          onClose={closePago}
          totalAmount={getTotalCost()}
          user={user}  // Aquí usamos el ID de usuario extraído de `user`
          cartItems={cartItems} // Pasa los artículos del carrito
          onPaymentSuccess={onPaymentSuccess} // Vaciar el carrito tras pago exitoso
        />
      )}
    </div>
  );
};

export default CartPage;

