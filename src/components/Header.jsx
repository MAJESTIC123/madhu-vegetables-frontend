import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Header.css';

const Header = () => {
  const { customer, cartItemsCount } = useApp();

  return (
    <header className="header">
      <Link to="/shop" className="logo">
        🥬 Madhu Vegetables
      </Link>
      {customer && (
        <div className="header-right">
          <span className="customer-name">Hi, {customer.name.split(' ')[0]}!</span>
          <Link to="/checkout" className="cart-link">
            🛒 Cart ({cartItemsCount})
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;