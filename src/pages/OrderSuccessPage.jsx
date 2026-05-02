import { useNavigate } from 'react-router-dom';
import '../styles/OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const lastOrder = JSON.parse(sessionStorage.getItem('lastOrder') || '{}');

  if (!lastOrder.orderId) {
    navigate('/');
    return null;
  }

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p className="success-msg">Thank you for ordering from Madhu Vegetables</p>

        <div className="order-details">
          <div className="detail-row">
            <span>Order ID:</span>
            <strong>{lastOrder.orderId}</strong>
          </div>
          <div className="detail-row">
            <span>Total Amount:</span>
            <strong>₹{lastOrder.totalAmount}</strong>
          </div>
          <div className="detail-row">
            <span>Payment:</span>
            <strong>Cash on Delivery</strong>
          </div>
        </div>

        <div className="info-message">
          <h3>📞 What's Next?</h3>
          <p>We'll call you on <strong>{lastOrder.customer?.phone}</strong> to confirm your order shortly.</p>
          <p>Your fresh vegetables will be delivered the same day or next day.</p>
        </div>

        <div className="contact-info">
          <p>Need help? Call us:</p>
          <a href="tel:9976988285" className="phone-link">📱 9976988285</a>
        </div>

        <button onClick={() => { sessionStorage.removeItem('lastOrder'); navigate('/shop'); }} className="continue-btn">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;