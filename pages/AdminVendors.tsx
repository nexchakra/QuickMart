
import React, { useState, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { CATEGORIES } from '../constants';
import { 
  Plus, Edit2, Trash2, X, Search, Store, 
  CheckCircle2, AlertCircle, Image as ImageIcon,
  MapPin, Award, ShieldCheck, ShieldAlert
} from 'lucide-react';
import { Vendor, Category } from '../types';

export const AdminVendors: React.FC = () => {
  const { vendors, addVendor, updateVendor, deleteVendor } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    logo: string;
    banner: string;
    description: string;
    location: string;
    isVerified: boolean;
    categories: Category[];
  }>({
    name: '',
    slug: '',
    logo: '',
    banner: '',
    description: '',
    location: '',
    isVerified: false,
    categories: [],
  });

  const handleOpenModal = (v?: Vendor) => {
    if (v) {
      setEditingVendor(v);
      setFormData({
        name: v.name,
        slug: v.slug,
        logo: v.logo,
        banner: v.banner,
        description: v.description,
        location: v.location,
        isVerified: v.isVerified,
        categories: v.categories,
      });
    } else {
      setEditingVendor(null);
      setFormData({
        name: '',
        slug: '',
        logo: '',
        banner: '',
        description: '',
        location: '',
        isVerified: false,
        categories: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (file: File, type: 'logo' | 'banner') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFormData(prev => ({ ...prev, [type]: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVendor) {
      updateVendor({ ...editingVendor, ...formData });
    } else {
      addVendor(formData);
    }
    setIsModalOpen(false);
  };

  const toggleCategory = (cat: Category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Vendor Partners</h1>
          <p className="text-gray-500 font-medium mt-1">Manage producer relationships and platform verification</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none font-medium" 
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center hover:bg-slate-800 transition shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" /> New Vendor
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Partner</th>
                <th className="px-8 py-5">Location</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Rating</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredVendors.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
                        <img src={v.logo} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 uppercase text-xs tracking-tight">{v.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">@{v.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                       <MapPin className="w-3 h-3 mr-1.5 text-gray-300" />
                       {v.location}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => updateVendor({...v, isVerified: !v.isVerified})}
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${v.isVerified ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}
                    >
                       {v.isVerified ? <ShieldCheck className="w-3 h-3 mr-1.5" /> : <ShieldAlert className="w-3 h-3 mr-1.5" />}
                       {v.isVerified ? 'Verified' : 'Unverified'}
                    </button>
                  </td>
                  <td className="px-8 py-5">
                     <div className="flex items-center text-yellow-500 font-black text-xs">
                        <Award className="w-4 h-4 mr-1.5 fill-current" />
                        {v.rating.toFixed(1)}
                     </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(v)} className="p-3 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => deleteVendor(v.id)} className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] p-10 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">
                  {editingVendor ? 'Modify Producer' : 'Onboard Producer'}
                </h2>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Merchant Profile & Platform Trust</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Images Upload */}
                <div className="space-y-8">
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Partner Logo</label>
                      <div className="flex items-center space-x-6">
                         <div className="w-32 h-32 rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shadow-inner">
                            {formData.logo ? <img src={formData.logo} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="w-8 h-8 text-gray-200" />}
                         </div>
                         <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white border-2 border-slate-100 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-green-500 transition shadow-sm"
                         >
                            Upload Logo
                         </button>
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')} />
                      </div>
                   </div>

                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Store Banner</label>
                      <div 
                        onClick={() => bannerInputRef.current?.click()}
                        className="w-full h-40 rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-green-400 transition group overflow-hidden"
                      >
                         {formData.banner ? (
                           <img src={formData.banner} className="w-full h-full object-cover" alt="" />
                         ) : (
                           <>
                              <Plus className="w-8 h-8 text-gray-200 group-hover:text-green-500 mb-2" />
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Banner Image</span>
                           </>
                         )}
                      </div>
                      <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')} />
                   </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Merchant Name</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] outline-none transition font-black uppercase italic tracking-tight text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Unique Slug (URL)</label>
                    <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] outline-none transition font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Dispatch Location</label>
                    <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] outline-none transition font-bold" />
                  </div>
                  <div className="flex items-center space-x-4 p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex-grow">Marketplace Verified Status</label>
                     <button 
                       type="button"
                       onClick={() => setFormData({...formData, isVerified: !formData.isVerified})}
                       className={`w-16 h-8 rounded-full p-1 transition-all ${formData.isVerified ? 'bg-green-500' : 'bg-gray-300'}`}
                     >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all ${formData.isVerified ? 'translate-x-8' : 'translate-x-0'}`}></div>
                     </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Operational Categories</label>
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.categories.includes(cat) ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-900'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Merchant Story & Bio</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] outline-none transition font-medium" />
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] hover:bg-green-600 transition-all shadow-2xl shadow-slate-200">
                {editingVendor ? 'Update Profile' : 'Confirm Onboarding'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
