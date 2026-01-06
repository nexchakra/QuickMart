
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { CATEGORIES } from '../constants';
import { 
  ChevronRight, 
  Zap, 
  Clock, 
  ShoppingCart, 
  Sparkles, 
  Flame, 
  Timer,
  ArrowRight,
  TrendingUp,
  Star,
  PackageCheck,
  Award,
  Flashlight,
  Heart,
  Truck,
  Leaf,
  Beef,
  Coffee,
  ShoppingBag,
  Plus
} from 'lucide-react';

const CountdownTimer: React.FC<{ endsAt: string }> = ({ endsAt }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(endsAt).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  return (
    <div className="flex items-center space-x-3 bg-red-600 text-white px-6 py-3 rounded-2xl shadow-[0_10px_30px_-5px_rgba(220,38,38,0.4)] border border-red-500/50">
      <Timer className="w-5 h-5 animate-pulse" />
      <div className="flex flex-col">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-80 leading-none mb-1">Ending In</span>
        <span className="text-xl font-black font-mono tracking-tighter leading-none">{timeLeft}</span>
      </div>
    </div>
  );
};

const ProductScroller: React.FC<{ title: string; products: any[]; addToCart: any; subtitle?: string; colorClass?: string; icon?: React.ReactNode; extraHeader?: React.ReactNode }> = ({ title, products, addToCart, subtitle, colorClass = "text-slate-900", icon, extraHeader }) => (
  <section className="max-w-7xl mx-auto px-4 overflow-hidden">
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 px-2 gap-6">
      <div className="flex items-center space-x-4">
        {icon && <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">{icon}</div>}
        <div>
          <h2 className={`text-3xl md:text-4xl font-black tracking-tighter uppercase italic ${colorClass}`}>{title}</h2>
          {subtitle && <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-6">
        {extraHeader}
        <Link to="/shop" className="text-[10px] font-black text-green-600 uppercase tracking-widest hover:underline flex items-center">
          View All <ChevronRight className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </div>
    <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-10 px-2 snap-x">
      {products.map(p => (
        <div key={p.id} className="min-w-[260px] md:min-w-[300px] snap-start group">
          <div className="bg-white rounded-[2.5rem] p-5 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-green-100 transition-all duration-500 flex flex-col h-full relative">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-4">
              <Link to={`/product/${p.id}`}>
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="" />
              </Link>
              
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {p.isExpress && (
                  <div className="bg-yellow-400 text-slate-900 text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center shadow-lg">
                    <Zap className="w-2.5 h-2.5 mr-1 fill-current" /> Express
                  </div>
                )}
                {p.isMartOriginal && (
                  <div className="bg-slate-900 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center shadow-lg">
                    <Award className="w-2.5 h-2.5 mr-1 text-yellow-400" /> Original
                  </div>
                )}
                {p.isFlashSale && (
                  <div className="bg-red-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center shadow-lg animate-bounce">
                    <Flame className="w-2.5 h-2.5 mr-1 fill-current" /> Flash Sale
                  </div>
                )}
              </div>

              {p.stock < 100 && (
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest text-red-600">
                  Only {p.stock} Left
                </div>
              )}
            </div>
            
            <div className="flex-grow space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{p.category}</span>
                <div className="flex items-center text-yellow-500 text-[10px] font-black">
                  <Star className="w-3 h-3 fill-current mr-1" /> {p.rating}
                </div>
              </div>
              <Link to={`/product/${p.id}`} className="block text-lg font-black text-slate-900 leading-tight group-hover:text-green-600 transition truncate uppercase italic tracking-tight">
                {p.name}
              </Link>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{p.price}</span>
                {p.originalPrice && <span className="text-[10px] text-slate-300 line-through font-bold">₹{p.originalPrice}</span>}
              </div>
              <button 
                onClick={() => addToCart(p)}
                className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-green-600 transition shadow-lg active:scale-90"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const HomePage: React.FC = () => {
  const { products, addToCart, vendors } = useApp();

  const internalOriginals = useMemo(() => products.filter(p => p.isMartOriginal), [products]);
  const expressDeals = useMemo(() => products.filter(p => p.isExpress), [products]);
  const flashSaleDeals = useMemo(() => products.filter(p => p.isFlashSale), [products]);
  const freshFruits = useMemo(() => products.filter(p => p.category === 'Fruits'), [products]);
  const meatEssentials = useMemo(() => products.filter(p => p.category === 'Meat'), [products]);

  // Simulated flash sale end time (10 minutes from load)
  const flashSaleEndTime = useMemo(() => {
    const time = new Date();
    time.setMinutes(time.getMinutes() + 10);
    return time.toISOString();
  }, []);

  return (
    <div className="space-y-32 pb-40">
      {/* Immersive Quick-Commerce Hero */}
      <section className="relative h-[80vh] min-h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1604719312563-8912e9223c6a?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
          <div className="max-w-3xl space-y-10">
            <div className="inline-flex items-center bg-green-500/10 backdrop-blur-3xl border border-green-500/20 px-6 py-2.5 rounded-full text-green-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
              <Truck className="w-4 h-4 mr-3" /> Hyperlocal Logistics Enabled
            </div>
            
            <h1 className="text-7xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.8] uppercase italic">
              Fresh. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-400 to-green-600">Fast-Track.</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-medium text-slate-300 leading-relaxed max-w-xl opacity-80">
              The regional hub for everything essential. Delivered from local partners in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link to="/shop" className="bg-green-600 hover:bg-green-500 text-white px-12 py-7 rounded-3xl font-black text-xl transition-all shadow-2xl shadow-green-950/40 flex items-center justify-center group">
                Open Catalog <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition" />
              </Link>
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl flex items-center space-x-6">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white font-black text-lg uppercase leading-none mb-1">Elite Tiers</p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Earn Points Instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10-Min Rush Flash Sale Section */}
      <div className="relative pt-12">
        <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-transparent -z-10 h-[500px]"></div>
        <ProductScroller 
          title="10-Min Rush" 
          subtitle="Extreme price drops - act before they're gone"
          products={flashSaleDeals} 
          addToCart={addToCart}
          icon={<Flame className="w-6 h-6 text-red-600 fill-current animate-pulse" />}
          colorClass="text-red-600"
          extraHeader={<CountdownTimer endsAt={flashSaleEndTime} />}
        />
      </div>

      {/* Multi-Vendor Spotlight */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Local Spotlight</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Our network of verified producers</p>
          </div>
          <Link to="/vendors" className="text-green-600 font-black uppercase tracking-widest text-xs flex items-center hover:underline">
            View All Partners <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {vendors.map(v => (
            <Link 
              key={v.id} 
              to={`/vendor/${v.slug}`}
              className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 text-center group"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden mb-4 border-4 border-slate-50 shadow-inner group-hover:rotate-6 transition">
                <img src={v.logo} className="w-full h-full object-cover" alt="" />
              </div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{v.name}</h4>
              <div className="flex items-center justify-center text-[8px] font-black text-yellow-500 uppercase mt-2">
                <Star className="w-2.5 h-2.5 fill-current mr-1" /> {v.rating} Rating
              </div>
            </Link>
          ))}
          <div className="bg-slate-900 p-6 rounded-[3rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-green-600 transition-all">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-3">
               <Plus className="w-6 h-6 text-white" />
             </div>
             <p className="text-[10px] font-black text-white uppercase tracking-widest">Become A Vendor</p>
          </div>
        </div>
      </section>

      {/* Zepto-Style Express Lane */}
      <ProductScroller 
        title="Express Delivery" 
        subtitle="Lightning fast delivery on daily essentials"
        products={expressDeals} 
        addToCart={addToCart}
        icon={<Zap className="w-6 h-6 text-yellow-400 fill-current" />}
        colorClass="text-yellow-600"
      />

      {/* Mart Originals Showcase */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[5rem] p-12 md:p-24 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-green-500/5 -skew-x-12 translate-x-1/2 blur-3xl"></div>
           <div className="relative z-10 flex flex-col xl:flex-row gap-20">
              <div className="max-w-sm space-y-10">
                 <div className="flex items-center space-x-6">
                    <div className="bg-white p-5 rounded-3xl shadow-xl">
                       <Award className="w-10 h-10 text-slate-900" />
                    </div>
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none italic">Mart <br/> Originals</h2>
                 </div>
                 <p className="text-slate-400 text-xl font-medium leading-relaxed">
                   QuickMart's flagship private label. Directly sourced, quality tested, and delivered fresh in 10 minutes.
                 </p>
                 <Link to="/shop?vendor=internal" className="bg-white text-slate-900 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-green-400 transition shadow-xl">
                   Shop Originals
                 </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                 {internalOriginals.slice(0, 2).map(p => (
                   <div key={p.id} className="bg-white/5 border border-white/10 rounded-[4rem] p-8 flex items-center space-x-8 hover:bg-white/10 transition group">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 group-hover:scale-110 transition duration-700">
                         <img src={p.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="space-y-3">
                         <h4 className="text-white font-black text-2xl uppercase italic tracking-tight">{p.name}</h4>
                         <div className="flex items-center space-x-4">
                            <span className="text-3xl font-black text-green-400 tracking-tighter">₹{p.price}</span>
                            <button onClick={() => addToCart(p)} className="bg-white text-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-green-400 transition">
                               <ShoppingBag className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Fresh Aisles */}
      <ProductScroller 
        title="Farm Fresh Produce" 
        subtitle="Organic fruits & vegetables from local farms"
        products={freshFruits} 
        addToCart={addToCart}
        icon={<Leaf className="w-6 h-6 text-green-600" />}
        colorClass="text-green-600"
      />

      <ProductScroller 
        title="Butcher Hub" 
        subtitle="Fresh cuts delivered in chilled express bags"
        products={meatEssentials} 
        addToCart={addToCart}
        icon={<Beef className="w-6 h-6 text-red-600" />}
        colorClass="text-red-700"
      />

      {/* Subscription Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-emerald-600 rounded-[5rem] p-12 md:p-24 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mt-32"></div>
           <div className="relative z-10 space-y-10 max-w-xl">
              <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none">Subscribe <br/> & Save 15%</h2>
              <p className="text-emerald-100 text-xl font-medium leading-relaxed opacity-90 italic">
                Get your daily milk, bread, and fruits on auto-pilot. Unlock massive discounts and never worry about stock-outs again.
              </p>
              <div className="flex flex-wrap gap-4">
                 {['Daily', 'Weekly', 'Bi-Weekly'].map(freq => (
                   <span key={freq} className="bg-white/10 border border-white/20 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">{freq} Cycles</span>
                 ))}
              </div>
           </div>
           <Link to="/shop" className="relative z-10 bg-white text-emerald-600 px-16 py-8 rounded-[3rem] font-black text-2xl shadow-2xl hover:bg-slate-900 hover:text-white transition-all transform hover:-translate-y-2 uppercase tracking-tighter">
             Set Up Hub
           </Link>
        </div>
      </section>
    </div>
  );
};
