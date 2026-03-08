import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Smartphone } from 'lucide-react';
import { useApp } from '../AppContext';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('yamiko_token', data.token);
        navigate('/');
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-card rounded-3xl p-10 shadow-xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-dark/40 text-sm">Join the Yamiko Fashions elite circle</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-dark/10 focus:ring-2 focus:ring-pink-primary outline-none"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" size={18} />
            </div>
          )}
          <div className="relative">
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl border border-dark/10 focus:ring-2 focus:ring-pink-primary outline-none"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" size={18} />
          </div>
          <div className="relative">
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl border border-dark/10 focus:ring-2 focus:ring-pink-primary outline-none"
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" size={18} />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-dark text-white rounded-full font-bold uppercase tracking-widest hover:bg-pink-primary transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-dark/5 text-center">
          <p className="text-sm text-dark/60 mb-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-pink-primary font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-xs text-dark/30 uppercase tracking-widest">
            <div className="h-[1px] flex-1 bg-dark/5"></div>
            <span>Or continue with</span>
            <div className="h-[1px] flex-1 bg-dark/5"></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 py-3 rounded-xl border border-dark/10 hover:bg-gray-50 transition-all">
              <Smartphone size={18} className="text-emerald-600" />
              <span className="text-xs font-bold">Mobile Money</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 rounded-xl border border-dark/10 hover:bg-gray-50 transition-all">
              <Smartphone size={18} className="text-blue-600" />
              <span className="text-xs font-bold">Google</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
