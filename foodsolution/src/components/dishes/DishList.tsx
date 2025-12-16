'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { GlassCard, Input, Badge, Button } from '@/components/ui';
import { DishCard } from './DishCard';
import { DishForm } from './DishForm';
import { DishDetail } from './DishDetail';
import { ChevronLeft, Plus, Search } from 'lucide-react';
import type { DishCategory } from '@/types';

const CATEGORY_FILTERS: { value: DishCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'starter', label: 'Entrées' },
  { value: 'main', label: 'Plats' },
  { value: 'dessert', label: 'Desserts' },
  { value: 'beverage', label: 'Boissons' },
  { value: 'menu', label: 'Menus' },
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
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-surface-secondary">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        
        <h1 className="font-bold text-lg text-slate-900">Mes Plats</h1>
        
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
          placeholder="Rechercher un plat..."
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

      {/* Dish List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredDishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Aucun plat</h3>
            <p className="text-sm text-slate-500 mb-6">
              {searchQuery 
                ? 'Aucun résultat pour votre recherche'
                : 'Créez vos recettes pour calculer leur rentabilité'}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un plat
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredDishes.map((dish) => (
                <DishCard 
                  key={dish.id} 
                  dish={dish}
                  onClick={() => handleViewDetail(dish.id)}
                />
              ))}
            </AnimatePresence>
          </div>
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
