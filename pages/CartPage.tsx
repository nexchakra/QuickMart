
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck, CreditCard } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryThreshold = 500;
  const isFreeDelivery = subtotal >= deliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : 50;
  const total = subtotal + deliveryFee;
  const progressPercent = Math.min((subtotal / deliveryThreshold) * 100, 100);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="w-32 h-32 bg-slate-100 rounded-[3rem] flex items-center justify-center mx-auto mb-10 animate-float">
          <ShoppingBag className="w-16 h-16 text-slate-300" />
        </div>
        <h2 className="text-5xl font-black mb-6 tracking-tighter text-slate-900 uppercase">Your basket is empty</h2>
        <p className="text-slate-500 font-medium mb-12 text-lg max-w-sm mx-auto">It seems you haven't added any fresh items to your cart yet.</p>
        <Link to="/shop" className="inline-block bg-green-600 text-white px-12 py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-green-700 transition shadow-2xl shadow-green-200">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:col-span-2 flex-grow">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">Cart <span className="text-slate-300 font-medium">({cart.length})</span></h1>
            <button onClick={() => navigate('/shop')} className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] hover:underline">Continue Shopping</button>
          </div>

          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 group">
                <div className="w-32 h-32 rounded-[2rem] overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100 p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-[1.5rem]" />
                </div>
                <div className="sm:ml-10 flex-grow text-center sm:text-left mt-6 sm:mt-0">
                  <p className="text-[9px] text-green-600 font-black uppercase tracking-[0.2em] mb-1">{item.category}</p>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-green-600 transition">{item.name}</h3>
                  <div className="flex items-center justify-center sm:justify-start space-x-6">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{item.price}</span>
                    <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100">
                      <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="text-xl font-black text-slate-300 hover:text-green-600 transition w-8">-</button>
                      <span className="mx-4 font-black text-lg text-slate-900 w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="text-xl font-black text-slate-300 hover:text-green-600 transition w-8">+</button>
                    </div>
                  </div>
                </div>
                <div className="mt-8 sm:mt-0 sm:ml-8">
                  <button onClick={() => removeFromCart(item.id)} className="w-14 h-14 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[450px] space-y-8">
          {/* Delivery Progress Widget */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Shipping Estimate</p>
                <h4 className="text-xl font-black text-slate-900">{isFreeDelivery ? 'Free Shipping Active!' : `₹${deliveryThreshold - subtotal} away from Free`}</h4>
              </div>
            </div>
            
            <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">₹0</span>
              <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Free at ₹500</span>
            </div>
          </div>

          {/* Checkout Card */}
          <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl space-y-10 relative overflow-hidden">
            <div className="relative z-10 space-y-10">
              <h2 className="text-3xl font-black tracking-tight border-b border-white/10 pb-8 uppercase">Order Details</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Cart Subtotal</span>
                  <span className="text-xl font-black">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Delivery Fee</span>
                  <span className={`text-xl font-black ${isFreeDelivery ? 'text-green-400' : ''}`}>
                    {isFreeDelivery ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-2xl font-black tracking-tighter uppercase">Grand Total</span>
                  <span className="text-5xl font-black text-green-400 tracking-tighter">₹{total}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-green-500 text-slate-900 py-6 rounded-[2.5rem] font-black text-xl hover:bg-white transition-all flex items-center justify-center group shadow-xl shadow-green-900/50"
              >
                Proceed to Pay <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition" />
              </button>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center space-x-3 text-[10px] font-black uppercase text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Secure Billing</span>
                </div>
                <div className="flex items-center space-x-3 text-[10px] font-black uppercase text-slate-400">
                  <CreditCard className="w-4 h-4 text-green-500" />
                  <span>Encrypted Pay</span>
                </div>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
