import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Heart, Search, Menu } from 'lucide-react';
import { useApp } from '../AppContext';

export const Navbar = () => {
  const { cart, user } = useApp();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <button className="sm:hidden p-2 text-dark">
              <Menu size={24} />
            </button>
            <Link to="/" className="text-2xl font-display font-bold text-dark tracking-tighter">
              YAMIKO<span className="text-gold">.</span>
            </Link>
          </div>

          <div className="hidden sm:flex space-x-8 text-sm font-medium uppercase tracking-widest">
            <Link to="/shop" className="hover:text-pink-primary transition-colors">Shop</Link>
            <Link to="/feed" className="hover:text-pink-primary transition-colors">Feed</Link>
            <Link to="/shop?category=Fashion" className="hover:text-pink-primary transition-colors">Fashion</Link>
            <Link to="/shop?category=Beauty" className="hover:text-pink-primary transition-colors">Beauty</Link>
            <Link to="/shop?category=Hair" className="hover:text-pink-primary transition-colors">Hair</Link>
          </div>

          <div className="flex items-center space-x-5">
            <button className="p-2 hover:text-pink-primary transition-colors">
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="p-2 hover:text-pink-primary transition-colors">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="p-2 hover:text-pink-primary transition-colors relative">
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-pink-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link to={user ? "/profile" : "/login"} className="p-2 hover:text-pink-primary transition-colors">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
