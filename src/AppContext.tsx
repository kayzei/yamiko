import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User } from './types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  viewedProducts: number[];
  trackView: (productId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [viewedProducts, setViewedProducts] = useState<number[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('yamiko_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedCart = localStorage.getItem('yamiko_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedViews = localStorage.getItem('yamiko_views');
    if (savedViews) setViewedProducts(JSON.parse(savedViews));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('yamiko_user', JSON.stringify(user));
    else localStorage.removeItem('yamiko_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('yamiko_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('yamiko_views', JSON.stringify(viewedProducts));
  }, [viewedProducts]);

  const trackView = (productId: number) => {
    setViewedProducts(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AppContext.Provider value={{ user, setUser, cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, viewedProducts, trackView }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
