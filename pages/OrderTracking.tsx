
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  HelpCircle,
  Navigation,
  Compass,
  Wind
} from 'lucide-react';

export const OrderTracking: React.FC = () => {
  const { orderId } = useParams();
  const { orders } = useApp();
  const navigate = useNavigate();
  
  // Advanced: Animation state for map
  const [mapPos, setMapPos] = useState({ x: 20, y: 80 });

  useEffect(() => {
    const timer = setInterval(() => {
      setMapPos(prev => ({
        x: Math.min(prev.x + 1, 85),
        y: Math.max(prev.y - 0.8, 20)
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const order = useMemo(() => orders.find(o => o.id === orderId), [orders, orderId]);

  if (!order) return null;

  const statusStages = ['Pending', 'Shipped', 'Delivered'];
  const currentStageIndex = statusStages.indexOf(order.status);
  
  const estimatedDelivery = useMemo(() => {
    const orderDate = new Date(order.date);
    if (order.status === 'Delivered') return `Delivered on ${orderDate.toLocaleDateString()}`;
    if (order.status === 'Cancelled') return 'Order Cancelled';
    const est = new Date(orderDate);
    if (order.status === 'Pending') est.setHours(est.getHours() + 24);
    if (order.status === 'Shipped') est.setHours(est.getHours() + 2);
    return `Arrival: ${est.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }, [order]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <button 
          onClick={() => navigate('/profile')} 
          className="flex items-center text-slate-400 hover:text-green-600 font-black uppercase text-[10px] tracking-widest transition"
        >
          <ArrowLeft className="w-4 h-4 mr-3" /> Back to Profile
        </button>
        <div className="flex items-center space-x-6">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Status</p>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">{order.status}</h4>
           </div>
           <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-xl shadow-green-50">
              <Navigation className="w-6 h-6 animate-pulse" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Visual Map Column */}
        <div className="lg:col-span-2 space-y-12">
           <div className="bg-slate-900 h-[500px] rounded-[5rem] relative overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-slate-100">
              {/* SVG Map Simulation */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                 <path d="M10 90 Q 30 10, 90 20" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
                 <path d="M0 50 L 100 50 M 50 0 L 50 100" stroke="white" strokeWidth="0.1" fill="none" />
                 <circle cx="20" cy="80" r="2" fill="#16a34a" />
                 <circle cx="85" cy="22" r="2" fill="#3b82f6" />
              </svg>
              
              {/* Delivery Node */}
              <div 
                className="absolute w-16 h-16 transition-all duration-1000 ease-linear flex items-center justify-center"
                style={{ left: `${mapPos.x}%`, top: `${mapPos.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                 <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                 <div className="relative bg-white p-3 rounded-2xl shadow-2xl">
                    <Truck className="w-6 h-6 text-green-600" />
                 </div>
              </div>

              {/* Waypoints */}
              <div className="absolute bottom-12 left-12 bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-center space-x-4">
                 <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center">
                    <Compass className="w-5 h-5 text-white" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hub Proximity</p>
                    <p className="text-white font-black">District Sector 4</p>
                 </div>
              </div>
           </div>

           {/* Progress Line */}
           <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
              <div className="relative flex justify-between items-center w-full px-4">
                <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-100 -translate-y-1/2 rounded-full"></div>
                <div 
                  className="absolute top-1/2 left-0 h-2 bg-green-500 -translate-y-1/2 transition-all duration-1000 ease-in-out rounded-full"
                  style={{ width: `${(currentStageIndex / (statusStages.length - 1)) * 100}%` }}
                ></div>

                {statusStages.map((stage, index) => {
                  const isActive = index <= currentStageIndex;
                  return (
                    <div key={stage} className="relative z-10 flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-slate-900 text-green-400 shadow-2xl scale-110' : 'bg-white text-slate-200 border-4 border-slate-50'}`}>
                        {stage === 'Pending' && <Clock className="w-6 h-6" />}
                        {stage === 'Shipped' && <Truck className="w-6 h-6" />}
                        {stage === 'Delivered' && <CheckCircle2 className="w-6 h-6" />}
                      </div>
                      <span className={`mt-5 text-[11px] font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>{stage}</span>
                    </div>
                  );
                })}
              </div>
           </div>
        </div>

        {/* Sidebar Order Details */}
        <div className="space-y-10">
           <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-50">
                 <Wind className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic mb-3">Hyper-Speed Delivery</h3>
              <p className="text-slate-400 font-medium leading-relaxed mb-8">Your order is navigating our premium local route.</p>
              <div className="w-full pt-8 border-t border-slate-50 flex justify-between">
                 <div className="text-left">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Arrival</p>
                    <p className="text-lg font-black text-slate-900">{estimatedDelivery}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Carrier</p>
                    <p className="text-lg font-black text-slate-900">SwiftNode #42</p>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 text-white p-10 rounded-[4rem] shadow-2xl space-y-10">
              <div className="flex items-center space-x-6 border-b border-white/10 pb-8">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Package className="w-7 h-7 text-green-400" />
                 </div>
                 <h4 className="text-2xl font-black uppercase tracking-tight italic">Batch Info</h4>
              </div>
              <div className="space-y-6">
                 {order.items.map(item => (
                   <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex items-center space-x-4">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-green-400">
                            {item.quantity}x
                         </div>
                         <span className="text-sm font-black text-slate-300 group-hover:text-white transition uppercase truncate w-32">{item.name}</span>
                      </div>
                      <span className="text-lg font-black tracking-tighter italic">₹{item.price * item.quantity}</span>
                   </div>
                 ))}
              </div>
              <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Charged</span>
                 <span className="text-4xl font-black text-green-400 tracking-tighter">₹{order.total}</span>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-100">
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center">
                 <MapPin className="w-5 h-5 mr-3 text-green-600" /> Destination
              </h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6">
                 "{order.address}"
              </p>
              <button className="w-full mt-10 py-5 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center space-x-3">
                 <Phone className="w-4 h-4" />
                 <span>Contact Support Agent</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
