import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, MessageCircle, Send, MoreHorizontal, X } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../AppContext';
import { Link } from 'react-router-dom';

export const VisualFeed = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useApp();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Yamiko Feed</h1>
        <div className="flex space-x-4">
          <div className="w-12 h-12 rounded-full border-2 border-pink-primary p-0.5">
            <div className="w-full h-full rounded-full bg-pink-soft/30 flex items-center justify-center text-pink-primary text-[10px] font-bold">LIVE</div>
          </div>
        </div>
      </div>

      {products.map((product, idx) => (
        <motion.div 
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl overflow-hidden shadow-sm border border-pink-soft/20"
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center font-display text-gold text-xs font-bold">Y</div>
              <div>
                <p className="text-xs font-bold">yamiko_fashions</p>
                <p className="text-[10px] text-dark/40">Lusaka, Zambia</p>
              </div>
            </div>
            <MoreHorizontal size={18} className="text-dark/40" />
          </div>

          {/* Image */}
          <div 
            className="aspect-square relative cursor-pointer group"
            onClick={() => setSelectedProduct(product)}
          >
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                View Details
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <Heart size={24} className="hover:text-pink-primary cursor-pointer transition-colors" />
                <MessageCircle size={24} className="hover:text-pink-primary cursor-pointer transition-colors" />
                <Send size={24} className="hover:text-pink-primary cursor-pointer transition-colors" />
              </div>
              <button 
                onClick={() => addToCart(product)}
                className="bg-pink-primary text-white p-2 rounded-full hover:scale-110 transition-transform"
              >
                <ShoppingBag size={20} />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold">K{product.price}</p>
              <p className="text-sm">
                <span className="font-bold mr-2">yamiko_fashions</span>
                {product.description.slice(0, 100)}...
              </p>
              <p className="text-[10px] text-dark/40 uppercase tracking-widest pt-2">2 hours ago</p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Product Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden relative"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full text-dark hover:bg-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-square">
                  <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-display font-bold mb-1">{selectedProduct.name}</h2>
                    <p className="text-gold font-bold">K{selectedProduct.price}</p>
                  </div>
                  <p className="text-sm text-dark/60 leading-relaxed">{selectedProduct.description}</p>
                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full bg-pink-primary text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-pink-primary/90 transition-all"
                    >
                      Add to Bag
                    </button>
                    <Link 
                      to={`/product/${selectedProduct.id}`}
                      className="block text-center text-xs font-bold uppercase tracking-widest text-dark/40 hover:text-dark transition-colors"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
