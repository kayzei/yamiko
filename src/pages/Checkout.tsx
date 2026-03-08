import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { CreditCard, Smartphone, Truck, MapPin } from 'lucide-react';

export const Checkout = () => {
  const { cart, cartTotal, user, clearCart } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    const orderData = {
      userId: user?.id || null,
      items: cart,
      totalPrice: cartTotal,
      paymentMethod,
      address: 'Lusaka, Zambia' // Simplified for demo
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        clearCart();
        alert('Order placed successfully! Redirecting to tracking...');
        navigate('/');
      }
    } catch (e) {
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-display mb-12">Checkout</h1>
      
      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-display mb-6 flex items-center gap-3">
              <MapPin className="text-gold" /> Delivery Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" required className="px-6 py-4 rounded-2xl border border-dark/10 focus:ring-2 focus:ring-pink-primary outline-none" />
              <input type="text" placeholder="Last Name" required className="px-6 py-4 rounded-2xl border border-dark/10 focus:ring-2 focus:ring-pink-primary outline-none" />
              <input type="email" placeholder="Email Address" required className="px-6 py-4 rounded-2xl border border-dark/10 focus:ring-2 focus:ring-pink-primary outline-none sm:col-span-2" />
              <input type="tel" placeholder="Phone Number (MTN/Airtel)" required className="px-6 py-4 rounded-2xl border border-dark/10 focus:ring-2 focus:ring-pink-primary outline-none sm:col-span-2" />
              <textarea placeholder="Delivery Address in Lusaka" required className="px-6 py-4 rounded-2xl border border-dark/10 focus:ring-2 focus:ring-pink-primary outline-none sm:col-span-2 h-32"></textarea>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display mb-6 flex items-center gap-3">
              <Smartphone className="text-gold" /> Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'mobile_money' ? 'border-pink-primary bg-pink-soft/20' : 'border-dark/10'}`}>
                <input type="radio" name="payment" value="mobile_money" checked={paymentMethod === 'mobile_money'} onChange={() => setPaymentMethod('mobile_money')} className="hidden" />
                <Smartphone className={paymentMethod === 'mobile_money' ? 'text-pink-primary' : 'text-dark/40'} />
                <div>
                  <p className="font-bold">Mobile Money</p>
                  <p className="text-xs text-dark/50">MTN, Airtel, Zamtel</p>
                </div>
              </label>
              <label className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'card' ? 'border-pink-primary bg-pink-soft/20' : 'border-dark/10'}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                <CreditCard className={paymentMethod === 'card' ? 'text-pink-primary' : 'text-dark/40'} />
                <div>
                  <p className="font-bold">Card Payment</p>
                  <p className="text-xs text-dark/50">Visa, Mastercard</p>
                </div>
              </label>
            </div>
          </section>
        </div>

        <div>
          <div className="glass-card rounded-3xl p-8 sticky top-32">
            <h2 className="text-2xl font-display mb-6">Order Review</h2>
            <div className="max-h-60 overflow-y-auto mb-8 pr-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-bold">K{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 mb-8 pt-6 border-t border-dark/10">
              <div className="flex justify-between text-dark/60">
                <span>Subtotal</span>
                <span>K{cartTotal}</span>
              </div>
              <div className="flex justify-between text-dark/60">
                <span>Delivery Fee</span>
                <span>K50</span>
              </div>
              <div className="pt-4 border-t border-dark/10 flex justify-between font-bold text-2xl">
                <span>Total</span>
                <span className="text-gold">K{cartTotal + 50}</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-dark text-white rounded-full font-bold uppercase tracking-widest hover:bg-pink-primary transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Order'}
            </button>
            
            <p className="mt-6 text-[10px] text-dark/40 text-center leading-relaxed">
              By completing your order, you agree to Yamiko Fashions' Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
