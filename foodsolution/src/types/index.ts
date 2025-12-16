// Types pour FoodSolution

// Onboarding Types
export type EstablishmentType = 
  | 'fast-food'
  | 'traditional'
  | 'dark-kitchen'
  | 'cafe-snack'
  | 'gastronomic'
  | 'hotel-catering';

export type CuisineType = 
  | 'french'
  | 'italian'
  | 'japanese'
  | 'american'
  | 'oriental'
  | 'indian'
  | 'asian'
  | 'mexican'
  | 'fusion'
  | 'other';

export type DailyCovers = 
  | 'less-30'
  | '30-80'
  | '80-150'
  | 'more-150';

export type ExperienceLevel = 
  | 'beginner'
  | 'experienced'
  | 'confirmed'
  | 'expert';

export type PrimaryGoal = 
  | 'cost-control'
  | 'profitability'
  | 'management'
  | 'complete';

export interface OnboardingData {
  establishmentType: EstablishmentType | null;
  cuisineType: CuisineType | null;
  dailyCovers: DailyCovers | null;
  averageTicket: number | null;
  experienceLevel: ExperienceLevel | null;
  primaryGoal: PrimaryGoal | null;
}

// Product Types
export type ProductCategory = 
  | 'vegetables'
  | 'meat'
  | 'fish'
  | 'dairy'
  | 'grocery'
  | 'beverages'
  | 'condiments'
  | 'bread'
  | 'frozen'
  | 'other';

export type ProductUnit = 
  | 'kg'
  | 'g'
  | 'L'
  | 'cl'
  | 'ml'
  | 'unit'
  | 'bunch'
  | 'pack'
  | 'box';

export interface Product {
  id: string;
  name: string;
  photoUrl?: string;
  category: ProductCategory;
  unit: ProductUnit;
  purchasePrice: number;
  purchaseQuantity: number;
  unitPrice: number;
  supplierId?: string;
  lastUpdated: Date;
}

// Dish Types
export type DishCategory = 
  | 'starter'
  | 'main'
  | 'dessert'
  | 'beverage'
  | 'menu'
  | 'side'
  | 'sauce';

export interface DishIngredient {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: ProductUnit;
  cost: number;
}

export interface Dish {
  id: string;
  name: string;
  photoUrl?: string;
  category: DishCategory;
  portions: number;
  sellingPrice: number;
  costPrice: number;
  foodCostRatio: number;
  grossMargin: number;
  ingredients: DishIngredient[];
}

// Chat Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  richContent?: RichContent;
}

export interface RichContent {
  type: 'dish-card' | 'product-card' | 'profitability-analysis' | 'alert';
  data: unknown;
}

// Profitability Types
export interface ProfitabilityAnalysis {
  costPrice: number;
  foodCostRatio: number;
  grossMargin: number;
  optimalPrice: number;
  status: 'excellent' | 'good' | 'warning' | 'danger';
  recommendations: string[];
}

// Alert Types
export interface Alert {
  id: string;
  type: 'food-cost-high' | 'price-increase' | 'low-margin' | 'price-outdated';
  severity: 'warning' | 'danger' | 'info';
  message: string;
  dishId?: string;
  productId?: string;
  createdAt: Date;
}
