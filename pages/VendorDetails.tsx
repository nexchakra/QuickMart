
import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Star, MapPin, CheckCircle2, ChevronLeft, ShoppingCart, Award, Clock, Heart } from 'lucide-react';

export const VendorDetails: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { vendors, products, addToCart } = useApp();

  const vendor = useMemo(() => vendors.find(v => v.slug === slug), [vendors, slug]);
  const vendorProducts = useMemo(() => 
    products.filter(p => p.vendorId === vendor?.id), 
  [products, vendor]);

  if (!vendor) return null;

  return (
    <div className="space-y-16 pb-24">
      {/* Immersive Vendor Header */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <img src={vendor.banner} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 w-full relative z-10 pb-16">
          <button 
            onClick={() => navigate('/vendors')}
            className="flex items-center text-white/60 hover:text-white mb-10 transition font-black uppercase text-[10px] tracking-widest"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> All Producers
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="flex items-center space-x-8">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] overflow-hidden border-[8px] border-white/10 backdrop-blur-xl shadow-2xl bg-white/20 p-2">
                <img src={vendor.logo} className="w-full h-full object-cover rounded-[2.5rem]" alt="" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">{vendor.name}</h1>
                  {vendor.isVerified && (
                    <div className="bg-green-500 text-slate-900 p-1.5 rounded-full shadow-lg">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center text-white/80 font-bold text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-green-400" /> {vendor.location}
                  </div>
                  <div className="flex items-center text-yellow-400 font-bold text-sm">
                    <Star className="w-4 h-4 mr-2 fill-current" /> {vendor.rating} Rating
                  </div>
                  <div className="flex items-center text-white/80 font-bold text-sm uppercase tracking-widest">
                    Joined {new Date(vendor.joinedDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex items-center space-x-6">
             <div className="bg-green-50 p-4 rounded-2xl">
               <Award className="w-8 h-8 text-green-600" />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Status</p>
               <h4 className="text-xl font-black text-slate-900 uppercase">{vendor.isVerified ? 'Elite Producer' : 'Local Artisan'}</h4>
             </div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="bg-blue-50 p-4 rounded-2xl">
               <Clock className="w-8 h-8 text-blue-600" />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Rate</p>
               <h4 className="text-xl font-black text-slate-900 uppercase">Under 15 Mins</h4>
             </div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="bg-orange-50 p-4 rounded-2xl">
               <ShoppingCart className="w-8 h-8 text-orange-600" />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Variety</p>
               <h4 className="text-xl font-black text-slate-900 uppercase">{vendorProducts.length} Items Listed</h4>
             </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* About Sidebar */}
        <div className="lg:col-span-1 space-y-10">
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-xl">
             <h3 className="text-xl font-black uppercase tracking-tight mb-6">Our Story</h3>
             <p className="text-slate-400 text-sm leading-relaxed italic mb-8">
               "{vendor.description}"
             </p>
             <div className="space-y-4">
               {vendor.categories.map(cat => (
                 <div key={cat} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-3 last:border-0">
                    <span>{cat}</span>
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">From the Source</h2>
             <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span>Sort by:</span>
               <select className="bg-transparent border-none focus:ring-0 font-black text-slate-900">
                 <option>Popular</option>
                 <option>Newest</option>
                 <option>Price</option>
               </select>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendorProducts.map(product => (
              <div key={product.id} className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:border-green-100 hover:shadow-2xl transition-all duration-700 flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt="" />
                  </Link>
                  <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition translate-x-4 group-hover:translate-x-0">
                    <Heart className="w-4 h-4 text-slate-400 hover:text-red-500 transition" />
                  </button>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <span className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-2">{product.category}</span>
                  <Link to={`/product/${product.id}`} className="text-lg font-black text-slate-900 hover:text-green-600 transition leading-tight mb-6 line-clamp-2">
                    {product.name}
                  </Link>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{product.price}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-green-600 transition shadow-xl"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {vendorProducts.length === 0 && (
              <div className="col-span-full py-24 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                 <p className="text-slate-400 font-bold uppercase tracking-widest">Store catalog is currently resting</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
