
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { 
  Package, 
  ChevronRight, 
  ShoppingBag, 
  Calendar, 
  Clock, 
  ChevronDown, 
  MapPin, 
  ReceiptText, 
  Truck,
  CheckCircle2,
  XCircle,
  Timer,
  Info,
  BellRing,
  Mail,
  Smartphone,
  MessageCircle,
  Settings,
  Shield,
  RotateCw,
  Gift,
  Zap,
  TrendingUp,
  Star,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { Order, User, Subscription } from '../types';

export const OrderHistory: React.FC = () => {
  const { orders, currentUser, updateUserPreferences, cancelSubscription, products, wishlist, toggleWishlist, addToCart } = useApp();
  const navigate = useNavigate();
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'Orders' | 'Subscriptions' | 'Wishlist' | 'Settings'>('Orders');

  const userOrders = orders.filter(o => o.userId === currentUser?.id || o.userId === 'guest');
  const wishedProducts = products.filter(p => wishlist.includes(p.id));

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // Loyalty Logic
  const nextTierProgress = currentUser?.tier === 'Bronze' ? 500 : currentUser?.tier === 'Silver' ? 2000 : 5000;
  const progressPercent = Math.min(((currentUser?.quickPoints || 0) / nextTierProgress) * 100, 100);

  const getDeliveryInfo = (order: Order) => {
    const orderDate = new Date(order.date);
    if (order.status === 'Delivered') return { label: "Completed On", value: orderDate.toLocaleDateString(), color: 'text-green-600', bgColor: 'bg-green-50' };
    if (order.status === 'Cancelled') return { label: "Status", value: "Voided", color: 'text-red-500', bgColor: 'bg-red-50' };
    return { label: "Hyper-Path arrival", value: "ETA 28 Mins", color: 'text-blue-600', bgColor: 'bg-blue-50' };
  };

  const handleTogglePreference = (key: keyof NonNullable<User['notifications']>) => {
    if (!currentUser || !currentUser.notifications) return;
    updateUserPreferences({ ...currentUser.notifications, [key]: !currentUser.notifications[key] });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
      {/* Gamified Loyalty Card */}
      <section className="bg-slate-900 rounded-[5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-white border-[1px] border-white/5">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-500/10 to-transparent"></div>
         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
               <div className="w-32 h-32 md:w-48 md:h-48 rounded-[4rem] bg-white/5 border border-white/10 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-green-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <Gift className="w-16 h-16 md:w-24 h-24 text-green-400 relative z-10" />
               </div>
               <div className="space-y-6">
                  <div>
                    <span className="bg-white/10 text-green-400 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] mb-4 inline-block">{currentUser?.tier} Member</span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] italic">{currentUser?.name || 'QuickMart Explorer'}</h1>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                     <div className="flex items-center space-x-4">
                        <Zap className="w-6 h-6 text-green-400" />
                        <span className="text-2xl font-black tracking-tight">{currentUser?.quickPoints} <span className="text-slate-500 uppercase text-xs font-black tracking-widest ml-1">Points</span></span>
                     </div>
                     <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
                     <div className="flex items-center space-x-4">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                        <span className="text-lg font-black text-slate-400 uppercase tracking-tighter">Gold Status at 2K</span>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="w-full lg:w-96 bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[4rem] space-y-6 shadow-2xl">
               <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tier Progress</p>
                  <p className="text-lg font-black text-green-400">{Math.round(progressPercent)}%</p>
               </div>
               <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
               </div>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Unlock Free Regional Priority at 500 Pts</p>
            </div>
         </div>
      </section>

      {/* Profile Navigation */}
      <div className="flex bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-sm w-fit mx-auto overflow-x-auto scrollbar-hide">
        {(['Orders', 'Subscriptions', 'Wishlist', 'Settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 md:px-10 md:py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Orders' ? (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
          {userOrders.length > 0 ? userOrders.map((order) => {
            const isExpanded = expandedOrders[order.id] ?? false;
            const delivery = getDeliveryInfo(order);
            return (
              <div key={order.id} className="bg-white rounded-[4rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-700">
                <div onClick={() => toggleOrder(order.id)} className="p-10 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors gap-10">
                  <div className="flex flex-wrap items-center gap-12">
                    <div className="flex flex-col">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order UID</p>
                       <p className="font-mono text-sm font-black text-slate-900">#{order.id.split('-')[1]}</p>
                    </div>
                    <div className="flex flex-col">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Basket Value</p>
                       <p className="text-2xl font-black text-slate-900">₹{order.total}</p>
                    </div>
                    <div className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${order.status === 'Delivered' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-900 text-white'}`}>
                       {order.status}
                    </div>
                  </div>
                  <ChevronDown className={`w-8 h-8 text-slate-200 transition-transform duration-500 ${isExpanded ? 'rotate-180 text-slate-900' : ''}`} />
                </div>
                {isExpanded && (
                  <div className="p-10 md:p-16 border-t border-slate-50 animate-in fade-in duration-700">
                    <div className={`mb-12 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10 ${delivery.bgColor}`}>
                       <div className="flex items-center space-x-8">
                          <div className={`p-5 rounded-[2rem] bg-white shadow-xl ${delivery.color}`}>
                             <Truck className="w-10 h-10" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{delivery.label}</p>
                             <p className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">{delivery.value}</p>
                          </div>
                       </div>
                       <Link to={`/order-tracking/${order.id}`} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition shadow-xl">Live Track</Link>
                    </div>
                    <div className="space-y-6">
                       {order.items.map(item => (
                         <div key={item.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2.5rem] hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                            <div className="flex items-center space-x-6">
                               <img src={item.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="" />
                               <div>
                                  <h4 className="font-black text-slate-900 uppercase text-base">{item.name}</h4>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">x{item.quantity} • Hyper-Fresh Picked</p>
                               </div>
                            </div>
                            <p className="text-xl font-black text-slate-900">₹{item.price * item.quantity}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="py-32 bg-white rounded-[5rem] border border-slate-100 shadow-sm text-center">
               <Package className="w-16 h-16 text-slate-100 mx-auto mb-8" />
               <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4 italic">No Orders Yet</h3>
               <p className="text-slate-400 font-medium max-w-sm mx-auto">Your first fresh haul is just a few clicks away.</p>
               <Link to="/shop" className="inline-block mt-12 bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition shadow-xl">Shop Market</Link>
            </div>
          )}
        </div>
      ) : activeTab === 'Subscriptions' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-6">
           {currentUser?.subscriptions && currentUser.subscriptions.length > 0 ? (
             currentUser.subscriptions.map(sub => {
               const product = products.find(p => p.id === sub.productId);
               return (
                 <div key={sub.id} className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-emerald-100 group-hover:text-emerald-500/10 transition duration-1000">
                       <RotateCw className="w-48 h-48 rotate-12" />
                    </div>
                    <div className="relative z-10 space-y-8">
                       <div className="flex items-center justify-between">
                          <span className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em]">{sub.frequency} Batch</span>
                          <span className="flex items-center text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                             <CheckCircle2 className="w-3 h-3 mr-2" /> {sub.status}
                          </span>
                       </div>
                       <div className="flex items-center space-x-6">
                          <img src={product?.image} className="w-24 h-24 rounded-3xl object-cover shadow-lg" alt="" />
                          <div>
                             <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-3">{product?.name}</h4>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Arrival: Tomorrow 8AM</p>
                          </div>
                       </div>
                       <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Saved Each Cycle</span>
                             <span className="text-2xl font-black text-emerald-600">₹{Math.floor((product?.price || 0) * 0.1)}</span>
                          </div>
                          <button 
                            onClick={() => cancelSubscription(sub.id)}
                            className="bg-red-50 text-red-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-50"
                          >
                             Pause Cycle
                          </button>
                       </div>
                    </div>
                 </div>
               );
             })
           ) : (
             <div className="col-span-full py-40 bg-white rounded-[5rem] border border-slate-100 shadow-sm text-center">
                <RotateCw className="w-16 h-16 text-slate-100 mx-auto mb-8" />
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4 italic">No Essentials Subscribed</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto">Set up recurring deliveries for your daily needs and unlock a permanent <span className="text-emerald-600 font-black">10% discount.</span></p>
                <Link to="/shop" className="inline-block mt-12 bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition shadow-xl shadow-slate-200">Set Up First Hub</Link>
             </div>
           )}
        </div>
      ) : activeTab === 'Wishlist' ? (
        <div className="animate-in fade-in slide-in-from-bottom-6">
          {wishedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishedProducts.map(p => (
                <div key={p.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 group">
                   <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-6">
                      <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="" />
                      <button 
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-xl shadow-lg hover:scale-110 transition active:scale-95"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                   </div>
                   <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-3 italic">{p.name}</h4>
                   <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{p.price}</span>
                      <button 
                        onClick={() => addToCart(p)}
                        className="bg-green-600 text-white p-4 rounded-2xl hover:bg-slate-900 transition shadow-xl"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              ))}
              <div className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center p-10 text-center hover:bg-white transition-all cursor-pointer group" onClick={() => navigate('/shop')}>
                 <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                    <Star className="w-8 h-8 text-slate-200 group-hover:text-green-600 transition" />
                 </div>
                 <h5 className="mt-6 text-slate-400 font-black uppercase text-xs">Add More Items</h5>
              </div>
            </div>
          ) : (
            <div className="py-40 bg-white rounded-[5rem] border border-slate-100 shadow-sm text-center">
               <Heart className="w-16 h-16 text-slate-100 mx-auto mb-8" />
               <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4 italic">Wishlist is Silent</h3>
               <p className="text-slate-400 font-medium max-w-sm mx-auto">Keep your future cravings here. We'll track them for you.</p>
               <Link to="/shop" className="inline-block mt-12 bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition shadow-xl shadow-slate-200">Browse Catalog</Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
          <section className="bg-white p-12 md:p-20 rounded-[5rem] shadow-sm border border-slate-100">
             <div className="flex items-center space-x-8 mb-16">
               <div className="bg-green-50 p-6 rounded-[2rem] shadow-xl shadow-green-50">
                 <BellRing className="w-12 h-12 text-green-600" />
               </div>
               <div>
                 <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight italic leading-none mb-3">Notification Logic</h2>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">We only speak when it's vital</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { id: 'email', label: 'Email Receipting', sub: 'Invoices & Analysis', icon: <Mail />, color: 'text-blue-500' },
                  { id: 'whatsapp', label: 'WhatsApp Pulse', sub: 'Live Tracking Links', icon: <MessageCircle />, color: 'text-green-500' },
                  { id: 'sms', label: 'SMS Core', sub: 'Urgent Logistics', icon: <Smartphone />, color: 'text-orange-500' }
                ].map((item) => (
                  <div key={item.id} className="bg-slate-50 p-10 rounded-[3.5rem] border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-2xl transition-all group">
                     <div className={`w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-10 ${item.color} group-hover:scale-110 group-hover:rotate-6 transition duration-500`}>
                        {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-8 h-8' })}
                     </div>
                     <h4 className="font-black text-slate-900 uppercase text-xl leading-none mb-2">{item.label}</h4>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">{item.sub}</p>
                     <button 
                      onClick={() => handleTogglePreference(item.id as any)}
                      className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${currentUser?.notifications?.[item.id as keyof NonNullable<User['notifications']>] ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-300 border border-slate-100'}`}
                     >
                       {currentUser?.notifications?.[item.id as keyof NonNullable<User['notifications']>] ? 'Active' : 'Muted'}
                     </button>
                  </div>
                ))}
             </div>
          </section>
        </div>
      )}
    </div>
  );
};
