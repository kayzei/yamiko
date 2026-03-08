import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useApp } from '../AppContext';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useApp();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-display mb-6">Your bag is empty</h1>
        <p className="text-dark/50 mb-8">Discover our latest arrivals and find something you love.</p>
        <Link to="/shop" className="btn-pink">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-display mb-12">Your Shopping Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center space-x-6 py-6 border-b border-pink-soft">
              <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-pink-soft/10">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="flex-grow space-y-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <span className="font-bold">K{item.price * item.quantity}</span>
                </div>
                <p className="text-sm text-dark/50">{item.category}</p>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center border border-dark/10 rounded-full px-3 py-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-pink-primary">
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-pink-primary">
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <button onClick={() => removeFromCart(item.id)} className="text-dark/40 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="glass-card rounded-3xl p-8 sticky top-32">
            <h2 className="text-2xl font-display mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-dark/60">
                <span>Subtotal</span>
                <span>K{cartTotal}</span>
              </div>
              <div className="flex justify-between text-dark/60">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-dark/10 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="text-gold">K{cartTotal}</span>
              </div>
            </div>
            
            <Link to="/checkout" className="w-full btn-dark flex items-center justify-center space-x-3 py-4 bg-dark text-white rounded-full hover:bg-pink-primary transition-all">
              <span className="font-bold uppercase tracking-widest">Proceed to Checkout</span>
              <ArrowRight size={20} />
            </Link>
            
            <div className="mt-8 space-y-4">
              <p className="text-[10px] text-dark/40 uppercase tracking-widest text-center">Secure Payments via</p>
              <div className="flex justify-center gap-4 opacity-50 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/MTN_Logo.svg/1200px-MTN_Logo.svg.png" alt="MTN" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
