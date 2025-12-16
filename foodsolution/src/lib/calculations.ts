// Moteur de calcul de rentabilité FoodSolution

import type { Dish, DishIngredient, ProfitabilityAnalysis, Alert } from '@/types';
import { 
  calculateFoodCostRatio, 
  calculateGrossMargin, 
  calculateOptimalPrice,
  getProfitabilityStatus,
  ttcToHt 
} from './utils';

// Food cost cibles par type d'établissement
export const TARGET_FOOD_COST: Record<string, { min: number; max: number; target: number }> = {
  'fast-food': { min: 25, max: 30, target: 28 },
  'traditional': { min: 28, max: 35, target: 32 },
  'gastronomic': { min: 30, max: 40, target: 35 },
  'pizzeria': { min: 20, max: 28, target: 25 },
  'cafe-snack': { min: 25, max: 32, target: 28 },
  'dark-kitchen': { min: 25, max: 32, target: 28 },
  'hotel-catering': { min: 28, max: 35, target: 32 },
};

// Analyser la rentabilité d'un plat
export function analyzeDishProfitability(
  dish: Dish,
  establishmentType: string = 'traditional'
): ProfitabilityAnalysis {
  const sellingPriceHT = ttcToHt(dish.sellingPrice);
  const foodCostRatio = calculateFoodCostRatio(dish.costPrice, sellingPriceHT);
  const grossMargin = calculateGrossMargin(sellingPriceHT, dish.costPrice);
  const status = getProfitabilityStatus(foodCostRatio);
  
  const target = TARGET_FOOD_COST[establishmentType] || TARGET_FOOD_COST['traditional'];
  const optimalPriceHT = calculateOptimalPrice(dish.costPrice, target.target);
  const optimalPrice = optimalPriceHT * 1.1; // TTC avec 10% TVA

  const recommendations: string[] = [];

  if (foodCostRatio > target.max) {
    recommendations.push(`Le food cost est trop élevé (${foodCostRatio.toFixed(1)}%). Objectif : ${target.max}%`);
    recommendations.push(`Prix de vente optimal suggéré : ${optimalPrice.toFixed(2)}€`);
  }

  if (grossMargin < 5) {
    recommendations.push('La marge brute est faible. Envisagez de réduire les coûts ou augmenter le prix.');
  }

  if (foodCostRatio < target.min - 5) {
    recommendations.push('Excellent food cost ! Vous pourriez potentiellement améliorer la qualité des ingrédients.');
  }

  if (status === 'excellent' || status === 'good') {
    if (recommendations.length === 0) {
      recommendations.push('Ce plat est bien optimisé. Continuez ainsi !');
    }
  }

  return {
    costPrice: dish.costPrice,
    foodCostRatio,
    grossMargin,
    optimalPrice,
    status,
    recommendations,
  };
}

// Calculer le coût d'un plat à partir de ses ingrédients
export function calculateDishCost(
  ingredients: Array<{ quantity: number; unitPrice: number }>,
  portions: number = 1
): number {
  if (portions === 0) return 0;
  const totalCost = ingredients.reduce((sum, ing) => sum + (ing.quantity * ing.unitPrice), 0);
  return totalCost / portions;
}

// Générer les alertes pour un plat
export function generateDishAlerts(
  dish: Dish,
  establishmentType: string = 'traditional'
): Alert[] {
  const alerts: Alert[] = [];
  const target = TARGET_FOOD_COST[establishmentType] || TARGET_FOOD_COST['traditional'];
  const sellingPriceHT = ttcToHt(dish.sellingPrice);
  const foodCostRatio = calculateFoodCostRatio(dish.costPrice, sellingPriceHT);
  const grossMargin = calculateGrossMargin(sellingPriceHT, dish.costPrice);

  if (foodCostRatio > 35) {
    alerts.push({
      id: `alert-${dish.id}-foodcost`,
      type: 'food-cost-high',
      severity: 'danger',
      message: `⚠️ Attention, "${dish.name}" dépasse le seuil de rentabilité recommandé (${foodCostRatio.toFixed(1)}%)`,
      dishId: dish.id,
      createdAt: new Date(),
    });
  } else if (foodCostRatio > target.max) {
    alerts.push({
      id: `alert-${dish.id}-foodcost-warning`,
      type: 'food-cost-high',
      severity: 'warning',
      message: `📊 Le food cost de "${dish.name}" est élevé (${foodCostRatio.toFixed(1)}%). Objectif : ${target.max}%`,
      dishId: dish.id,
      createdAt: new Date(),
    });
  }

  if (grossMargin < 5) {
    alerts.push({
      id: `alert-${dish.id}-margin`,
      type: 'low-margin',
      severity: 'warning',
      message: `💡 La marge sur "${dish.name}" est faible (${grossMargin.toFixed(2)}€). Voulez-vous optimiser ?`,
      dishId: dish.id,
      createdAt: new Date(),
    });
  }

  return alerts;
}

// Calculer le seuil de rentabilité (break-even)
export function calculateBreakeven(
  fixedCosts: number,
  grossMarginPerUnit: number
): number {
  if (grossMarginPerUnit <= 0) return Infinity;
  return Math.ceil(fixedCosts / grossMarginPerUnit);
}

// Calculer les statistiques globales d'un menu
export function calculateMenuStats(dishes: Dish[]): {
  averageFoodCost: number;
  totalMargin: number;
  bestDish: Dish | null;
  worstDish: Dish | null;
  alertCount: number;
} {
  if (dishes.length === 0) {
    return {
      averageFoodCost: 0,
      totalMargin: 0,
      bestDish: null,
      worstDish: null,
      alertCount: 0,
    };
  }

  const sortedByFoodCost = [...dishes].sort((a, b) => a.foodCostRatio - b.foodCostRatio);
  
  const averageFoodCost = dishes.reduce((sum, d) => sum + d.foodCostRatio, 0) / dishes.length;
  const totalMargin = dishes.reduce((sum, d) => sum + d.grossMargin, 0);
  const alertCount = dishes.filter(d => d.foodCostRatio > 35).length;

  return {
    averageFoodCost,
    totalMargin,
    bestDish: sortedByFoodCost[0] || null,
    worstDish: sortedByFoodCost[sortedByFoodCost.length - 1] || null,
    alertCount,
  };
}
