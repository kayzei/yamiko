import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { VisualFeed } from './pages/VisualFeed';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/feed" element={<VisualFeed />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <footer className="bg-dark text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                  <h3 className="text-2xl font-display font-bold">YAMIKO.</h3>
                  <p className="text-sm text-white/60 font-light leading-relaxed">
                    Luxury fashion and beauty boutique based in Lusaka, Zambia. Bringing you the finest quality and style.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-6 uppercase tracking-widest text-sm">Shop</h4>
                  <ul className="space-y-3 text-sm text-white/60">
                    <li><Link to="/shop?category=Fashion" className="hover:text-gold">Fashion</Link></li>
                    <li><Link to="/shop?category=Shoes" className="hover:text-gold">Shoes</Link></li>
                    <li><Link to="/shop?category=Beauty" className="hover:text-gold">Beauty</Link></li>
                    <li><Link to="/shop?category=Hair" className="hover:text-gold">Hair</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-6 uppercase tracking-widest text-sm">Customer Care</h4>
                  <ul className="space-y-3 text-sm text-white/60">
                    <li><Link to="/contact" className="hover:text-gold">Contact Us</Link></li>
                    <li><Link to="/shipping" className="hover:text-gold">Shipping & Returns</Link></li>
                    <li><Link to="/faq" className="hover:text-gold">FAQ</Link></li>
                    <li><Link to="/tracking" className="hover:text-gold">Order Tracking</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-6 uppercase tracking-widest text-sm">Connect</h4>
                  <ul className="space-y-3 text-sm text-white/60">
                    <li><a href="#" className="hover:text-gold">Instagram</a></li>
                    <li><a href="#" className="hover:text-gold">Facebook</a></li>
                    <li><a href="#" className="hover:text-gold">Twitter</a></li>
                    <li><a href="#" className="hover:text-gold">WhatsApp</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/40 uppercase tracking-widest">
                © 2026 Yamiko Fashions. All Rights Reserved.
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
}
