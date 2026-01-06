
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Store, Star, MapPin, CheckCircle2, ChevronRight, Search, Filter } from 'lucide-react';
import { CATEGORIES } from '../constants';

export const VendorsPage: React.FC = () => {
  const { vendors } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || v.categories.includes(activeCategory as any);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic">Local Producers</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Discover the passionate vendors behind your daily essentials. Directly from their hands to your home.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="relative flex-1 w-full max-w-lg">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Find a seller..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold"
          />
        </div>
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide w-full lg:w-auto">
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-green-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredVendors.map(vendor => (
          <div key={vendor.id} className="group bg-white rounded-[4rem] overflow-hidden border border-slate-100 hover:border-green-200 transition-all duration-700 shadow-sm hover:shadow-2xl flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img src={vendor.banner} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-8 flex items-center space-x-4">
                <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-xl bg-white">
                  <img src={vendor.logo} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-white font-black text-xl tracking-tight uppercase">{vendor.name}</h3>
                  <div className="flex items-center text-green-400">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Locally Verified</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-10 flex-grow flex flex-col">
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                {vendor.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3 text-slate-400">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{vendor.location}</span>
                </div>
                <div className="flex items-center justify-end space-x-2 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-[11px] font-black text-slate-900">{vendor.rating} / 5.0</span>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {vendor.categories.slice(0, 3).map(cat => (
                    <div key={cat} className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[8px] font-black text-white" title={cat}>
                      {cat[0]}
                    </div>
                  ))}
                </div>
                <Link 
                  to={`/vendor/${vendor.slug}`} 
                  className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all flex items-center group/link shadow-xl"
                >
                  Visit Store <ChevronRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
