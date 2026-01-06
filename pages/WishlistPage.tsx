
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  Star, 
  Zap, 
  Award, 
  ShoppingCart,
  ChevronRight
} from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart } = useApp();
  const navigate = useNavigate();

  const wishedProducts = products.filter(p => wishlist.includes(p.id));

  if (wishedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="w-32 h-32 bg-slate-100 rounded-[3rem] flex items-center justify-center mx-auto mb-10 animate-float">
          <Heart className="w-16 h-16 text-slate-300" />
        </div>
        <h2 className="text-5xl font-black mb-6 tracking-tighter text-slate-900 uppercase">Your wishlist is empty</h2>
        <p className="text-slate-500 font-medium mb-12 text-lg max-w-sm mx-auto">Save items you love for later. They'll be waiting here for your next grocery run.</p>
        <Link to="/shop" className="inline-block bg-green-600 text-white px-12 py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-green-700 transition shadow-2xl shadow-green-100">
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-16">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-slate-400 hover:text-green-600 font-black uppercase text-[10px] tracking-widest transition mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-3" /> Back
          </button>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 uppercase italic">Saved <span className="text-slate-300">Items</span></h1>
        </div>
        <div className="hidden md:flex items-center space-x-4 bg-white px-8 py-4 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Total Wishlist</p>
            <p className="text-xl font-black text-slate-900 leading-none mt-1">{wishedProducts.length} Items</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {wishedProducts.map(product => (
          <div key={product.id} className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:border-red-100 hover:shadow-2xl transition-all duration-700 flex flex-col relative">
            <div className="relative aspect-square overflow-hidden bg-slate-50">
              <Link to={`/product/${product.id}`} className="block h-full">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000 ease-out" />
              </Link>
              
              <div className="absolute top-6 right-6">
                <button 
                  onClick={() => toggleWishlist(product.id)} 
                  className="p-4 rounded-2xl shadow-xl bg-red-500 text-white transition-all transform hover:scale-110"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>

              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.isExpress && (
                  <div className="bg-yellow-400 text-slate-900 text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center shadow-lg">
                    <Zap className="w-2.5 h-2.5 mr-1 fill-current" /> Express
                  </div>
                )}
                {product.isMartOriginal && (
                  <div className="bg-slate-900 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center shadow-lg">
                    <Award className="w-2.5 h-2.5 mr-1 text-yellow-400" /> Original
                  </div>
                )}
              </div>
            </div>

            <div className="p-10 flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-yellow-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[10px] font-black text-slate-400">{product.rating}</span>
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{product.category}</span>
              </div>
              
              <Link to={`/product/${product.id}`} className="text-xl font-black text-slate-900 hover:text-green-600 transition tracking-tight mb-8 leading-tight uppercase italic">
                {product.name}
              </Link>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{product.price}</span>
                  {product.originalPrice && <span className="text-[10px] text-slate-300 line-through font-bold">₹{product.originalPrice}</span>}
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-green-600 text-white w-14 h-14 rounded-[1.5rem] flex items-center justify-center hover:bg-slate-900 shadow-xl transition-all"
                >
                  <ShoppingCart className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
