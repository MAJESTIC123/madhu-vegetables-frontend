import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import {placeOrder} from '../api';
import '../styles/CheckoutPage.css';

const MIN_ORDER = 200;
const DELIVERY_CHARGE = 30;

function CheckoutPage() {
  const navigate = useNavigate();
  const { customer, cart, updateCartItem, removeFromCart, clearCart } = useApp();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  // Redirect if no customer or empty cart
  if (!customer.name) {
    navigate('/');
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <Header />
        <div className="empty-cart-container">
          <h2>🛒 உங்கள் கார்ட் காலியாக உள்ளது</h2>
          <h3>Your cart is empty</h3>
          <button onClick={() => navigate('/shop')} className="back-to-shop-btn">
            ← Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge;
  const meetsMinimum = subtotal >= MIN_ORDER;

  const handleQuantityChange = (productId, newQuantity, unitType) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, newQuantity);
    }
  };

  const handlePlaceOrder = async () => {
    if (!meetsMinimum) {
      setError(`Minimum order is ₹${MIN_ORDER}. Please add more items.`);
      return;
    }

    setPlacing(true);
    setError('');

    try {
      const response = await placeOrder({
        customer: {
          name: customer.name,
          mobile: customer.mobile,
          pincode: customer.pincode,
          address: customer.address,
          landmark: customer.landmark || ''
        },
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unitType: item.unitType
        })),
        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        totalAmount: total,
        paymentMethod: 'COD'
      });

      // Pass order data to success page BEFORE clearing cart
      navigate('/order-success', { 
        state: { 
          orderId: response.orderId,
          orderData: {
            items: cart,
            subtotal: subtotal,
            deliveryCharge: deliveryCharge,
            total: total
          }
        } 
      });

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Try again.');
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <Header />
      
      <div className="checkout-container">
        <h1 className="checkout-title">🛒 Checkout</h1>

        {/* Customer Details Card */}
        <div className="checkout-section">
          <h2 className="section-title">📍 Delivery To</h2>
          <div className="customer-card">
            <p><strong>{customer.name}</strong></p>
            <p>📞 {customer.mobile}</p>
            <p>{customer.address}</p>
            {customer.landmark && <p>Landmark: {customer.landmark}</p>}
            <p>Pincode: {customer.pincode}</p>
            <button onClick={() => navigate('/')} className="edit-details-btn">
              ✏️ Edit Details
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="checkout-section">
          <h2 className="section-title">🥬 Your Items ({cart.length})</h2>
          <div className="cart-items-list">
            {cart.map(item => {
              const unit = item.unitType === 'kg' ? 'kg' : item.unitType === 'piece' ? 'pcs' : 'bundle';
              const step = item.unitType === 'kg' ? 0.1 : 1;
              
              return (
                <div key={item._id} className="cart-item-row">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-price">₹{item.price}/{unit}</p>
                  </div>
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleQuantityChange(item._id, +(item.quantity - step).toFixed(1), item.unitType)}
                        className="qty-btn"
                      >
                        −
                      </button>
                      <span className="qty-value">
                        {item.quantity} {unit}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(item._id, +(item.quantity + step).toFixed(1), item.unitType)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                    <p className="item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(item._id)} 
                      className="remove-btn"
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="checkout-section">
          <h2 className="section-title">💰 Bill Summary</h2>
          <div className="bill-summary">
            <div className="bill-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="bill-row">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="bill-row total-row">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {!meetsMinimum && (
            <div className="min-order-warning">
              ⚠️ Minimum order is ₹{MIN_ORDER}. Add ₹{(MIN_ORDER - subtotal).toFixed(2)} more.
            </div>
          )}

          <div className="payment-info">
            <p>💵 <strong>Payment Method:</strong> Cash on Delivery (COD)</p>
            <p className="payment-note">Pay when your order is delivered</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <button 
          onClick={handlePlaceOrder} 
          disabled={placing || !meetsMinimum}
          className="place-order-btn"
        >
          {placing ? '⏳ Placing Order...' : `✅ Place Order - ₹${total.toFixed(2)}`}
        </button>

        <button onClick={() => navigate('/shop')} className="continue-shopping-btn">
          ← Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;