import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formater un prix en euros
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

// Formater un pourcentage
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Calculer le prix unitaire
export function calculateUnitPrice(purchasePrice: number, purchaseQuantity: number): number {
  if (purchaseQuantity === 0) return 0;
  return purchasePrice / purchaseQuantity;
}

// Calculer le coût des matières premières d'un plat
export function calculateCostPrice(
  ingredients: { quantity: number; unitPrice: number }[],
  portions: number
): number {
  if (portions === 0) return 0;
  const totalCost = ingredients.reduce((sum, ing) => sum + (ing.quantity * ing.unitPrice), 0);
  return totalCost / portions;
}

// Calculer le food cost ratio
export function calculateFoodCostRatio(costPrice: number, sellingPriceHT: number): number {
  if (sellingPriceHT === 0) return 0;
  return (costPrice / sellingPriceHT) * 100;
}

// Calculer la marge brute
export function calculateGrossMargin(sellingPriceHT: number, costPrice: number): number {
  return sellingPriceHT - costPrice;
}

// Calculer le prix de vente optimal
export function calculateOptimalPrice(costPrice: number, targetFoodCostRatio: number): number {
  if (targetFoodCostRatio === 0) return 0;
  return costPrice / (targetFoodCostRatio / 100);
}

// Convertir TTC en HT (TVA restauration 10%)
export function ttcToHt(priceTTC: number, tvaRate: number = 10): number {
  return priceTTC / (1 + tvaRate / 100);
}

// Convertir HT en TTC
export function htToTtc(priceHT: number, tvaRate: number = 10): number {
  return priceHT * (1 + tvaRate / 100);
}

// Déterminer le statut de rentabilité
export function getProfitabilityStatus(foodCostRatio: number): 'excellent' | 'good' | 'warning' | 'danger' {
  if (foodCostRatio < 25) return 'excellent';
  if (foodCostRatio < 30) return 'good';
  if (foodCostRatio < 35) return 'warning';
  return 'danger';
}

// Obtenir la couleur du statut
export function getStatusColor(status: 'excellent' | 'good' | 'warning' | 'danger'): string {
  const colors = {
    excellent: '#10B981',
    good: '#6366F1',
    warning: '#F59E0B',
    danger: '#EF4444',
  };
  return colors[status];
}

// Formater une date relative
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "aujourd'hui";
  if (diffDays === 1) return 'hier';
  if (diffDays < 7) return `il y a ${diffDays} jours`;
  if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} semaines`;
  return `il y a ${Math.floor(diffDays / 30)} mois`;
}

// Générer un ID unique
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
