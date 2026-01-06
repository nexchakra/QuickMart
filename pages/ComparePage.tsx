
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { ArrowLeft, Trash2, ShoppingCart, Check, X } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { compareList, toggleCompare, clearCompare, addToCart } = useApp();
  const navigate = useNavigate();

  if (compareList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Comparison list is empty</h2>
        <p className="text-gray-500 mb-8">Select products from the shop to compare them side-by-side.</p>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  // Get unique features across all selected products
  const allFeatures = Array.from(new Set(compareList.flatMap(p => p.features || [])));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-green-600 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">Compare Products</h1>
          <button 
            onClick={clearCompare}
            className="text-red-500 text-sm font-bold hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="p-8 w-1/5 bg-gray-50 font-bold text-gray-400 uppercase text-xs tracking-widest">Feature</th>
              {compareList.map(product => (
                <th key={product.id} className="p-8 w-1/5 relative group border-l border-gray-50">
                  <button 
                    onClick={() => toggleCompare(product)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col items-center text-center">
                    <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-2xl mb-4 shadow-sm" />
                    <h3 className="font-bold text-gray-900 mb-2 leading-tight h-10 overflow-hidden">{product.name}</h3>
                    <p className="text-xl font-black text-green-600">₹{product.price}</p>
                    <button 
                      onClick={() => addToCart(product)}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition w-full flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                    </button>
                  </div>
                </th>
              ))}
              {/* Fill remaining slots if < 4 */}
              {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => (
                <th key={`empty-${i}`} className="p-8 w-1/5 border-l border-gray-50 bg-gray-25">
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl text-gray-300 cursor-pointer hover:border-green-300 hover:text-green-300 transition-colors" onClick={() => navigate('/shop')}>
                    <span className="text-sm font-bold">+ Add product</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="p-8 bg-gray-50 font-bold text-sm text-gray-700">Category</td>
              {compareList.map(p => (
                <td key={p.id} className="p-8 border-l border-gray-50 text-sm font-medium">{p.category}</td>
              ))}
              {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => <td key={i} className="p-8 border-l border-gray-50"></td>)}
            </tr>
            <tr>
              <td className="p-8 bg-gray-50 font-bold text-sm text-gray-700">In Stock</td>
              {compareList.map(p => (
                <td key={p.id} className="p-8 border-l border-gray-50">
                  {p.stock > 0 ? <Check className="text-green-500 w-5 h-5" /> : <X className="text-red-500 w-5 h-5" />}
                </td>
              ))}
              {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => <td key={i} className="p-8 border-l border-gray-50"></td>)}
            </tr>
            {allFeatures.map(feature => (
              <tr key={feature}>
                <td className="p-8 bg-gray-50 font-bold text-sm text-gray-700">{feature}</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-8 border-l border-gray-50">
                    {(p.features || []).includes(feature) ? (
                      <Check className="text-green-500 w-5 h-5" />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                ))}
                {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => <td key={i} className="p-8 border-l border-gray-50"></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
