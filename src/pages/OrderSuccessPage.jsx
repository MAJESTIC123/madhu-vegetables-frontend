import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/OrderSuccessPage.css';

function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { customer, clearCart, clearCustomer } = useApp();
  
  const orderData = location.state?.orderData;
  const orderId = location.state?.orderId;

  useEffect(() => {
    // Only clear cart if order was successful
    if (orderData && orderId) {
      clearCart();
    }
  }, []);

  // Show fallback if no order data (instead of redirecting)
  if (!orderData || !orderId) {
    return (
      <div className="order-success-page">
        <div className="success-container">
          <div className="success-icon" style={{opacity: 0.5}}>
            <svg viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" fill="#9ca3af" />
              <path d="M40 25 L40 45" stroke="white" strokeWidth="5" strokeLinecap="round" />
              <circle cx="40" cy="55" r="3" fill="white" />
            </svg>
          </div>
          <h1 className="success-title">Order Information Not Found</h1>
          <p style={{color: '#6b7280', marginBottom: '20px'}}>
            It looks like you came here directly. Please place a new order.
          </p>
          <button onClick={() => navigate('/')} className="new-order-btn">
            🏠 Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Generate WhatsApp message with order details (Tamil + English)
  const generateWhatsAppMessage = () => {
    const itemsList = orderData.items.map((item, idx) => {
      const unit = item.unitType === 'kg' ? 'kg' : item.unitType === 'piece' ? 'pcs' : 'bundle';
      return `${idx + 1}. ${item.name} - ${item.quantity} ${unit} × ₹${item.price} = ₹${(item.quantity * item.price).toFixed(2)}`;
    }).join('\n');

    const message = `🥬 *MADHU VEGETABLES - புதிய ஆர்டர்/NEW ORDER* 🥬

📋 *Order ID:* ${orderId}

👤 *வாடிக்கையாளர் விவரங்கள்/Customer Details:*
பெயர்/Name: ${customer.name}
மொபைல்/Mobile: ${customer.mobile}

📍 *டெலிவரி முகவரி/Delivery Address:*
${customer.address}
${customer.landmark ? `Landmark: ${customer.landmark}\n` : ''}Pincode: ${customer.pincode}

🛒 *ஆர்டர் விவரங்கள்/Order Items:*
${itemsList}

💰 *Bill Summary:*
Subtotal: ₹${orderData.subtotal.toFixed(2)}
Delivery Charge: ₹${orderData.deliveryCharge.toFixed(2)}
*மொத்தம்/Total: ₹${orderData.total.toFixed(2)}*

💵 *Payment:* Cash on Delivery (COD)

🙏 நன்றி! உங்கள் ஆர்டரை விரைவில் டெலிவரி செய்யப்படும்.
Thank you! Your order will be delivered soon.`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppConfirm = () => {
    const whatsappNumber = '919976988285'; // 91 = India country code
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNewOrder = () => {
    clearCustomer();
    navigate('/');
  };

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">
          <svg viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" fill="#22c55e" />
            <path d="M25 40 L35 50 L55 30" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="success-title">ஆர்டர் வெற்றிகரமாக!</h1>
        <h2 className="success-subtitle">Order Placed Successfully!</h2>
        
        <div className="order-id-box">
          <p className="order-id-label">உங்கள் ஆர்டர் ஐடி / Your Order ID</p>
          <p className="order-id">{orderId}</p>
        </div>

        <div className="success-message">
          <p className="message-tamil">
            🙏 உங்கள் ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!
          </p>
          <p className="message-english">
            Thank you for your order! We have received your order details.
          </p>
        </div>

        <div className="whatsapp-notice">
          <div className="notice-icon">⚠️</div>
          <div className="notice-content">
            <p className="notice-title-tamil">முக்கியம்! / IMPORTANT!</p>
            <p className="notice-text">
              <strong>உங்கள் ஆர்டரை உறுதிப்படுத்த WhatsApp-இல் அனுப்புங்கள்</strong>
            </p>
            <p className="notice-text-en">
              Please send your order on WhatsApp to confirm. We'll call you within 30 minutes.
            </p>
          </div>
        </div>

        <button onClick={handleWhatsAppConfirm} className="whatsapp-confirm-btn">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp-இல் அனுப்பு / Send via WhatsApp
        </button>

        <p className="confirm-help-text">
          மேலே உள்ள பட்டனை அழுத்தி உங்கள் ஆர்டர் விவரங்களை எங்களுக்கு அனுப்பவும்.<br/>
          Click the button above to send your order details to us.
        </p>

        <div className="order-actions">
          <button onClick={handleNewOrder} className="new-order-btn">
            🛒 மீண்டும் ஆர்டர் செய் / New Order
          </button>
        </div>

        <div className="contact-info">
          <p>📞 உதவிக்கு / For help:</p>
          <a href="tel:9976988285" className="contact-phone">+91 99769 88285</a>
          <p className="contact-time">🕕 ஆர்டர் நேரம் / Order Time: காலை 6:00 - இரவு 9:00</p>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;