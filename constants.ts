
import { Product, Category, User, Vendor } from './types';

export const CATEGORIES: Category[] = ['Grocery', 'Dairy', 'Snacks', 'Beverages', 'Shampoo', 'Oil', 'Soap', 'Accessories', 'Meat', 'Fruits', 'Vegetables'];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'internal',
    name: 'Mart Originals',
    slug: 'mart-originals',
    logo: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1604719312563-8912e9223c6a?auto=format&fit=crop&q=80&w=1200',
    description: 'QuickMart’s own premium range of daily essentials. Sourced directly and delivered in under 10 minutes.',
    rating: 5.0,
    location: 'Central Warehouse Hub',
    joinedDate: '2023-01-01',
    isVerified: true,
    categories: ['Grocery', 'Dairy', 'Snacks']
  },
  {
    id: 'v1',
    name: 'Green Valley Organics',
    slug: 'green-valley',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=1200',
    description: 'A co-operative of 50+ local farmers dedicated to pesticide-free, organic produce.',
    rating: 4.9,
    location: 'Hillside Farm District',
    joinedDate: '2023-01-15',
    isVerified: true,
    categories: ['Grocery', 'Dairy', 'Fruits', 'Vegetables']
  },
  {
    id: 'v_meat_hub',
    name: 'The Meat Collective',
    slug: 'meat-collective',
    logo: 'https://images.unsplash.com/photo-1607623273573-74c43081ec5b?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1544022613-e87a7183e20e?auto=format&fit=crop&q=80&w=1200',
    description: 'Prime cuts and fresh poultry sourced from ethical local farms.',
    rating: 4.8,
    location: 'Butcher Street, North Zone',
    joinedDate: '2023-08-10',
    isVerified: true,
    categories: ['Meat']
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'org1',
    vendorId: 'internal',
    brand: 'Mart Originals',
    name: 'Mart Premium Full Cream Milk',
    category: 'Dairy',
    price: 68,
    stock: 500,
    weight: '500ml',
    shelfLife: '2 Days',
    origin: 'Local Dairy Hub',
    image: 'https://images.unsplash.com/photo-1550583724-125581fe2f8a?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1550583724-125581fe2f8a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Pasteurized and homogenized full cream milk. Rich in calcium and vitamins. Chilled to 4°C for maximum freshness.',
    rating: 5.0,
    reviewsCount: 1200,
    isExpress: true,
    isMartOriginal: true,
    isNew: true,
    features: ['Rich in Vitamin D', 'No Preservatives', 'Ethically Sourced'],
    ingredients: ['Fresh Cow Milk', 'Vitamin A Palmitate', 'Vitamin D3'],
    allergens: ['Milk'],
    nutritionFacts: {
      calories: '150',
      totalFat: '8g',
      saturatedFat: '5g',
      cholesterol: '30mg',
      sodium: '120mg',
      carbs: '12g',
      fiber: '0g',
      sugars: '12g',
      protein: '8g'
    }
  },
  {
    id: 'sn1',
    vendorId: 'internal',
    brand: 'Mart Munchies',
    name: 'Mart Classic Salted Nachos',
    category: 'Snacks',
    price: 45,
    originalPrice: 50,
    stock: 200,
    weight: '150g',
    shelfLife: '6 Months',
    origin: 'Central Hub Bakery',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Authentic stone-ground corn tortilla chips. Lightly salted to maintain the natural flavor of the corn.',
    isExpress: true,
    isFlashSale: true,
    isMartOriginal: true,
    rating: 4.7,
    reviewsCount: 2300,
    features: ['Stone Ground', 'Zero Trans Fat', 'No Artificial Colors'],
    ingredients: ['Whole Yellow Corn', 'Sunflower Oil', 'Sea Salt'],
    allergens: ['May contain Soy'],
    nutritionFacts: {
      calories: '140',
      totalFat: '7g',
      saturatedFat: '1g',
      cholesterol: '0mg',
      sodium: '110mg',
      carbs: '18g',
      fiber: '2g',
      sugars: '1g',
      protein: '2g'
    }
  },
  {
    id: 'fv2',
    vendorId: 'v1',
    brand: 'Green Valley',
    name: 'Organic Baby Spinach (200g)',
    category: 'Vegetables',
    price: 45,
    stock: 120,
    weight: '200g',
    shelfLife: '2 Days',
    origin: 'Hillside Organic Farm',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=600',
    description: 'Hydroponically grown tender organic baby spinach leaves. Pre-washed and ready to use.',
    isExpress: true,
    rating: 4.7,
    reviewsCount: 180,
    features: ['Hydroponic', 'Pesticide Free', 'Pre-washed'],
    ingredients: ['Organic Baby Spinach'],
    allergens: ['None'],
    nutritionFacts: {
      calories: '7',
      totalFat: '0.1g',
      saturatedFat: '0g',
      cholesterol: '0mg',
      sodium: '24mg',
      carbs: '1g',
      fiber: '0.7g',
      sugars: '0.1g',
      protein: '0.9g'
    }
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '919876543210',
    role: 'customer',
    addresses: ['123 Main St, Springfield'],
    quickPoints: 450,
    tier: 'Bronze',
    subscriptions: []
  },
  {
    id: 'admin1',
    name: 'Mart Owner',
    email: 'admin@quickmart.com',
    role: 'admin',
    addresses: [],
    quickPoints: 10000,
    tier: 'Platinum',
    subscriptions: []
  }
];
