import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../AppContext';

export const Shop = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useApp();

  useEffect(() => {
    setLoading(true);
    const url = category ? `/api/products?category=${category}` : '/api/products';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-display mb-2">{category || 'All Collections'}</h1>
          <p className="text-dark/50">Showing {products.length} exquisite pieces</p>
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 border border-dark/10 rounded-full hover:bg-dark hover:text-white transition-all">
            <Filter size={18} />
            <span className="text-sm font-semibold uppercase tracking-widest">Filter</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 border border-dark/10 rounded-full hover:bg-dark hover:text-white transition-all">
            <SlidersHorizontal size={18} />
            <span className="text-sm font-semibold uppercase tracking-widest">Sort</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="bg-pink-soft/20 aspect-[3/4] rounded-2xl"></div>
              <div className="h-4 bg-pink-soft/20 rounded w-3/4"></div>
              <div className="h-4 bg-pink-soft/20 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4 bg-white">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => addToCart(product)}
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md py-3 rounded-xl flex items-center justify-center space-x-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                >
                  <ShoppingBag size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Add to Bag</span>
                </button>
              </div>
              <div className="space-y-1">
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="font-medium text-lg hover:text-pink-primary transition-colors">{product.name}</h3>
                </Link>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-dark/50">{product.category}</span>
                  <span className="font-bold text-gold">K{product.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
