
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, User, CartItem, AppState, Review, Vendor, Subscription } from '../types';
import { INITIAL_PRODUCTS, MOCK_USERS, MOCK_VENDORS } from '../constants';
import { GoogleGenAI } from "@google/genai";

export interface EmailNotification {
  id: string;
  to: string;
  subject: string;
  body: string;
  type: 'Confirmation' | 'Update';
  timestamp: string;
}

interface AppContextType extends AppState {
  activeNotification: EmailNotification | null;
  closeNotification: () => void;
  addToCart: (product: Product, quantity?: number, sub?: { frequency: Subscription['frequency'] }) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateUserPreferences: (prefs: User['notifications']) => void;
  cancelSubscription: (subId: string) => void;
  login: (email: string) => boolean;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addVendor: (vendor: Omit<Vendor, 'id' | 'joinedDate' | 'rating'>) => void;
  updateVendor: (vendor: Vendor) => void;
  deleteVendor: (vendorId: string) => void;
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  toggleWishlist: (productId: string) => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeNotification, setActiveNotification] = useState<EmailNotification | null>(null);

  useEffect(() => {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    const savedProducts = sessionStorage.getItem('products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    const savedOrders = sessionStorage.getItem('orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    const savedWish = sessionStorage.getItem('wishlist');
    if (savedWish) setWishlist(JSON.parse(savedWish));
    const savedUsers = sessionStorage.getItem('users_registry');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    const savedVendors = sessionStorage.getItem('vendors');
    if (savedVendors) setVendors(JSON.parse(savedVendors));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
    sessionStorage.setItem('products', JSON.stringify(products));
    sessionStorage.setItem('orders', JSON.stringify(orders));
    sessionStorage.setItem('wishlist', JSON.stringify(wishlist));
    sessionStorage.setItem('users_registry', JSON.stringify(users));
    sessionStorage.setItem('vendors', JSON.stringify(vendors));
    if (currentUser) sessionStorage.setItem('user', JSON.stringify(currentUser));
  }, [cart, products, orders, wishlist, users, vendors, currentUser]);

  const generateEmailContent = async (order: Order, type: 'Confirmation' | 'Update'): Promise<{ subject: string; body: string }> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = type === 'Confirmation' 
        ? `Generate a friendly and professional order confirmation email for QuickMart. 
           Order ID: ${order.id}. Total: ₹${order.total}. Items: ${order.items.map(i => i.name).join(', ')}. 
           The tone should be enthusiastic and emphasize 10-minute delivery.`
        : `Generate a short order status update email for QuickMart. 
           Order ID: ${order.id}. New Status: ${order.status}. 
           Keep it concise and professional.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are the QuickMart automated notification system. You generate clean, markdown-friendly email content."
        }
      });

      const text = response.text || "No content generated";
      const lines = text.split('\n');
      const subject = lines[0].startsWith('Subject:') ? lines[0].replace('Subject:', '').trim() : `QuickMart Order ${type === 'Confirmation' ? 'Confirmation' : 'Update'} - ${order.id}`;
      const body = text.replace(lines[0], '').trim();

      return { subject, body };
    } catch (err) {
      return {
        subject: `QuickMart Order ${type === 'Confirmation' ? 'Confirmation' : 'Update'} - ${order.id}`,
        body: `Hello,\n\nYour order #${order.id} has been ${type === 'Confirmation' ? 'received' : 'updated to ' + order.status}. Thank you for choosing QuickMart!`
      };
    }
  };

  const sendEmailNotification = async (order: Order, type: 'Confirmation' | 'Update') => {
    if (order.email || (currentUser && currentUser.notifications?.email)) {
      const { subject, body } = await generateEmailContent(order, type);
      setActiveNotification({
        id: `EMAIL-${Date.now()}`,
        to: order.email || currentUser?.email || 'customer@example.com',
        subject,
        body,
        type,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  const closeNotification = () => setActiveNotification(null);

  const addToCart = (product: Product, quantity: number = 1, sub?: { frequency: Subscription['frequency'] }) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.isSubscription === !!sub);
      if (existing) {
        return prev.map(item => (item.id === product.id && item.isSubscription === !!sub) ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity, isSubscription: !!sub, subscriptionFrequency: sub?.frequency }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (orderData: Omit<Order, 'id' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(Math.random() * 100000)}`,
      date: new Date().toISOString(),
    };

    const tierMultiplier = { Bronze: 1, Silver: 1.2, Gold: 1.5, Platinum: 2 }[currentUser?.tier || 'Bronze'];
    const earnedPoints = Math.floor((newOrder.total / 10) * tierMultiplier);

    if (currentUser) {
      const newSubscriptions: Subscription[] = orderData.items
        .filter(item => item.isSubscription)
        .map(item => ({
          id: `SUB-${Math.random().toString(36).substr(2, 9)}`,
          productId: item.id,
          frequency: item.subscriptionFrequency!,
          nextDelivery: new Date(Date.now() + 86400000).toISOString(),
          discountApplied: 10,
          status: 'Active'
        }));

      const totalPoints = currentUser.quickPoints + earnedPoints;
      let newTier = currentUser.tier;
      if (totalPoints > 5000) newTier = 'Platinum';
      else if (totalPoints > 2000) newTier = 'Gold';
      else if (totalPoints > 500) newTier = 'Silver';

      const updatedUser: User = { 
        ...currentUser, 
        quickPoints: totalPoints,
        tier: newTier,
        phone: orderData.phone,
        email: orderData.email || currentUser.email,
        subscriptions: [...(currentUser.subscriptions || []), ...newSubscriptions]
      };
      
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
    setOrders(prev => [newOrder, ...prev]);
    sendEmailNotification(newOrder, 'Confirmation');
    clearCart();
  };

  const cancelSubscription = (subId: string) => {
    if (!currentUser) return;
    const updatedSubs = currentUser.subscriptions.filter(s => s.id !== subId);
    const updatedUser = { ...currentUser, subscriptions: updatedSubs };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status } : o);
      const updatedOrder = updated.find(o => o.id === orderId);
      if (updatedOrder) {
        sendEmailNotification(updatedOrder, 'Update');
      }
      return updated;
    });
  };

  const updateUserPreferences = (prefs: User['notifications']) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, notifications: prefs };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const login = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      const loggedUser = {
        ...user,
        tier: user.tier || 'Bronze',
        subscriptions: user.subscriptions || [],
        notifications: user.notifications || { email: true, whatsapp: true, sms: false }
      };
      setCurrentUser(loggedUser);
      sessionStorage.setItem('user', JSON.stringify(loggedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('user');
  };

  const addProduct = (p: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newProduct: Product = { ...p, id: `PRD-${Date.now()}`, rating: 0, reviewsCount: 0, reviews: [] } as Product;
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(item => item.id === p.id ? p : item));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addVendor = (v: Omit<Vendor, 'id' | 'joinedDate' | 'rating'>) => {
    const newVendor: Vendor = {
      ...v,
      id: `VND-${Date.now()}`,
      joinedDate: new Date().toISOString(),
      rating: 0,
    };
    setVendors(prev => [newVendor, ...prev]);
  };

  const updateVendor = (v: Vendor) => {
    setVendors(prev => prev.map(item => item.id === v.id ? v : item));
  };

  const deleteVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
  };

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 4) { alert('Limit 4 items'); return prev; }
      return [...prev, product];
    });
  };

  const clearCompare = () => setCompareList([]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const addReview = (productId: string, review: Omit<Review, 'id' | 'date'>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newReview: Review = { ...review, id: `REV-${Date.now()}`, date: new Date().toISOString() };
        const updatedReviews = [...(p.reviews || []), newReview];
        const newRating = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0) / updatedReviews.length;
        return { ...p, reviews: updatedReviews, reviewsCount: updatedReviews.length, rating: Number(newRating.toFixed(1)) };
      }
      return p;
    }));
  };

  return (
    <AppContext.Provider value={{
      products, vendors, orders, users, currentUser, cart, compareList, wishlist,
      activeNotification, closeNotification,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      placeOrder, updateOrderStatus, login, logout, updateUserPreferences, cancelSubscription,
      addProduct, updateProduct, deleteProduct, addVendor, updateVendor, deleteVendor, toggleCompare, clearCompare, toggleWishlist,
      addReview
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
