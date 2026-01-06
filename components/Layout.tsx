
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { ShoppingCart, User, Search, LogOut, LayoutDashboard, Sparkles, Heart, Store, ShieldCheck, Award } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cart, currentUser, logout, wishlist } = useApp();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glass sticky top-0 z-[60] h-20 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-slate-200 group-hover:rotate-12 transition-transform">
                <span className="text-green-500 font-black text-xl italic">Q</span>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">QuickMart</span>
            </Link>
            
            <div className="hidden lg:flex space-x-8">
              <Link to="/shop" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${location.pathname === '/shop' ? 'text-green-600' : 'text-slate-400 hover:text-green-600'}`}>Market</Link>
              <Link to="/vendors" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${location.pathname === '/vendors' ? 'text-green-600' : 'text-slate-400 hover:text-green-600'}`}>Producers</Link>
              <Link to="/compare" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${location.pathname === '/compare' ? 'text-green-600' : 'text-slate-400 hover:text-green-600'}`}>Analysis</Link>
              {currentUser?.role === 'admin' && (
                <Link to="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700 flex items-center">
                  <LayoutDashboard className="w-3 h-3 mr-2" /> Admin Hub
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-6">
            <Link to="/shop?vendor=internal" className="hidden xl:flex items-center bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl group hover:bg-slate-900 transition-all duration-500">
               <Award className="w-4 h-4 text-yellow-500 mr-2 group-hover:animate-bounce" />
               <span className="text-[9px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest transition-colors">Mart Originals</span>
            </Link>

            {currentUser && (
              <div className="hidden sm:flex items-center bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
                <Sparkles className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-[9px] font-black text-green-700 uppercase tracking-[0.2em]">{currentUser.quickPoints} <span className="text-[7px]">PTS</span></span>
              </div>
            )}

            <div className="flex items-center bg-slate-100 rounded-2xl p-1">
              <Link to="/shop" className="p-2 text-slate-500 hover:text-green-600 transition-colors">
                <Search className="w-5 h-5" />
              </Link>
              <Link to="/wishlist" className="relative p-2 text-slate-500 hover:text-red-500 transition-colors">
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-current text-red-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-lg h-5 min-w-5 px-1.5 flex items-center justify-center font-black shadow-lg shadow-red-100 border-2 border-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative p-2 text-slate-500 hover:text-green-600 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[9px] rounded-lg h-5 min-w-5 px-1.5 flex items-center justify-center font-black shadow-lg shadow-green-100 border-2 border-white">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
            
            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-green-500 font-bold hover:bg-green-600 hover:text-white transition-all shadow-sm">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-green-600 transition-all shadow-xl shadow-slate-200">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-slate-900 font-black text-sm italic">Q</span>
                </div>
                <span className="text-xl font-black tracking-tighter uppercase italic">QuickMart</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-bold uppercase tracking-widest max-w-xs">
                Ultra-fast hyperlocal marketplace. 10 minute delivery. Originals certified quality.
              </p>
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl w-fit">
                 <ShieldCheck className="w-4 h-4 text-green-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">100% Purity Pledge</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-green-500 mb-8 italic">Quick-Aisles</h4>
              <ul className="space-y-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <li><Link to="/shop?category=Dairy" className="hover:text-white transition">Breakfast & Dairy</Link></li>
                <li><Link to="/shop?category=Snacks" className="hover:text-white transition">Instant Munchies</Link></li>
                <li><Link to="/shop?vendor=internal" className="hover:text-white transition">Mart Originals</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-green-500 mb-8 italic">Logistics</h4>
              <ul className="space-y-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <li><Link to="/" className="hover:text-white transition">Express Tracking</Link></li>
                <li><Link to="/" className="hover:text-white transition">Partner With Us</Link></li>
                <li><Link to="/" className="hover:text-white transition">Return Policy</Link></li>
              </ul>
            </div>

            <div className="glass-dark p-8 rounded-[3rem] border border-white/5">
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-green-500 mb-4 italic">Hyper-Alerts</h4>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-6">Drop your email for 30% off Originals.</p>
              <div className="flex flex-col space-y-3">
                <input type="email" placeholder="EMAIL@QUICK.IO" className="bg-white/5 border-white/10 border rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-green-500 outline-none transition" />
                <button className="bg-green-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition shadow-lg shadow-green-900/20">Subscribe</button>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">© 2025 QuickMart Ultra. Powered by Gemini Pro.</p>
            <div className="flex space-x-8">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">SWIFT-PAY 1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
