import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchProducts } from '../api';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import '../styles/ShopPage.css';

const ShopPage = () => {
  const { customer, cart, cartTotal } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer) {
      navigate('/');
      return;
    }
    loadProducts();
  }, [customer, navigate]);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading products:', err);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="shop-page">
      <Header />
      
      <div className="shop-banner">
        <h1>Fresh Vegetables 🥬</h1>
        <p>Quality vegetables at your doorstep</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search vegetables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading vegetables...</div>
      ) : (
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="no-results">No vegetables found</p>
          )}
        </div>
      )}

      {cart.length > 0 && (
        <div className="floating-cart" onClick={() => navigate('/checkout')}>
          <div className="cart-info">
            <span>{cart.length} item(s)</span>
            <span className="cart-total">₹{cartTotal.toFixed(2)}</span>
          </div>
          <button className="checkout-btn">Go to Checkout →</button>
        </div>
      )}
    </div>
  );
};

export default ShopPage;