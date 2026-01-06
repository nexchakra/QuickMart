
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { 
  CreditCard, 
  Wallet, 
  MapPin, 
  CheckCircle2, 
  Smartphone, 
  Globe, 
  Landmark, 
  Phone, 
  MessageCircle, 
  Mail, 
  BellRing, 
  Truck,
  Info,
  Navigation,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

type PaymentMethod = 'COD' | 'Online' | 'PayPal' | 'Stripe' | 'GooglePay';

export const CheckoutPage: React.FC = () => {
  const { cart, currentUser, placeOrder } = useApp();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState(currentUser?.addresses[0] || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  const [emailAddress, setEmailAddress] = useState(currentUser?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  // --- Delivery Logic ---
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  
  const isRemote = useMemo(() => {
    const lowerAddress = address.toLowerCase();
    return lowerAddress.includes('outskirts') || lowerAddress.includes('rural') || lowerAddress.includes('remote');
  }, [address]);

  const deliveryBreakdown = useMemo(() => {
    if (subtotal >= 500) return { base: 0, remote: 0, total: 0 };
    
    const base = 50;
    const remote = isRemote ? 25 : 0;
    return {
      base,
      remote,
      total: base + remote
    };
  }, [subtotal, isRemote]);

  const deliveryCharges = deliveryBreakdown.total;
  const total = subtotal + deliveryCharges;
  const progressPercent = Math.min((subtotal / 500) * 100, 100);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return alert('Please provide an address');
    if (!phoneNumber) return alert('Please provide a contact number for WhatsApp updates');
    if (!emailAddress) return alert('Please provide an email for your receipt');
    
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    
    const orderData = {
      userId: currentUser?.id || 'guest',
      items: cart,
      total,
      status: 'Pending' as const,
      paymentMethod,
      address,
      phone: phoneNumber,
      email: emailAddress,
    };

    placeOrder(orderData);
    setLastOrder(orderData);

    setIsProcessing(false);
    setIsSuccess(true);
  };

  const getWhatsAppLink = (orderId: string = 'ORD-NEW') => {
    const itemSummary = cart.map(i => `• ${i.name} (x${i.quantity})`).join('%0A');
    const message = `*QuickMart Order Confirmation*%0A%0AOrder ID: #${orderId}%0ATotal: ₹${total}%0AItems:%0A${itemSummary}%0A%0A_Your order is being processed! Track it in the app._`;
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100">
          <CheckCircle2 className="w-14 h-14 text-green-600" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight uppercase italic text-slate-900">Order Confirmed!</h2>
          <p className="text-slate-500 font-medium text-lg">
            Freshness is on its way. We've notified you via:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Email Sent</p>
            <p className="text-sm font-bold text-slate-900 truncate w-full px-4">{emailAddress}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">WhatsApp Sent</p>
            <p className="text-sm font-bold text-slate-900">+{phoneNumber}</p>
          </div>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          <a 
            href={getWhatsAppLink()} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-3 w-full bg-[#25D366] text-white py-6 rounded-[2.5rem] font-black text-xl hover:shadow-[0_20px_40px_-10px_rgba(37,211,102,0.4)] transition-all transform hover:-translate-y-1"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Open WhatsApp Details</span>
          </a>
          
          <button 
            onClick={() => navigate('/profile')} 
            className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black text-xl hover:bg-slate-800 transition shadow-xl"
          >
            View My Orders
          </button>
        </div>
        
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
          Order ID: {lastOrder?.id || 'Generated'} • Estimated Delivery: 30-45 Mins
        </p>
      </div>
    );
  }

  const paymentOptions: { id: PaymentMethod, label: string, sub: string, icon: React.ReactNode, bgColor: string, textColor: string }[] = [
    { 
      id: 'COD', 
      label: 'Cash', 
      sub: 'On Delivery', 
      icon: <Wallet className="w-6 h-6" />, 
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    { 
      id: 'PayPal', 
      label: 'PayPal', 
      sub: 'Safe Payment', 
      icon: <Globe className="w-6 h-6" />, 
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    { 
      id: 'Stripe', 
      label: 'Stripe', 
      sub: 'Credit / Debit', 
      icon: <CreditCard className="w-6 h-6" />, 
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
    { 
      id: 'GooglePay', 
      label: 'Google Pay', 
      sub: 'Fast & Easy', 
      icon: <Smartphone className="w-6 h-6" />, 
      bgColor: 'bg-gray-200',
      textColor: 'text-gray-800'
    },
    { 
      id: 'Online', 
      label: 'Net Banking', 
      sub: 'Direct Transfer', 
      icon: <Landmark className="w-6 h-6" />, 
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-6xl font-black mb-16 text-center tracking-tighter uppercase italic text-slate-900">Checkout</h1>
      
      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-10">
          {/* Delivery Progress Widget */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Delivery Estimator</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hyperlocal shipping logic</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${deliveryCharges === 0 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  {deliveryCharges === 0 ? 'FREE' : 'PAID'}
                </span>
              </div>
            </div>

            <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                {deliveryCharges === 0 ? (
                  <span className="text-green-600 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> You unlocked free delivery!</span>
                ) : (
                  <span>Add ₹{Math.max(0, 500 - subtotal)} more for free delivery</span>
                )}
              </p>
              <div className="flex items-center space-x-2 text-slate-300">
                <Info className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">T&C Apply</span>
              </div>
            </div>
          </div>

          {/* Contact & Notifications */}
          <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h2 className="text-xl font-black mb-8 flex items-center tracking-tight uppercase">
              <BellRing className="w-6 h-6 mr-3 text-green-600" /> Notification Info
            </h2>
            <div className="space-y-8">
              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">WhatsApp Number</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">+</span>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="91 98765 43210"
                    className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-green-500/10 focus:bg-white transition text-lg font-black tracking-tight outline-none"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-green-500/10 focus:bg-white transition text-lg font-black tracking-tight outline-none"
                  />
                </div>
                <p className="mt-3 text-[10px] text-blue-600 font-bold uppercase tracking-widest flex items-center">
                  <Mail className="w-3 h-3 mr-1.5" /> Receipt & invoice will be emailed
                </p>
              </div>
            </div>
          </section>

          {/* Delivery Address */}
          <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black flex items-center tracking-tight uppercase">
                <MapPin className="w-6 h-6 mr-3 text-green-600" /> Delivery Address
              </h2>
              <button 
                type="button"
                onClick={() => {
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      setAddress(prev => prev + ` (Geo: ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
                    });
                  }
                }}
                className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition"
              >
                <Navigation className="w-3 h-3" />
                <span>Locate Me</span>
              </button>
            </div>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full home or office address. Type 'Outskirts' or 'Remote' for logistics surcharge simulation."
              className="w-full h-40 p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-green-500/10 focus:bg-white transition text-lg font-medium outline-none resize-none"
            />
            {isRemote && (
              <div className="mt-4 flex items-start space-x-3 bg-orange-50 p-4 rounded-2xl border border-orange-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-800">Remote Zone Detected</p>
                  <p className="text-[9px] font-medium text-orange-600 uppercase mt-1">A small logistics surcharge of ₹25 has been applied to this address.</p>
                </div>
              </div>
            )}
          </section>

          {/* Payment Method */}
          <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h2 className="text-xl font-black mb-8 flex items-center tracking-tight uppercase">
              <CreditCard className="w-6 h-6 mr-3 text-green-600" /> Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`p-6 rounded-[2.5rem] border-2 transition-all text-left flex items-center space-x-4 ${
                    paymentMethod === opt.id 
                    ? 'border-green-600 bg-green-50 ring-4 ring-green-500/10 shadow-lg' 
                    : 'border-slate-50 hover:border-slate-200 bg-slate-25'
                  }`}
                >
                  <div className={`p-4 rounded-2xl ${opt.bgColor} ${opt.textColor} shadow-sm`}>
                    {opt.icon}
                  </div>
                  <div className="flex-grow">
                    <p className="font-black text-lg tracking-tight uppercase leading-none mb-1">{opt.label}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{opt.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl h-fit sticky top-24">
          <h2 className="text-3xl font-black pb-8 border-b border-white/10 tracking-tight uppercase italic">Order Summary</h2>
          <div className="max-h-80 overflow-y-auto my-10 space-y-6 scrollbar-hide">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center group">
                <div className="flex items-center">
                  <div className="bg-white/10 text-white w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black mr-4 group-hover:bg-green-500 group-hover:text-black transition">
                    {item.quantity}x
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">{item.category}</span>
                    <span className="text-white font-black group-hover:text-green-400 transition tracking-tight">{item.name}</span>
                  </div>
                </div>
                <span className="font-black tracking-tight text-xl">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Detailed Logistics Breakdown */}
          <div className="space-y-4 pt-8 border-t border-white/10">
            <div className="flex justify-between text-slate-400 font-black uppercase text-[10px] tracking-widest">
              <span>Subtotal</span>
              <span className="text-white">₹{subtotal}</span>
            </div>
            
            <div className="py-4 space-y-3 bg-white/5 rounded-3xl px-6">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                <div className="flex items-center">
                  <Truck className="w-3 h-3 mr-2 text-green-500" />
                  <span>Base Delivery Fee</span>
                </div>
                <span className={subtotal >= 500 ? 'line-through' : 'text-white'}>
                  {subtotal >= 500 ? '₹50' : '₹50'}
                </span>
              </div>
              
              {isRemote && subtotal < 500 && (
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-orange-400">
                  <div className="flex items-center">
                    <HelpCircle className="w-3 h-3 mr-2" />
                    <span>Remote Surcharge</span>
                  </div>
                  <span>+₹25</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Delivery</span>
                <span className={`text-sm font-black ${deliveryCharges === 0 ? 'text-green-400 animate-pulse' : 'text-white'}`}>
                  {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-5xl font-black pt-8 text-green-400 tracking-tighter italic">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full bg-green-500 text-slate-900 py-8 rounded-[3rem] font-black text-2xl mt-12 hover:bg-white transition-all flex items-center justify-center shadow-[0_24px_48px_-12px_rgba(22,163,74,0.4)] ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''} uppercase tracking-tight`}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-3">
                <svg className="animate-spin h-8 w-8 text-slate-900" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              `Pay ₹${total}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
