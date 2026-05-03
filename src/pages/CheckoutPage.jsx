import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { placeOrder } from '../api';
import Header from '../components/Header';
import '../styles/CheckoutPage.css';

const MIN_ORDER = 200;
const DELIVERY_CHARGE = 30;

const formatQty = (qty, unit) => {
  if (unit === 'kg') {
    if (qty < 1) return `${Math.round(qty * 1000)} g`;
    return `${qty.toFixed(qty % 1 === 0 ? 0 : 1)} kg`;
  }
  if (unit === 'piece') return qty === 1 ? '1 pc' : `${qty} pcs`;
  if (unit === 'bundle') return qty === 1 ? '1 bundle' : `${qty} bundles`;
  return `${qty} ${unit}`;
};

const CheckoutPage = () => {
  const { customer, cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useApp();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  if (!customer) {
    navigate('/');
    return null;
  }

  if (cart.length === 0) {
    return (
      <div>
        <Header />
        <div className="empty-cart">
          <h2>Your cart is empty 🛒</h2>
          <p>Add some fresh vegetables to your cart!</p>
          <button onClick={() => navigate('/shop')} className="back-btn">
            ← Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = cartTotal + DELIVERY_CHARGE;
  const canPlaceOrder = cartTotal >= MIN_ORDER;
  const amountNeeded = MIN_ORDER - cartTotal;

  const handleQtyChange = (item, delta) => {
    const step = item.unit === 'kg' ? 0.1 : 1;
    const newQty = parseFloat((item.quantity + delta * step).toFixed(2));
    updateQuantity(item._id, newQty);
  };

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) {
      setError(`Add ₹${amountNeeded.toFixed(2)} more to reach minimum order of ₹${MIN_ORDER}`);
      return;
    }

    setPlacing(true);
    setError('');

    try {
      const orderData = {
        customer: {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          pincode: customer.pincode,
          landmark: customer.landmark,
        },
        items: cart.map((item) => ({
          productName: item.name,
          quantity: item.quantity,
          unit: item.unit,
          pricePerUnit: item.pricePerUnit,
          subtotal: parseFloat((item.pricePerUnit * item.quantity).toFixed(2)),
        })),
        customerEmail: customerEmail || null,
        notes,
      };

      const response = await placeOrder(orderData);
      
      sessionStorage.setItem('lastOrder', JSON.stringify({
        orderId: response.orderId,
        totalAmount: response.totalAmount,
        customer,
        items: cart,
      }));

      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Try again.');
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <Header />
      
      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          <div className="checkout-left">
            <div className="section">
              <h2>📍 Delivery Address</h2>
              <div className="address-box">
                <p><strong>{customer.name}</strong></p>
                <p>📱 {customer.phone}</p>
                <p>{customer.address}</p>
                {customer.landmark && <p>Near: {customer.landmark}</p>}
                <p>Pincode: {customer.pincode}</p>
              </div>
              <button className="change-btn" onClick={() => navigate('/')}>
                Change Address
              </button>
            </div>

            <div className="section">
              <h2>🛒 Order Items ({cart.length})</h2>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item._id} className="cart-item">
                    <img src={item.imageUrl} alt={item.name}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/60/4caf50/ffffff?text=V'; }}
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>₹{item.pricePerUnit}/{item.unit}</p>
                      <div className="item-qty-controls">
                        <button onClick={() => handleQtyChange(item, -1)}>−</button>
                        <span>{formatQty(item.quantity, item.unit)}</span>
                        <button onClick={() => handleQtyChange(item, 1)}>+</button>
                      </div>
                    </div>
                    <div className="item-price">
                      <p>₹{(item.pricePerUnit * item.quantity).toFixed(2)}</p>
                      <button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h2>📝 Special Instructions (Optional)</h2>
              <textarea
                placeholder="Any specific requests? E.g., Need fresh ones, deliver after 5 PM..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
              />
            </div>

            <div className="section">
              <h2>📧 Email for confirmation (Optional)</h2>
              <input
                type="email"
                placeholder="your@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
              <small>We'll send order confirmation if you provide email</small>
            </div>
          </div>

          <div className="checkout-right">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Items Total ({cart.length})</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charge</span>
                <span>₹{DELIVERY_CHARGE.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>

              {!canPlaceOrder && (
                <div className="warning">
                  ⚠️ Add ₹{amountNeeded.toFixed(2)} more for minimum order ₹{MIN_ORDER}
                </div>
              )}

              <div className="payment-section">
                <h3>💵 Payment Method</h3>
                <div className="payment-option selected">
                  <input type="radio" checked readOnly />
                  <label>Cash on Delivery (COD)</label>
                </div>
              </div>

              {error && <div className="error-msg">{error}</div>}

              <button
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder || placing}
              >
                {placing ? 'Placing Order...' : `Place Order - ₹${totalAmount.toFixed(2)}`}
              </button>

              <p className="trust-note">
                ✅ Pay cash when your order is delivered
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;