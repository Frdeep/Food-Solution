'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { GlassCard, Input, Button } from '@/components/ui';
import { X, Camera, Trash2 } from 'lucide-react';
import type { ProductCategory, ProductUnit } from '@/types';
import { cn } from '@/lib/utils';

interface ProductFormProps {
  productId?: string | null;
  onClose: () => void;
}

const CATEGORIES: { value: ProductCategory; label: string; emoji: string }[] = [
  { value: 'vegetables', label: 'Légumes', emoji: '🥬' },
  { value: 'meat', label: 'Viandes', emoji: '🥩' },
  { value: 'fish', label: 'Poissons', emoji: '🐟' },
  { value: 'dairy', label: 'Laitiers', emoji: '🧀' },
  { value: 'grocery', label: 'Épicerie', emoji: '🛒' },
  { value: 'beverages', label: 'Boissons', emoji: '🥤' },
  { value: 'condiments', label: 'Sauces', emoji: '🧂' },
  { value: 'bread', label: 'Pain', emoji: '🍞' },
  { value: 'frozen', label: 'Surgelés', emoji: '🧊' },
  { value: 'other', label: 'Autre', emoji: '📦' },
];

const UNITS: { value: ProductUnit; label: string }[] = [
  { value: 'kg', label: 'Kilogramme (kg)' },
  { value: 'g', label: 'Gramme (g)' },
  { value: 'L', label: 'Litre (L)' },
  { value: 'cl', label: 'Centilitre (cl)' },
  { value: 'unit', label: 'Unité (pièce)' },
  { value: 'pack', label: 'Paquet' },
];

export function ProductForm({ productId, onClose }: ProductFormProps) {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  
  const existingProduct = productId 
    ? products.find(p => p.id === productId) 
    : null;

  const [name, setName] = useState(existingProduct?.name || '');
  const [category, setCategory] = useState<ProductCategory>(existingProduct?.category || 'vegetables');
  const [unit, setUnit] = useState<ProductUnit>(existingProduct?.unit || 'kg');
  const [purchasePrice, setPurchasePrice] = useState(existingProduct?.purchasePrice?.toString() || '');
  const [purchaseQuantity, setPurchaseQuantity] = useState(existingProduct?.purchaseQuantity?.toString() || '1');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Le nom est requis';
    if (!purchasePrice || parseFloat(purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Le prix doit être positif';
    }
    if (!purchaseQuantity || parseFloat(purchaseQuantity) <= 0) {
      newErrors.purchaseQuantity = 'La quantité doit être positive';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const productData = {
      name: name.trim(),
      category,
      unit,
      purchasePrice: parseFloat(purchasePrice),
      purchaseQuantity: parseFloat(purchaseQuantity),
    };

    if (existingProduct) {
      updateProduct(existingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (existingProduct && window.confirm('Supprimer ce produit ?')) {
      deleteProduct(existingProduct.id);
      onClose();
    }
  };

  const unitPrice = purchasePrice && purchaseQuantity && parseFloat(purchaseQuantity) > 0
    ? (parseFloat(purchasePrice) / parseFloat(purchaseQuantity)).toFixed(2)
    : null;

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
            {existingProduct ? 'Modifier le produit' : 'Nouveau produit'}
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
            label="Nom du produit"
            placeholder="Ex: Tomates cerises"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Catégorie
            </label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'p-2 sm:p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-0.5 touch-manipulation active:scale-95',
                    category === cat.value
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <span className="text-lg sm:text-xl">{cat.emoji}</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-600 truncate w-full text-center leading-tight">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prix d'achat (€)"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="4.50"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              error={errors.purchasePrice}
            />
            <Input
              label="Quantité"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="1"
              value={purchaseQuantity}
              onChange={(e) => setPurchaseQuantity(e.target.value)}
              error={errors.purchaseQuantity}
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Unité
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as ProductUnit)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary text-base"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          {/* Calculated unit price */}
          {unitPrice && (
            <GlassCard className="p-4 bg-success/5 border-success/20">
              <p className="text-sm text-slate-600 mb-1">Prix unitaire calculé</p>
              <p className="text-2xl sm:text-3xl font-bold text-success">
                {unitPrice}€<span className="text-base font-normal text-slate-500">/{unit}</span>
              </p>
            </GlassCard>
          )}
        </form>

        {/* Actions - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 flex gap-3 safe-area-inset-bottom">
          {existingProduct && (
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
            {existingProduct ? 'Enregistrer' : 'Ajouter le produit'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
