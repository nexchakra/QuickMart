
import React, { useState, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { CATEGORIES } from '../constants';
import { Plus, Edit2, Trash2, X, Search, Package, Image as ImageIcon, CheckCircle2, AlertCircle, Tag, Scale, History, MapPin, Soup, FileText } from 'lucide-react';
import { Product, NutritionFacts } from '../types';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, vendors } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    name: string;
    brand: string;
    category: Product['category'];
    vendorId: string;
    price: number;
    stock: number;
    weight: string;
    shelfLife: string;
    origin: string;
    image: string;
    images: string[];
    description: string;
    ingredients: string;
    allergens: string;
    nutritionFacts: NutritionFacts;
  }>({
    name: '',
    brand: '',
    category: CATEGORIES[0],
    vendorId: '',
    price: 0,
    stock: 0,
    weight: '',
    shelfLife: '',
    origin: '',
    image: '',
    images: [],
    description: '',
    ingredients: '',
    allergens: '',
    nutritionFacts: {
      calories: '0',
      totalFat: '0g',
      saturatedFat: '0g',
      cholesterol: '0mg',
      sodium: '0mg',
      carbs: '0g',
      fiber: '0g',
      sugars: '0g',
      protein: '0g'
    }
  });

  const handleOpenModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setFormData({
        name: p.name,
        brand: p.brand || '',
        category: p.category,
        vendorId: p.vendorId,
        price: p.price,
        stock: p.stock,
        weight: p.weight || '',
        shelfLife: p.shelfLife || '',
        origin: p.origin || '',
        image: p.image,
        images: p.images || [],
        description: p.description,
        ingredients: p.ingredients?.join(', ') || '',
        allergens: p.allergens?.join(', ') || '',
        nutritionFacts: p.nutritionFacts || {
          calories: '0',
          totalFat: '0g',
          saturatedFat: '0g',
          cholesterol: '0mg',
          sodium: '0mg',
          carbs: '0g',
          fiber: '0g',
          sugars: '0g',
          protein: '0g'
        }
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        brand: '',
        category: CATEGORIES[0],
        vendorId: vendors[0]?.id || '',
        price: 0,
        stock: 0,
        weight: '',
        shelfLife: '',
        origin: '',
        image: '',
        images: [],
        description: '',
        ingredients: '',
        allergens: '',
        nutritionFacts: {
          calories: '0',
          totalFat: '0g',
          saturatedFat: '0g',
          cholesterol: '0mg',
          sodium: '0mg',
          carbs: '0g',
          fiber: '0g',
          sugars: '0g',
          protein: '0g'
        }
      });
    }
    setIsModalOpen(true);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFormData(prev => ({ ...prev, image: base64, images: [base64] }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i !== ''),
      allergens: formData.allergens.split(',').map(i => i.trim()).filter(i => i !== '')
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...finalData });
    } else {
      addProduct(finalData);
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Inventory</h1>
          <p className="text-gray-500 font-medium mt-1">Manage catalog details and macro analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none font-medium" 
            />
          </div>
          <button onClick={() => handleOpenModal()} className="bg-green-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center shadow-xl">
            <Plus className="w-5 h-5 mr-2" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5">Stock</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img src={p.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 uppercase text-xs">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 px-3 py-1 rounded-full">{p.category}</span>
                  </td>
                  <td className="px-8 py-5 font-black text-gray-900">₹{p.price}</td>
                  <td className="px-8 py-5">
                    <span className={`text-xs font-black ${p.stock <= 5 ? 'text-red-600' : 'text-gray-600'}`}>{p.stock} Units</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleOpenModal(p)} className="p-3 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"><Edit2 className="w-5 h-5" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition"><Trash2 className="w-5 h-5" /></button>
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
          <div className="bg-white w-full max-w-5xl rounded-[3rem] p-10 max-h-[90vh] overflow-y-auto shadow-2xl space-y-12 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">{editingProduct ? 'Edit Catalog Entry' : 'Create Catalog Entry'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 rounded-2xl hover:text-red-500 transition"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Product Name</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold italic uppercase tracking-tight" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Price (₹)</label>
                      <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Stock</label>
                      <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Public Description</label>
                    <textarea rows={4} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-6 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium text-sm leading-relaxed" />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-6">
                    <div className="flex items-center space-x-3 text-slate-900">
                      <Soup className="w-5 h-5" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Wellness Profile</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">Ingredients (Comma separated)</label>
                        <input value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} className="w-full p-4 bg-white border border-slate-100 rounded-xl outline-none text-xs font-bold" placeholder="e.g. Fresh Milk, Salt..." />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400">Major Allergens</label>
                        <input value={formData.allergens} onChange={e => setFormData({...formData, allergens: e.target.value})} className="w-full p-4 bg-white border border-slate-100 rounded-xl outline-none text-xs font-bold text-red-600" placeholder="e.g. Milk, Soy, Nuts..." />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-white border-2 border-slate-900 rounded-[3rem] space-y-6">
                    <div className="flex items-center space-x-3 text-slate-900">
                      <FileText className="w-5 h-5" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Nutrition Data</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[8px] font-black uppercase text-slate-400">Cals</label>
                        <input value={formData.nutritionFacts.calories} onChange={e => setFormData({...formData, nutritionFacts: {...formData.nutritionFacts, calories: e.target.value}})} className="w-full p-2 bg-slate-50 border-none rounded-lg text-xs font-black" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[8px] font-black uppercase text-slate-400">Protein</label>
                        <input value={formData.nutritionFacts.protein} onChange={e => setFormData({...formData, nutritionFacts: {...formData.nutritionFacts, protein: e.target.value}})} className="w-full p-2 bg-slate-50 border-none rounded-lg text-xs font-black" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[8px] font-black uppercase text-slate-400">Carbs</label>
                        <input value={formData.nutritionFacts.carbs} onChange={e => setFormData({...formData, nutritionFacts: {...formData.nutritionFacts, carbs: e.target.value}})} className="w-full p-2 bg-slate-50 border-none rounded-lg text-xs font-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-green-600 transition-all shadow-2xl">
                {editingProduct ? 'Update Inventory Master' : 'Publish to Marketplace'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
