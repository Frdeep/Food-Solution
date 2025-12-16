import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  OnboardingData, 
  Product, 
  Dish, 
  Message, 
  Alert,
  EstablishmentType,
  CuisineType,
  DailyCovers,
  ExperienceLevel,
  PrimaryGoal
} from '@/types';
import { generateId, calculateUnitPrice, ttcToHt, calculateFoodCostRatio, calculateGrossMargin } from '@/lib/utils';

interface AppState {
  // User & Onboarding
  userName: string;
  onboardingComplete: boolean;
  onboardingStep: number;
  onboardingData: OnboardingData;
  
  // Products
  products: Product[];
  
  // Dishes
  dishes: Dish[];
  
  // Chat
  messages: Message[];
  isTyping: boolean;
  
  // Alerts
  alerts: Alert[];
  
  // UI State
  currentView: 'home' | 'chat' | 'products' | 'dishes';
  selectedDishId: string | null;
  
  // Actions - Onboarding
  setUserName: (name: string) => void;
  setOnboardingStep: (step: number) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  
  // Actions - Products
  addProduct: (product: Omit<Product, 'id' | 'unitPrice' | 'lastUpdated'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Actions - Dishes
  addDish: (dish: Omit<Dish, 'id' | 'costPrice' | 'foodCostRatio' | 'grossMargin'>) => void;
  updateDish: (id: string, updates: Partial<Dish>) => void;
  deleteDish: (id: string) => void;
  
  // Actions - Chat
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  setIsTyping: (typing: boolean) => void;
  clearMessages: () => void;
  
  // Actions - Alerts
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void;
  dismissAlert: (id: string) => void;
  
  // Actions - Navigation
  setCurrentView: (view: AppState['currentView']) => void;
  setSelectedDishId: (id: string | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      userName: '',
      onboardingComplete: false,
      onboardingStep: 0,
      onboardingData: {
        establishmentType: null,
        cuisineType: null,
        dailyCovers: null,
        averageTicket: null,
        experienceLevel: null,
        primaryGoal: null,
      },
      products: [],
      dishes: [],
      messages: [],
      isTyping: false,
      alerts: [],
      currentView: 'home',
      selectedDishId: null,

      // Onboarding Actions
      setUserName: (name) => set({ userName: name }),
      
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      
      updateOnboardingData: (data) => set((state) => ({
        onboardingData: { ...state.onboardingData, ...data },
      })),
      
      completeOnboarding: () => set({ 
        onboardingComplete: true,
        onboardingStep: 7, // Past the last question
      }),
      
      resetOnboarding: () => set({
        onboardingComplete: false,
        onboardingStep: 0,
        onboardingData: {
          establishmentType: null,
          cuisineType: null,
          dailyCovers: null,
          averageTicket: null,
          experienceLevel: null,
          primaryGoal: null,
        },
      }),

      // Product Actions
      addProduct: (product) => set((state) => ({
        products: [...state.products, {
          ...product,
          id: generateId(),
          unitPrice: calculateUnitPrice(product.purchasePrice, product.purchaseQuantity),
          lastUpdated: new Date(),
        }],
      })),
      
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map((p) => {
          if (p.id !== id) return p;
          const updated = { ...p, ...updates, lastUpdated: new Date() };
          // Recalculate unit price if needed
          if (updates.purchasePrice !== undefined || updates.purchaseQuantity !== undefined) {
            updated.unitPrice = calculateUnitPrice(
              updates.purchasePrice ?? p.purchasePrice,
              updates.purchaseQuantity ?? p.purchaseQuantity
            );
          }
          return updated;
        }),
      })),
      
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      })),

      // Dish Actions
      addDish: (dish) => {
        const state = get();
        // Calculate costs
        let costPrice = 0;
        for (const ing of dish.ingredients) {
          const product = state.products.find(p => p.id === ing.productId);
          if (product) {
            costPrice += ing.quantity * product.unitPrice;
          }
        }
        costPrice = costPrice / dish.portions;
        
        const sellingPriceHT = ttcToHt(dish.sellingPrice);
        const foodCostRatio = calculateFoodCostRatio(costPrice, sellingPriceHT);
        const grossMargin = calculateGrossMargin(sellingPriceHT, costPrice);

        set((state) => ({
          dishes: [...state.dishes, {
            ...dish,
            id: generateId(),
            costPrice,
            foodCostRatio,
            grossMargin,
          }],
        }));
      },
      
      updateDish: (id, updates) => set((state) => {
        const dishes = state.products; // For ingredient lookup
        return {
          dishes: state.dishes.map((d) => {
            if (d.id !== id) return d;
            const updated = { ...d, ...updates };
            
            // Recalculate costs if ingredients or portions changed
            if (updates.ingredients || updates.portions || updates.sellingPrice) {
              const ingredients = updates.ingredients ?? d.ingredients;
              const portions = updates.portions ?? d.portions;
              const sellingPrice = updates.sellingPrice ?? d.sellingPrice;
              
              let costPrice = 0;
              for (const ing of ingredients) {
                const product = state.products.find(p => p.id === ing.productId);
                if (product) {
                  costPrice += ing.quantity * product.unitPrice;
                }
              }
              costPrice = costPrice / portions;
              
              const sellingPriceHT = ttcToHt(sellingPrice);
              updated.costPrice = costPrice;
              updated.foodCostRatio = calculateFoodCostRatio(costPrice, sellingPriceHT);
              updated.grossMargin = calculateGrossMargin(sellingPriceHT, costPrice);
            }
            
            return updated;
          }),
        };
      }),
      
      deleteDish: (id) => set((state) => ({
        dishes: state.dishes.filter((d) => d.id !== id),
      })),

      // Chat Actions
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, {
          ...message,
          id: generateId(),
          createdAt: new Date(),
        }],
      })),
      
      setIsTyping: (typing) => set({ isTyping: typing }),
      
      clearMessages: () => set({ messages: [] }),

      // Alert Actions
      addAlert: (alert) => set((state) => ({
        alerts: [...state.alerts, {
          ...alert,
          id: generateId(),
          createdAt: new Date(),
        }],
      })),
      
      dismissAlert: (id) => set((state) => ({
        alerts: state.alerts.filter((a) => a.id !== id),
      })),

      // Navigation Actions
      setCurrentView: (view) => set({ currentView: view }),
      setSelectedDishId: (id) => set({ selectedDishId: id }),
    }),
    {
      name: 'foodsolution-storage',
      partialize: (state) => ({
        userName: state.userName,
        onboardingComplete: state.onboardingComplete,
        onboardingData: state.onboardingData,
        products: state.products,
        dishes: state.dishes,
      }),
    }
  )
);
