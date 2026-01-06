import React, { useMemo, useState } from 'react';
import { useApp } from '../store/AppContext';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, ComposedChart, Area, PieChart, Pie, Cell, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Package, DollarSign, ShoppingCart, Users, TrendingUp, AlertTriangle, 
  Activity, Briefcase, CheckCircle2, PieChart as PieIcon, BarChart3, 
  ArrowUpRight, ArrowDownRight, Target, LayoutDashboard, Globe, 
  Zap, Calendar, Map, Layers, RefreshCw, Download, Filter, BrainCircuit, Store,
  Star, Plus
} from 'lucide-react';

type DashboardTab = 'Overview' | 'Sales' | 'Vendors' | 'Logistics';

export const AdminDashboard: React.FC = () => {
  const { orders, products, users, vendors } = useApp();
  const [activeTab, setActiveTab] = useState<DashboardTab>('Overview');
  const [timeframe, setTimeframe] = useState('7D');

  // --- Analytical Computations ---
  const totalSales = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const avgOrderValue = useMemo(() => orders.length ? totalSales / orders.length : 0, [orders, totalSales]);
  
  const vendorPerformance = useMemo(() => {
    return vendors.map(v => {
      const vendorOrders = orders.filter(o => o.items.some(i => i.vendorId === v.id));
      const revenue = vendorOrders.reduce((sum, o) => sum + o.total, 0);
      return { 
        name: v.name, 
        revenue, 
        count: vendorOrders.length 
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [orders, vendors]);

  const StatCard = ({ title, value, subValue, trend, icon: Icon, color }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <div className={`flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase ${trend > 0 ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}>
            {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
      <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">{subValue}</p>
    </div>
  );

  return (
    <div className="p-8 space-y-10 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-900 p-2 rounded-xl">
              <BrainCircuit className="w-6 h-6 text-green-400" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Mart Intelligence</h1>
          </div>
          <p className="text-gray-400 font-bold tracking-widest text-[9px] uppercase">Hyperlocal Multi-Vendor Engine • v3.0</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <nav className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {(['Overview', 'Sales', 'Vendors', 'Logistics'] as DashboardTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <button className="bg-green-600 text-white p-4 rounded-2xl hover:bg-green-700 transition">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {activeTab === 'Overview' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value={`₹${totalSales.toLocaleString()}`} subValue="Across all vendors" trend={12.4} icon={DollarSign} color="bg-green-500" />
            <StatCard title="Active Vendors" value={vendors.length} subValue="4 Onboarding" trend={2} icon={Store} color="bg-blue-500" />
            <StatCard title="Avg Basket" value={`₹${avgOrderValue.toFixed(0)}`} subValue="Express: 15 mins" trend={-3.2} icon={ShoppingCart} color="bg-purple-500" />
            <StatCard title="Partner Payouts" value={`₹${(totalSales * 0.85).toLocaleString()}`} subValue="Scheduled for Monday" icon={Activity} color="bg-orange-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Vendor Performance Analysis</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Revenue</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Orders</span>
                  </div>
                </div>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vendorPerformance} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    {/* Fix: Removed invalid SVG property 'textTransform' from tick object and added tickFormatter for uppercase styling */}
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} 
                      tickFormatter={(value) => value.toUpperCase()}
                      width={120} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 p-6 rounded-[2rem] shadow-2xl border border-white/10 animate-in fade-in zoom-in-95">
                              <p className="text-[10px] font-black uppercase text-green-500 tracking-[0.2em] mb-3">{label}</p>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between space-x-8">
                                  <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Revenue</span>
                                  <span className="text-white font-black text-sm">₹{payload[0].value.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between space-x-8">
                                  <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Orders</span>
                                  <span className="text-blue-400 font-black text-sm">{payload[1].value} Total</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{value}</span>}
                    />
                    <Bar 
                      dataKey="revenue" 
                      name="Revenue (₹)" 
                      stackId="a" 
                      fill="#16a34a" 
                      radius={[0, 0, 0, 0]} 
                      barSize={24}
                    />
                    <Bar 
                      dataKey="count" 
                      name="Order Volume" 
                      stackId="a" 
                      fill="#2563eb" 
                      radius={[0, 8, 8, 0]} 
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Express Volume</h2>
              <div className="space-y-6">
                {vendorPerformance.slice(0, 4).map((v, i) => (
                  <div key={v.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-green-100 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-green-500 transition-colors italic">#{i+1}</div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase text-slate-700 tracking-tight">{v.name}</span>
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{v.count} Orders</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-green-600 tracking-tighter italic">₹{v.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.map(v => (
            <div key={v.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-6 group hover:border-green-500 transition-all">
              <div className="flex items-center justify-between">
                <img src={v.logo} className="w-16 h-16 rounded-2xl border border-slate-100 object-cover" alt="" />
                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${v.isVerified ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                  {v.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{v.name}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{v.location}</p>
              </div>
              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                 <div className="flex items-center text-yellow-500 text-xs font-black">
                   <Star className="w-4 h-4 mr-1 fill-current" /> {v.rating}
                 </div>
                 <Link to="/admin/vendors" className="text-xs font-black uppercase text-blue-600 hover:underline">Manage Partner</Link>
              </div>
            </div>
          ))}
          <Link to="/admin/vendors" className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-10 text-center cursor-pointer hover:bg-white hover:border-green-500 transition-all group">
             <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-sm">
               <Plus className="w-8 h-8 text-slate-300 group-hover:text-green-600" />
             </div>
             <h4 className="text-lg font-black text-slate-400 uppercase tracking-tight group-hover:text-green-600">Onboard New Vendor</h4>
             <p className="text-[10px] font-black text-slate-300 uppercase mt-2">Scale the regional hub network</p>
          </Link>
        </div>
      )}
    </div>
  );
};