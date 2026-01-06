
import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { CATEGORIES } from '../constants';
import { ShoppingCart, Search, BarChart2, Heart, Star, Sparkles, Filter, ChevronDown, Store } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, vendors, addToCart, compareList, toggleCompare, wishlist, toggleWishlist } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const categoryFilter = searchParams.get('category') || 'All';
  const sortFilter = searchParams.get('sort') || 'newest';

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (categoryFilter !== 'All') result = result.filter(p => p.category === categoryFilter);
    if (searchTerm) result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (sortFilter === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortFilter === 'price-high') result.sort((a, b) => b.price - a.price);
    
    return result;
  }, [products, categoryFilter, searchTerm, sortFilter]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All' || !value) newParams.delete(key);
    else newParams.set(key, value);
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Floating Compare Widget */}
      {compareList.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] glass px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center space-x-6 border-green-200 animate-in slide-in-from-bottom-10">
          <div className="flex -space-x-3">
            {compareList.map(p => (
              <img key={p.id} src={p.image} className="w-12 h-12 rounded-2xl border-4 border-white object-cover shadow-lg" alt="" />
            ))}
          </div>
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{compareList.length} Selected</p>
          <button 
            onClick={() => navigate('/compare')}
            className="bg-green-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition shadow-xl shadow-green-100"
          >
            Compare Now
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="mb-16 text-center">
        <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-6 uppercase">Market Catalog</h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">Browse local essentials directly from verified regional producers.</p>
      </div>

      {/* Advanced Filter Header */}
      <div className="mb-12 space-y-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products, brands, ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-6 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm focus:border-green-500 focus:ring-0 transition-all text-lg font-medium outline-none"
            />
          </div>
          <div className="flex space-x-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-48">
              <select 
                value={sortFilter}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="w-full bg-white border-2 border-slate-100 rounded-[2.5rem] py-5 px-8 appearance-none font-black text-[10px] uppercase tracking-widest outline-none focus:border-green-500"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Pill Scroller */}
        <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide py-2 px-1">
          <button 
            onClick={() => updateFilter('category', 'All')}
            className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${categoryFilter === 'All' ? 'bg-green-600 text-white shadow-xl shadow-green-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-green-500 hover:text-green-600'}`}
          >
            All Items
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => updateFilter('category', cat)}
              className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-green-600 text-white shadow-xl shadow-green-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-green-500 hover:text-green-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredProducts.map(product => {
          const isInCompare = compareList.find(p => p.id === product.id);
          const isWished = wishlist.includes(product.id);
          const vendor = vendors.find(v => v.id === product.vendorId);
          return (
            <div key={product.id} className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:border-green-100 hover:shadow-2xl transition-all duration-700 flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <Link to={`/product/${product.id}`} className="block h-full">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000 ease-out" />
                </Link>
                
                {/* Vendor Micro-Badge */}
                {vendor && (
                  <Link to={`/vendor/${vendor.slug}`} className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl hover:bg-green-600 hover:text-white transition group/vendor">
                    <Store className="w-3 h-3 mr-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest">{vendor.name}</span>
                  </Link>
                )}

                <div className="absolute top-6 right-6 flex flex-col space-y-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                  <button onClick={() => toggleWishlist(product.id)} className={`p-4 rounded-2xl shadow-xl backdrop-blur-md transition-all ${isWished ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-400 hover:text-red-500'}`}>
                    <Heart className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={() => toggleCompare(product)} className={`p-4 rounded-2xl shadow-xl backdrop-blur-md transition-all ${isInCompare ? 'bg-green-600 text-white' : 'bg-white/90 text-slate-400 hover:text-green-600'}`}>
                    <BarChart2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {product.isOffer && <span className="bg-red-500 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">Price Drop</span>}
                  {product.isNew && <span className="bg-blue-600 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">New In</span>}
                </div>
              </div>

              <div className="p-10 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-yellow-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[10px] font-black text-slate-400">{product.rating}</span>
                  </div>
                  <span className="text-[9px] font-black text-green-600 uppercase tracking-[0.2em]">{product.category}</span>
                </div>
                
                <Link to={`/product/${product.id}`} className="text-xl font-black text-slate-900 group-hover:text-green-600 transition tracking-tight mb-8 leading-tight">
                  {product.name}
                </Link>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{product.price}</span>
                  </div>
                  <button 
                    disabled={product.stock === 0}
                    onClick={() => addToCart(product)}
                    className="bg-green-600 text-white w-14 h-14 rounded-[1.5rem] flex items-center justify-center hover:bg-slate-900 shadow-xl transition-all"
                  >
                    <ShoppingCart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
