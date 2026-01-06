
import React, { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  RefreshCcw,
  ShoppingBag,
  MoreVertical,
  ExternalLink,
  // Added MapPin to imports
  MapPin
} from 'lucide-react';
import { OrderStatus, Order } from '../types';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search match
      const searchMatch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.userId.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status match
      const statusMatch = statusFilter === 'All' || order.status === statusFilter;
      
      // Date range match
      const orderDate = new Date(order.date).getTime();
      const start = startDate ? new Date(startDate).setHours(0,0,0,0) : null;
      const end = endDate ? new Date(endDate).setHours(23,59,59,999) : null;
      
      let dateMatch = true;
      if (start && end) {
        dateMatch = orderDate >= start && orderDate <= end;
      } else if (start) {
        dateMatch = orderDate >= start;
      } else if (end) {
        dateMatch = orderDate <= end;
      }

      return searchMatch && statusMatch && dateMatch;
    });
  }, [orders, searchTerm, statusFilter, startDate, endDate]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setStartDate('');
    setEndDate('');
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-600 border-green-200';
      case 'Shipped': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Order Management</h1>
          <p className="text-gray-500 font-bold tracking-widest text-[10px] mt-1 uppercase">Full transaction control & logistics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-8 py-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center space-x-4">
            <ShoppingBag className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Value</p>
              <p className="text-xl font-black text-gray-900 leading-none mt-1">₹{filteredOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
        <div className="flex items-center space-x-3 text-gray-400 mb-2">
          <Filter className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Advanced Search & Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Text Search */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Order or Customer ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500/20 transition-all font-bold text-sm"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500/20 transition-all font-bold text-sm appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date From */}
          <div className="relative group">
            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-green-500 transition" />
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500/20 transition-all font-bold text-sm"
            />
            {!startDate && <span className="absolute left-14 top-1/2 -translate-y-1/2 text-gray-300 text-xs font-bold pointer-events-none">Start Date</span>}
          </div>

          {/* Date To */}
          <div className="relative group">
            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-green-500 transition" />
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500/20 transition-all font-bold text-sm"
            />
            {!endDate && <span className="absolute left-14 top-1/2 -translate-y-1/2 text-gray-300 text-xs font-bold pointer-events-none">End Date</span>}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-gray-900 font-black">{filteredOrders.length}</span> results 
            {statusFilter !== 'All' && <span> for status: <span className="text-green-600">{statusFilter}</span></span>}
          </p>
          <button 
            onClick={resetFilters}
            className="flex items-center space-x-2 text-[10px] font-black text-gray-400 hover:text-red-500 transition uppercase tracking-[0.2em]"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-6">ID & Timestamp</th>
                <th className="px-10 py-6">Customer & Address</th>
                <th className="px-10 py-6">Value & Method</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center">
                      <ShoppingBag className="w-16 h-16 text-gray-100 mb-4" />
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No matching orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition group">
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-black text-gray-400 mb-1">#{order.id.split('-')[1]}</span>
                        <div className="flex items-center text-xs font-bold text-gray-900 uppercase tracking-tight">
                          <Clock className="w-3 h-3 mr-2 text-gray-300" />
                          {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 max-w-xs">
                      <div className="flex flex-col">
                        <span className="font-black text-sm text-gray-900 uppercase tracking-tight mb-1">{order.userId}</span>
                        <div className="flex items-start text-[10px] font-bold text-gray-400 uppercase leading-relaxed">
                          <MapPin className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" />
                          <span className="truncate">{order.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-gray-900 tracking-tighter">₹{order.total.toFixed(2)}</span>
                        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest mt-1">{order.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="relative group/status inline-block">
                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                          {order.status === 'Pending' && <Clock className="w-3 h-3 mr-2" />}
                          {order.status === 'Shipped' && <Truck className="w-3 h-3 mr-2" />}
                          {order.status === 'Delivered' && <CheckCircle2 className="w-3 h-3 mr-2" />}
                          {order.status === 'Cancelled' && <XCircle className="w-3 h-3 mr-2" />}
                          {order.status}
                        </span>
                        
                        {/* Quick Status Update Popover */}
                        <div className="absolute left-0 top-full mt-2 hidden group-hover/status:block z-20 bg-gray-900 rounded-2xl shadow-2xl p-2 min-w-[160px] border border-white/10">
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest px-3 py-2">Update Status</p>
                          {(['Pending', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map(s => (
                            <button
                              key={s}
                              onClick={() => updateOrderStatus(order.id, s)}
                              className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors ${
                                order.status === s ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-3 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-3 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
