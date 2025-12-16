'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { GlassCard, Input, Button } from '@/components/ui';
import { ProductCard } from './ProductCard';
import { ProductForm } from './ProductForm';
import { ChevronLeft, Plus, Search, Camera, Package } from 'lucide-react';
import type { ProductCategory } from '@/types';

const CATEGORY_FILTERS: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'vegetables', label: 'Légumes' },
  { value: 'meat', label: 'Viandes' },
  { value: 'fish', label: 'Poissons' },
  { value: 'dairy', label: 'Laitiers' },
  { value: 'grocery', label: 'Épicerie' },
];

interface ProductListProps {
  onBack?: () => void;
}

export function ProductList({ onBack }: ProductListProps) {
  const { products } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (productId: string) => {
    setEditingProductId(productId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProductId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-surface-secondary">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-3 sm:p-4 border-b border-slate-100 bg-white/90 backdrop-blur-lg safe-area-inset-top">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        
        <h1 className="font-bold text-base sm:text-lg text-slate-900">Mes Produits</h1>
        
        <button 
          onClick={() => setShowForm(true)}
          className="p-2 rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 active:scale-95 transition-all touch-manipulation"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* Search */}
      <div className="p-3 sm:p-4 pb-2">
        <Input
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-5 h-5" />}
        />
      </div>

      {/* Filters */}
      <div className="px-3 sm:px-4 pb-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {CATEGORY_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedCategory(filter.value)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all touch-manipulation ${
                selectedCategory === filter.value
                  ? 'bg-brand-primary text-white shadow-button'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-24 overscroll-contain">
        {filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-12 sm:py-16"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2 text-base sm:text-lg">Aucun produit</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-[250px]">
              {searchQuery 
                ? 'Aucun résultat pour votre recherche'
                : 'Commencez par ajouter vos matières premières'}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un produit
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-2 sm:space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard 
                    product={product}
                    onEdit={() => handleEdit(product.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* FAB Scanner */}
      {products.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-24 sm:bottom-28 right-4 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-button active:scale-95 transition-transform touch-manipulation z-20"
        >
          <Camera className="w-5 h-5" />
          <span className="font-medium text-sm">Scanner</span>
        </motion.button>
      )}

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProductForm 
            productId={editingProductId}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
