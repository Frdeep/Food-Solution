'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Input, Button } from '@/components/ui';
import { DishCard } from './DishCard';
import { DishForm } from './DishForm';
import { DishDetail } from './DishDetail';
import { ChevronLeft, Plus, Search, UtensilsCrossed } from 'lucide-react';
import type { DishCategory } from '@/types';

const CATEGORY_FILTERS: { value: DishCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'starter', label: 'Entrées' },
  { value: 'main', label: 'Plats' },
  { value: 'dessert', label: 'Desserts' },
  { value: 'beverage', label: 'Boissons' },
];

interface DishListProps {
  onBack?: () => void;
}

export function DishList({ onBack }: DishListProps) {
  const { dishes, setSelectedDishId, selectedDishId } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewDetail = (dishId: string) => {
    setSelectedDishId(dishId);
  };

  const handleEdit = (dishId: string) => {
    setEditingDishId(dishId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDishId(null);
  };

  const handleCloseDetail = () => {
    setSelectedDishId(null);
  };

  // Show detail view if a dish is selected
  if (selectedDishId) {
    return (
      <DishDetail 
        dishId={selectedDishId} 
        onBack={handleCloseDetail}
        onEdit={() => handleEdit(selectedDishId)}
      />
    );
  }

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
        
        <h1 className="font-bold text-base sm:text-lg text-slate-900">Mes Plats</h1>
        
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
          placeholder="Rechercher un plat..."
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

      {/* Dish List */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-24 overscroll-contain">
        {filteredDishes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-12 sm:py-16"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2 text-base sm:text-lg">Aucun plat</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-[250px]">
              {searchQuery 
                ? 'Aucun résultat pour votre recherche'
                : 'Créez vos recettes pour calculer leur rentabilité'}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un plat
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-2 sm:space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish, index) => (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DishCard 
                    dish={dish}
                    onClick={() => handleViewDetail(dish.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Dish Form Modal */}
      <AnimatePresence>
        {showForm && (
          <DishForm 
            dishId={editingDishId}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
