'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { GlassCard, Input, Badge, Button } from '@/components/ui';
import { ProductCard } from './ProductCard';
import { ProductForm } from './ProductForm';
import { ChevronLeft, Plus, Search, Camera } from 'lucide-react';
import type { ProductCategory } from '@/types';

const CATEGORY_FILTERS: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'vegetables', label: 'Légumes' },
  { value: 'meat', label: 'Viandes' },
  { value: 'fish', label: 'Poissons' },
  { value: 'dairy', label: 'Produits laitiers' },
  { value: 'grocery', label: 'Épicerie' },
  { value: 'beverages', label: 'Boissons' },
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
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-surface-secondary">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        
        <h1 className="font-bold text-lg text-slate-900">Mes Produits</h1>
        
        <button 
          onClick={() => setShowForm(true)}
          className="p-2 rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* Search */}
      <div className="p-4">
        <Input
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-5 h-5" />}
        />
      </div>

      {/* Filters */}
      <div className="px-4 pb-4 overflow-x-auto">
        <div className="flex gap-2">
          {CATEGORY_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedCategory(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === filter.value
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Aucun produit</h3>
            <p className="text-sm text-slate-500 mb-6">
              {searchQuery 
                ? 'Aucun résultat pour votre recherche'
                : 'Commencez par ajouter vos matières premières'}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un produit
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onEdit={() => handleEdit(product.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* FAB Scanner */}
      <div className="fixed bottom-24 right-4">
        <motion.button
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Camera className="w-5 h-5" />
          <span className="font-medium">Scanner</span>
        </motion.button>
      </div>

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
