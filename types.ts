
export type Category = 'Shampoo' | 'Oil' | 'Soap' | 'Grocery' | 'Accessories' | 'Dairy' | 'Snacks' | 'Beverages' | 'Meat' | 'Fruits' | 'Vegetables';

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  rating: number;
  location: string;
  joinedDate: string;
  isVerified: boolean;
  categories: Category[];
}

export interface Subscription {
  id: string;
  productId: string;
  frequency: 'Daily' | 'Weekly' | 'Bi-Weekly';
  nextDelivery: string;
  discountApplied: number;
  status: 'Active' | 'Paused' | 'Cancelled';
}

export interface NutritionFacts {
  calories: string;
  totalFat: string;
  saturatedFat: string;
  cholesterol: string;
  sodium: string;
  carbs: string;
  fiber: string;
  sugars: string;
  protein: string;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  brand?: string;
  category: Category;
  price: number;
  originalPrice?: number;
  stock: number;
  weight?: string;
  shelfLife?: string;
  origin?: string;
  image: string;
  images?: string[];
  description: string;
  isOffer?: boolean;
  isFlashSale?: boolean;
  isExpress?: boolean;
  isMartOriginal?: boolean;
  saleEnds?: string;
  features?: string[];
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  nutritionalInfo?: string; // High-level summary
  nutritionFacts?: NutritionFacts; // Detailed breakdown
  ingredients?: string[];
  allergens?: string[];
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  isSubscription?: boolean;
  subscriptionFrequency?: Subscription['frequency'];
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: 'COD' | 'Online' | 'PayPal' | 'Stripe' | 'GooglePay';
  address: string;
  phone: string;
  email?: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer' | 'vendor';
  vendorId?: string;
  addresses: string[];
  quickPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  subscriptions: Subscription[];
  notifications?: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
}

export interface AppState {
  products: Product[];
  vendors: Vendor[];
  orders: Order[];
  users: User[];
  currentUser: User | null;
  cart: CartItem[];
  compareList: Product[];
  wishlist: string[];
}
