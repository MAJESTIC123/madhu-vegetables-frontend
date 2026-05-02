import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/WelcomePage.css';

const ALLOWED_PINCODES = ['638452', '638476', '638453', '638454', '638457', '638458', '638503', '638505', '638110'];

const WelcomePage = () => {
  const { setCustomer } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    address: '',
    landmark: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit Indian mobile number';
    }

    if (!ALLOWED_PINCODES.includes(formData.pincode)) {
      newErrors.pincode = 'Sorry! We deliver only in Gobichettipalayam area';
    }

    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = 'Please enter complete address (min 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setCustomer(formData);
      navigate('/shop');
    }
  };

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-header">
          <h1>🥬 Madhu Vegetables</h1>
          <p>Fresh vegetables delivered to your home!</p>
          <p className="location">📍 Serving Gobichettipalayam area</p>
        </div>

        <h2>Enter Your Details to Continue</h2>
        <p className="form-note">All fields marked * are mandatory</p>

        <form onSubmit={handleSubmit} className="welcome-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Karthi Kumar"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Mobile Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength="10"
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="6-digit pincode"
              maxLength="6"
            />
            {errors.pincode && <span className="error">{errors.pincode}</span>}
            <small className="hint">
              Available pincodes: 638452, 638476, 638453, 638454, 638457, 638458, 638503, 638505, 638110
            </small>
          </div>

          <div className="form-group">
            <label>Full Delivery Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House no, Street, Area, etc."
              rows="3"
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label>Landmark (Optional)</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Near temple, school, etc."
            />
          </div>

          <button type="submit" className="submit-btn">
            Continue to Shop →
          </button>
        </form>

        <div className="info-box">
          <p>💰 Minimum order: ₹200</p>
          <p>🚚 Delivery charge: ₹30</p>
          <p>💵 Cash on Delivery available</p>
          <p>⏰ Order timings: 6 AM to 9 PM</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;