'use client';

import { useState, useEffect } from 'react';
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
  { value: 'dairy', label: 'Produits laitiers', emoji: '🧀' },
  { value: 'grocery', label: 'Épicerie', emoji: '🛒' },
  { value: 'beverages', label: 'Boissons', emoji: '🥤' },
  { value: 'condiments', label: 'Condiments', emoji: '🧂' },
  { value: 'bread', label: 'Boulangerie', emoji: '🍞' },
  { value: 'frozen', label: 'Surgelés', emoji: '🧊' },
  { value: 'other', label: 'Autre', emoji: '📦' },
];

const UNITS: { value: ProductUnit; label: string }[] = [
  { value: 'kg', label: 'Kilogramme (kg)' },
  { value: 'g', label: 'Gramme (g)' },
  { value: 'L', label: 'Litre (L)' },
  { value: 'cl', label: 'Centilitre (cl)' },
  { value: 'ml', label: 'Millilitre (ml)' },
  { value: 'unit', label: 'Unité (pièce)' },
  { value: 'bunch', label: 'Botte' },
  { value: 'pack', label: 'Paquet' },
  { value: 'box', label: 'Boîte' },
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-900">
            {existingProduct ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Photo upload */}
          <div className="flex justify-center">
            <button
              type="button"
              className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 hover:border-brand-primary hover:bg-brand-primary/5 transition-colors"
            >
              <Camera className="w-6 h-6 text-slate-400" />
              <span className="text-xs text-slate-500">Photo</span>
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
            <div className="grid grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1',
                    category === cat.value
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="text-xs text-slate-600 truncate w-full text-center">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prix d'achat (€)"
              type="number"
              step="0.01"
              placeholder="4.50"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              error={errors.purchasePrice}
            />
            <Input
              label="Quantité achetée"
              type="number"
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
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          {/* Calculated unit price */}
          {purchasePrice && purchaseQuantity && parseFloat(purchaseQuantity) > 0 && (
            <GlassCard className="p-4 bg-success/5 border-success/20">
              <p className="text-sm text-slate-600">Prix unitaire calculé :</p>
              <p className="text-2xl font-bold text-success">
                {(parseFloat(purchasePrice) / parseFloat(purchaseQuantity)).toFixed(2)}€/{unit}
              </p>
            </GlassCard>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
            <Button type="submit" className="flex-1">
              {existingProduct ? 'Enregistrer' : 'Ajouter le produit'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
