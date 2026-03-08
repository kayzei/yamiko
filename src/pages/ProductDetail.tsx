import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Share2, Star, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../AppContext';

import { AIRecommendations } from '../components/AIRecommendations';

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { addToCart, trackView } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
        setLoading(false);
        trackView(Number(id));
      });
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!product) return <div className="p-20 text-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-dark/40 mb-12">
        <button onClick={() => navigate('/')} className="hover:text-gold transition-colors">Home</button>
        <ChevronRight size={12} />
        <button onClick={() => navigate('/shop')} className="hover:text-gold transition-colors">Shop</button>
        <ChevronRight size={12} />
        <span className="text-dark">{product.category}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-white">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white cursor-pointer hover:opacity-80 transition-opacity">
                <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h1 className="text-5xl font-display">{product.name}</h1>
              <button className="p-3 rounded-full border border-dark/10 hover:bg-pink-soft/20 transition-all">
                <Heart size={20} />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gold">K{product.price}</span>
              <div className="flex items-center text-amber-400">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span className="ml-2 text-xs text-dark/40 font-bold uppercase tracking-widest">(24 Reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-dark/60 leading-relaxed">
            {product.description}
          </p>

          {product.sizes.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest">Select Size</h4>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-xl border transition-all text-sm font-bold ${selectedSize === size ? 'border-dark bg-dark text-white' : 'border-dark/10 hover:border-dark'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest">Select Color</h4>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 rounded-xl border transition-all text-sm font-bold ${selectedColor === color ? 'border-dark bg-dark text-white' : 'border-dark/10 hover:border-dark'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-dark text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-pink-primary transition-all flex items-center justify-center space-x-3"
            >
              <ShoppingBag size={20} />
              <span>Add to Bag</span>
            </button>
            <button className="p-5 rounded-full border border-dark/10 hover:bg-dark hover:text-white transition-all">
              <Share2 size={20} />
            </button>
          </div>

          <div className="pt-10 border-t border-dark/5 space-y-6">
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-10 h-10 rounded-full bg-pink-soft/30 flex items-center justify-center text-pink-primary">
                <Star size={18} />
              </div>
              <div>
                <p className="font-bold">Authentic Quality</p>
                <p className="text-xs text-dark/50">100% genuine products guaranteed</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <Star size={18} />
              </div>
              <div>
                <p className="font-bold">Fast Delivery</p>
                <p className="text-xs text-dark/50">Same day delivery within Lusaka</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIRecommendations />
    </div>
  );
};
