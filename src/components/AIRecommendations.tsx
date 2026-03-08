import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { useApp } from '../AppContext';
import { getAIRecommendations } from '../services/recommendationService';
import { Sparkles } from 'lucide-react';

export const AIRecommendations = () => {
  const { viewedProducts } = useApp();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const allProducts = await res.json();
        const recs = await getAIRecommendations(viewedProducts, allProducts);
        setRecommendations(recs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, [viewedProducts]);

  if (loading) return null;
  if (recommendations.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gold/10 p-2 rounded-full text-gold">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold">Recommended for You</h2>
          <p className="text-dark/40 text-sm">AI-curated luxury based on your style</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendations.map((product) => (
          <motion.div 
            key={product.id}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Link to={`/product/${product.id}`} className="block aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <div className="space-y-1">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-gold font-bold">K{product.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
