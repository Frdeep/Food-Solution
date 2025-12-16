'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { GlassCard, Input, Button } from '@/components/ui';
import { X, Camera, Trash2, Plus, Minus } from 'lucide-react';
import type { DishCategory, DishIngredient, ProductUnit } from '@/types';
import { cn, formatPrice } from '@/lib/utils';

interface DishFormProps {
  dishId?: string | null;
  onClose: () => void;
}

const CATEGORIES: { value: DishCategory; label: string; emoji: string }[] = [
  { value: 'starter', label: 'Entrée', emoji: '🥗' },
  { value: 'main', label: 'Plat', emoji: '🍽️' },
  { value: 'dessert', label: 'Dessert', emoji: '🍰' },
  { value: 'beverage', label: 'Boisson', emoji: '🥤' },
  { value: 'menu', label: 'Menu', emoji: '📋' },
  { value: 'side', label: 'Accomp.', emoji: '🍟' },
];

interface IngredientEntry {
  productId: string;
  quantity: number;
  unit: ProductUnit;
}

export function DishForm({ dishId, onClose }: DishFormProps) {
  const { products, dishes, addDish, updateDish, deleteDish } = useStore();
  
  const existingDish = dishId ? dishes.find(d => d.id === dishId) : null;

  const [name, setName] = useState(existingDish?.name || '');
  const [category, setCategory] = useState<DishCategory>(existingDish?.category || 'main');
  const [portions, setPortions] = useState(existingDish?.portions?.toString() || '1');
  const [sellingPrice, setSellingPrice] = useState(existingDish?.sellingPrice?.toString() || '');
  const [ingredients, setIngredients] = useState<IngredientEntry[]>(
    existingDish?.ingredients?.map(ing => ({
      productId: ing.productId,
      quantity: ing.quantity,
      unit: ing.unit,
    })) || []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate cost
  const calculateTotalCost = () => {
    let total = 0;
    for (const ing of ingredients) {
      const product = products.find(p => p.id === ing.productId);
      if (product) {
        total += ing.quantity * product.unitPrice;
      }
    }
    return total;
  };

  const totalCost = calculateTotalCost();
  const costPerPortion = parseInt(portions) > 0 ? totalCost / parseInt(portions) : 0;
  const sellingPriceNum = parseFloat(sellingPrice) || 0;
  const sellingPriceHT = sellingPriceNum / 1.1;
  const foodCostRatio = sellingPriceHT > 0 ? (costPerPortion / sellingPriceHT) * 100 : 0;
  const grossMargin = sellingPriceHT - costPerPortion;

  const addIngredient = () => {
    if (products.length === 0) return;
    setIngredients([...ingredients, {
      productId: products[0].id,
      quantity: 1,
      unit: products[0].unit,
    }]);
  };

  const updateIngredient = (index: number, updates: Partial<IngredientEntry>) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], ...updates };
    
    if (updates.productId) {
      const product = products.find(p => p.id === updates.productId);
      if (product) {
        newIngredients[index].unit = product.unit;
      }
    }
    
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Le nom est requis';
    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      newErrors.sellingPrice = 'Le prix doit être positif';
    }
    if (ingredients.length === 0) {
      newErrors.ingredients = 'Ajoutez au moins un ingrédient';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const dishIngredients: DishIngredient[] = ingredients.map((ing, index) => {
      const product = products.find(p => p.id === ing.productId);
      return {
        id: `ing-${index}`,
        productId: ing.productId,
        productName: product?.name || '',
        quantity: ing.quantity,
        unit: ing.unit,
        cost: product ? ing.quantity * product.unitPrice : 0,
      };
    });

    const dishData = {
      name: name.trim(),
      category,
      portions: parseInt(portions),
      sellingPrice: parseFloat(sellingPrice),
      ingredients: dishIngredients,
    };

    if (existingDish) {
      updateDish(existingDish.id, dishData);
    } else {
      addDish(dishData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (existingDish && window.confirm('Supprimer ce plat ?')) {
      deleteDish(existingDish.id);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-lg text-slate-900">
            {existingDish ? 'Modifier le plat' : 'Nouveau plat'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-5 overscroll-contain">
          {/* Photo upload */}
          <div className="flex justify-center">
            <button
              type="button"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:border-brand-primary hover:bg-brand-primary/5 active:scale-95 transition-all touch-manipulation"
            >
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
              <span className="text-[10px] sm:text-xs text-slate-500">Photo</span>
            </button>
          </div>

          {/* Name */}
          <Input
            label="Nom du plat"
            placeholder="Ex: Burger Maison"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Catégorie
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-0.5 touch-manipulation active:scale-95',
                    category === cat.value
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-[8px] sm:text-[9px] text-slate-600 truncate w-full text-center leading-tight">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price and Portions */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prix TTC (€)"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="12.00"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              error={errors.sellingPrice}
            />
            <Input
              label="Portions"
              type="number"
              inputMode="numeric"
              min="1"
              placeholder="1"
              value={portions}
              onChange={(e) => setPortions(e.target.value)}
            />
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Ingrédients
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addIngredient}
                disabled={products.length === 0}
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
            
            {products.length === 0 ? (
              <GlassCard className="p-4 text-center">
                <p className="text-sm text-slate-500">
                  Ajoutez d&apos;abord des produits
                </p>
              </GlassCard>
            ) : ingredients.length === 0 ? (
              <GlassCard className="p-4 text-center border-dashed border-2 border-slate-200">
                <p className="text-sm text-slate-500">
                  Aucun ingrédient ajouté
                </p>
                {errors.ingredients && (
                  <p className="text-sm text-danger mt-1">{errors.ingredients}</p>
                )}
              </GlassCard>
            ) : (
              <div className="space-y-2">
                {ingredients.map((ing, index) => {
                  const product = products.find(p => p.id === ing.productId);
                  const cost = product ? ing.quantity * product.unitPrice : 0;
                  
                  return (
                    <GlassCard key={index} className="p-2 sm:p-3" hover={false}>
                      <div className="flex items-center gap-2">
                        <select
                          value={ing.productId}
                          onChange={(e) => updateIngredient(index, { productId: e.target.value })}
                          className="flex-1 min-w-0 px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-sm truncate"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min="0"
                          value={ing.quantity}
                          onChange={(e) => updateIngredient(index, { quantity: parseFloat(e.target.value) || 0 })}
                          className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 text-sm text-center"
                        />
                        
                        <span className="text-xs text-slate-500 w-6">
                          {ing.unit}
                        </span>
                        
                        <span className="text-xs font-medium text-slate-700 w-12 text-right">
                          {formatPrice(cost)}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="p-1.5 rounded-full hover:bg-danger/10 active:bg-danger/20 text-danger touch-manipulation"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cost Summary */}
          {ingredients.length > 0 && (
            <GlassCard className={cn(
              'p-4',
              foodCostRatio < 30 ? 'bg-success/5 border-success/20' :
              foodCostRatio < 35 ? 'bg-warning/5 border-warning/20' :
              'bg-danger/5 border-danger/20'
            )}>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Coût / portion</p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">{formatPrice(costPerPortion)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Food Cost</p>
                  <p className={cn(
                    'text-lg sm:text-xl font-bold',
                    foodCostRatio < 30 ? 'text-success' :
                    foodCostRatio < 35 ? 'text-warning' : 'text-danger'
                  )}>
                    {foodCostRatio.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Marge brute</p>
                  <p className="text-lg sm:text-xl font-bold text-success">{formatPrice(grossMargin)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Prix HT</p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">{formatPrice(sellingPriceHT)}</p>
                </div>
              </div>
            </GlassCard>
          )}
        </form>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 flex gap-3 safe-area-inset-bottom">
          {existingDish && (
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              className="px-4"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
          <Button onClick={handleSubmit} className="flex-1">
            {existingDish ? 'Enregistrer' : 'Créer le plat'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
