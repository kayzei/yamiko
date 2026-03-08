import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../AppContext';

import { AIRecommendations } from '../components/AIRecommendations';

export const Home = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const { addToCart } = useApp();

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(res => res.json())
      .then(data => setFeatured(data));
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Fashion" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="uppercase tracking-[0.3em] text-sm font-semibold text-pink-soft mb-4 block">New Collection 2026</span>
            <h1 className="text-6xl sm:text-8xl font-display mb-6 leading-tight">
              Elegance <br /> <span className="italic text-gold">Redefined.</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 font-light max-w-md">
              Discover the finest selection of boutique fashion, luxury hair, and premium beauty products curated for the modern woman.
            </p>
            <Link to="/shop" className="inline-flex items-center space-x-3 bg-white text-dark px-8 py-4 rounded-full font-semibold hover:bg-gold hover:text-white transition-all group">
              <span>Shop Collection</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Fashion', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800' },
            { name: 'Hair', img: 'https://images.unsplash.com/photo-1595475243692-392820991677?auto=format&fit=crop&q=80&w=800' },
            { name: 'Beauty', img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800' }
          ].map((cat, i) => (
            <Link key={i} to={`/shop?category=${cat.name}`} className="group relative h-96 overflow-hidden rounded-2xl">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-display mb-2">{cat.name}</h3>
                <span className="text-sm uppercase tracking-widest border-b border-white pb-1">Explore</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-display mb-2">Featured Pieces</h2>
            <p className="text-dark/60">Handpicked luxury for your wardrobe</p>
          </div>
          <Link to="/shop" className="text-pink-primary font-semibold border-b-2 border-pink-primary pb-1 hover:text-gold hover:border-gold transition-all">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {featured.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={18} className="text-dark hover:text-pink-primary transition-colors" />
                </div>
              </Link>
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <span className="font-bold text-gold">K{product.price}</span>
                </div>
                <p className="text-sm text-dark/50">{product.category}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full mt-4 py-3 border border-dark/10 rounded-full text-sm font-semibold hover:bg-dark hover:text-white transition-all uppercase tracking-widest"
                >
                  Add to Bag
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Recommendations */}
      <AIRecommendations />

      {/* Newsletter / CTA */}
      <section className="bg-pink-soft/30 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-display mb-6">Join the Yamiko Circle</h2>
          <p className="text-dark/60 mb-8">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-6 py-4 rounded-full border-none focus:ring-2 focus:ring-pink-primary outline-none"
            />
            <button className="bg-dark text-white px-10 py-4 rounded-full font-semibold hover:bg-pink-primary transition-all">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
