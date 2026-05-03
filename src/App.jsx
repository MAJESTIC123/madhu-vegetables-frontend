import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import WelcomePage from './pages/WelcomePage';
import ShopPage from './pages/ShopPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ReviewsPage from './pages/ReviewsPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Routes>
        <FloatingWhatsApp />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;