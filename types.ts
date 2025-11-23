export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  micronutrients?: {
    fiber?: number;
    sugar?: number;
    sodium?: number;
    cholesterol?: number;
    potassium?: number;
    saturatedFat?: number;
    vitaminA?: number;
    vitaminC?: number;
    calcium?: number;
    iron?: number;
  };
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  items: FoodItem[];
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
}

export interface UserGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  bmi?: number;
  tdee?: number;
  reasoning?: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ADD_LOG = 'ADD_LOG',
  RESEARCH = 'RESEARCH',
  PROFILE = 'PROFILE',
  ONBOARDING = 'ONBOARDING',
  ANALYTICS = 'ANALYTICS',
  HISTORY = 'HISTORY'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string }[];
}

export interface SearchResult {
  foodName: string;
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  micronutrients?: {
    fiber?: number;
    sugar?: number;
    sodium?: number;
    cholesterol?: number;
    potassium?: number;
    saturatedFat?: number;
    vitaminA?: number;
    vitaminC?: number;
    calcium?: number;
    iron?: number;
  };
}