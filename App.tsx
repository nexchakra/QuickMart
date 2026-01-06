
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetails } from './pages/ProductDetails';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { OrderHistory } from './pages/OrderHistory';
import { OrderTracking } from './pages/OrderTracking';
import { ComparePage } from './pages/ComparePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminOrders } from './pages/AdminOrders';
import { AdminVendors } from './pages/AdminVendors';
import { WishlistPage } from './pages/WishlistPage';
import { AIChat } from './components/AIChat';
import { EmailNotificationToast } from './components/EmailNotificationToast';
import { VendorsPage } from './pages/VendorsPage';
import { VendorDetails } from './pages/VendorDetails';
import { LayoutDashboard, Package, ShoppingBag, Users, Store } from 'lucide-react';

const PrivateRoute: React.FC<{ children: React.ReactNode; role?: 'admin' | 'customer' | 'vendor' }> = ({ children, role }) => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" />;
  if (role && currentUser.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <aside className="w-72 bg-slate-950 text-white p-8 hidden xl:block relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 space-y-12">
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pl-4">Platform Core</p>
              <nav className="space-y-2">
                <Link to="/admin" className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 transition group">
                  <LayoutDashboard className="w-5 h-5 text-slate-500 group-hover:text-green-500 transition" />
                  <span className="text-xs font-black uppercase tracking-widest">Analytics</span>
                </Link>
                <Link to="/admin/vendors" className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 transition group">
                  <Store className="w-5 h-5 text-slate-500 group-hover:text-green-500 transition" />
                  <span className="text-xs font-black uppercase tracking-widest">Producers</span>
                </Link>
                <Link to="/admin/products" className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 transition group">
                  <Package className="w-5 h-5 text-slate-500 group-hover:text-green-500 transition" />
                  <span className="text-xs font-black uppercase tracking-widest">Inventory</span>
                </Link>
                <Link to="/admin/orders" className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 transition group">
                  <ShoppingBag className="w-5 h-5 text-slate-500 group-hover:text-green-500 transition" />
                  <span className="text-xs font-black uppercase tracking-widest">Orders</span>
                </Link>
                <Link to="/admin" className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 transition group opacity-50 cursor-not-allowed">
                  <Users className="w-5 h-5 text-slate-500" />
                  <span className="text-xs font-black uppercase tracking-widest">Customers</span>
                </Link>
              </nav>
           </div>
        </div>
      </aside>
      <div className="flex-1 bg-slate-50/50">
        {children}
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/vendor/:slug" element={<VendorDetails />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/checkout" element={
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute>
            <OrderHistory />
          </PrivateRoute>
        } />

        <Route path="/order-tracking/:orderId" element={
          <PrivateRoute>
            <OrderTracking />
          </PrivateRoute>
        } />
        
        <Route path="/admin" element={
          <PrivateRoute role="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </PrivateRoute>
        } />
        
        <Route path="/admin/vendors" element={
          <PrivateRoute role="admin">
            <AdminLayout>
              <AdminVendors />
            </AdminLayout>
          </PrivateRoute>
        } />
        
        <Route path="/admin/products" element={
          <PrivateRoute role="admin">
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </PrivateRoute>
        } />

        <Route path="/admin/orders" element={
          <PrivateRoute role="admin">
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <AIChat />
      <EmailNotificationToast />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;
