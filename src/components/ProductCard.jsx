import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useApp();
  const cartItem = cart.find((item) => item._id === product._id);
  
  const isKg = product.unit === 'kg';
  const step = isKg ? 0.1 : 1;
  const minQty = step;
  const initialQty = isKg ? 0.5 : 1;
  
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : initialQty);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const formatQty = (qty) => {
    if (isKg) {
      if (qty < 1) return `${Math.round(qty * 1000)} g`;
      return `${qty.toFixed(qty % 1 === 0 ? 0 : 1)} kg`;
    }
    if (product.unit === 'piece') return qty === 1 ? '1 pc' : `${qty} pcs`;
    if (product.unit === 'bundle') return qty === 1 ? '1 bundle' : `${qty} bundles`;
    return qty;
  };

  const handleAdd = () => {
    addToCart(product, quantity);
  };

  const handleIncrease = () => {
    const newQty = parseFloat((quantity + step).toFixed(2));
    setQuantity(newQty);
    if (cartItem) updateQuantity(product._id, newQty);
  };

  const handleDecrease = () => {
    const newQty = parseFloat((quantity - step).toFixed(2));
    if (newQty < minQty) {
      if (cartItem) removeFromCart(product._id);
      setQuantity(initialQty);
      return;
    }
    setQuantity(newQty);
    if (cartItem) updateQuantity(product._id, newQty);
  };

  const subtotal = (product.pricePerUnit * quantity).toFixed(2);

  return (
    <div className={`product-card ${cartItem ? 'in-cart' : ''}`}>
      <div className="product-image">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x150/4caf50/ffffff?text=' + encodeURIComponent(product.name);
          }}
        />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">₹{product.pricePerUnit}<span>/{product.unit}</span></p>
        
        <div className="quantity-controls">
          <button onClick={handleDecrease} className="qty-btn">−</button>
          <span className="qty-display">{formatQty(quantity)}</span>
          <button onClick={handleIncrease} className="qty-btn">+</button>
        </div>

        <p className="subtotal">Subtotal: ₹{subtotal}</p>

        {cartItem ? (
          <button className="added-btn" onClick={() => removeFromCart(product._id)}>
            ✓ Remove
          </button>
        ) : (
          <button className="add-btn" onClick={handleAdd}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;