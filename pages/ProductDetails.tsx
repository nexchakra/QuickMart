
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Star, 
  BarChart2, 
  Check, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Leaf,
  Award,
  Zap,
  Package,
  Clock,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Info,
  Droplets,
  Wind,
  MessageSquare,
  Send,
  User as UserIcon,
  RotateCw,
  Gift,
  Navigation,
  Scale,
  Soup,
  Box,
  Share2,
  ShoppingBag,
  History,
  MapPin,
  Tag,
  Loader2,
  Flame,
  Activity,
  ZapOff,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Subscription, Review } from '../types';

export const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, vendors, addToCart, compareList, toggleCompare, wishlist, toggleWishlist, currentUser, addReview } = useApp();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'Description' | 'Reviews'>('Description');
  
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [frequency, setFrequency] = useState<Subscription['frequency']>('Weekly');

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Carousel Auto-play logic
  const autoPlayRef = useRef<number | null>(null);
  
  const product = useMemo(() => products.find(p => p.id === id), [products, id]);
  const vendor = useMemo(() => vendors.find(v => v.id === product?.vendorId), [vendors, product]);
  
  const galleryImages = product?.images && product.images.length > 0 ? product.images : [product?.image || ''];

  useEffect(() => {
    if (galleryImages.length > 1) {
      autoPlayRef.current = window.setInterval(() => {
        setActiveImageIndex(prev => (prev + 1) % galleryImages.length);
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [galleryImages]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }, [products, product]);

  const isInCompare = compareList.find(p => p.id === id);
  const isWished = product ? wishlist.includes(product.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-4xl font-black uppercase italic text-slate-900 mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-green-600 font-black uppercase tracking-widest hover:underline">Return to Market</Link>
      </div>
    </div>
  );

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please login to leave a review.');
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    await new Promise(r => setTimeout(r, 800));
    addReview(product.id, { user: currentUser.name, rating: reviewRating, comment: reviewComment });
    setReviewComment('');
    setReviewRating(5);
    setIsSubmittingReview(false);
  };

  const nextImage = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };
  const prevImage = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-24">
      {/* Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-slate-400 hover:text-green-600 font-black uppercase text-[10px] tracking-[0.4em] transition-all group"
        >
          <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" /> 
          Back to Market
        </button>
        <div className="flex items-center space-x-6">
           <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition shadow-sm">
             <Share2 className="w-4 h-4" />
           </button>
           <div className="h-4 w-[1px] bg-slate-200"></div>
           <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-300">
             <Link to="/" className="hover:text-green-600 transition">Market</Link>
             <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
             <span className="text-slate-900 truncate max-w-[150px]">{product.name}</span>
           </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Gallery Carousel */}
        <div className="space-y-8">
          <div className="relative aspect-square rounded-[4rem] overflow-hidden bg-white border border-slate-100 shadow-2xl group">
            {/* Badges Overlay */}
            <div className="absolute top-8 left-8 z-20 flex flex-col gap-3">
              {product.isExpress && (
                <div className="bg-yellow-400 text-slate-900 text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest flex items-center shadow-xl">
                  <Zap className="w-3.5 h-3.5 mr-2 fill-current" /> 10-Min Rush
                </div>
              )}
              {product.isMartOriginal && (
                <div className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest flex items-center shadow-xl">
                  <Award className="w-3.5 h-3.5 mr-2 text-yellow-400" /> Original
                </div>
              )}
              {product.isOffer && (
                <div className="bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest flex items-center shadow-xl animate-pulse">
                  <Flame className="w-3.5 h-3.5 mr-2 fill-current" /> Flash Sale
                </div>
              )}
            </div>

            <div 
              className="absolute inset-0 flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)" 
              style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
            >
              {galleryImages.map((img, i) => (
                <img key={i} src={img} alt={product.name} className="w-full h-full object-cover flex-shrink-0" />
              ))}
            </div>
            
            {galleryImages.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <button 
                  onClick={(e) => { e.preventDefault(); prevImage(); }}
                  className="bg-white/80 backdrop-blur-md w-14 h-14 rounded-2xl shadow-xl hover:bg-white text-slate-900 flex items-center justify-center transition-all active:scale-90"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); nextImage(); }}
                  className="bg-white/80 backdrop-blur-md w-14 h-14 rounded-2xl shadow-xl hover:bg-white text-slate-900 flex items-center justify-center transition-all active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Pagination Indicators */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {galleryImages.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
                      setActiveImageIndex(i);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${activeImageIndex === i ? 'w-8 bg-green-600' : 'w-2 bg-slate-300'}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {galleryImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => {
                   if (autoPlayRef.current) clearInterval(autoPlayRef.current);
                   setActiveImageIndex(idx);
                }}
                className={`w-24 h-24 rounded-3xl overflow-hidden border-2 flex-shrink-0 transition-all duration-500 ${activeImageIndex === idx ? 'border-green-600 ring-4 ring-green-50 shadow-lg scale-105' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="flex flex-col">
          <div className="mb-10 space-y-4">
            <div className="flex items-center justify-between">
               <Link to={`/vendor/${vendor?.slug}`} className="flex items-center space-x-3 group">
                 <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                   <img src={vendor?.logo} className="w-full h-full object-cover" alt="" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-green-600 transition">{vendor?.name}</span>
                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{product.brand || 'Premium Quality'}</span>
                 </div>
               </Link>
               <div className="flex items-center text-yellow-500 font-black text-[12px]">
                 <Star className="w-4 h-4 fill-current mr-1.5" />
                 <span className="text-slate-900">{product.rating}</span>
                 <span className="mx-2 text-slate-200">|</span>
                 <span className="text-slate-400 uppercase tracking-widest">{product.reviewsCount} Reviews</span>
               </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight uppercase italic">{product.name}</h1>
            
            <div className="flex items-baseline space-x-6">
              <span className="text-6xl font-black text-slate-900 tracking-tighter italic">₹{isSubscribing ? Math.floor(product.price * 0.9) : product.price}</span>
              {product.originalPrice && (
                <span className="text-2xl text-slate-300 line-through font-bold tracking-tighter italic">₹{product.originalPrice}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 text-center space-y-2">
               <Clock className="w-5 h-5 mx-auto text-blue-500" />
               <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Delivery</p>
               <p className="text-xs font-black text-slate-900 uppercase">{product.isExpress ? '10-15 Mins' : 'Express'}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 text-center space-y-2">
               <ShieldCheck className="w-5 h-5 mx-auto text-green-500" />
               <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Quality</p>
               <p className="text-xs font-black text-slate-900 uppercase">Certified</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 text-center space-y-2">
               <Scale className="w-5 h-5 mx-auto text-purple-500" />
               <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Weight</p>
               <p className="text-xs font-black text-slate-900 uppercase">{product.weight || 'Standard'}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 text-center space-y-2">
               <History className="w-5 h-5 mx-auto text-orange-500" />
               <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Freshness</p>
               <p className="text-xs font-black text-slate-900 uppercase">{product.shelfLife || 'Fresh'}</p>
            </div>
          </div>

          {/* Buying Actions */}
          <div className="space-y-8">
            <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-center justify-between group cursor-pointer" onClick={() => setIsSubscribing(!isSubscribing)}>
               <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl transition-all shadow-sm ${isSubscribing ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600'}`}>
                    <RotateCw className={`w-6 h-6 ${isSubscribing ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Recurring Cycle</h4>
                    <p className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">Permanent 10% Discount</p>
                  </div>
               </div>
               <div className={`w-14 h-8 rounded-full p-1 transition-all ${isSubscribing ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all transform ${isSubscribing ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </div>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center bg-slate-50 rounded-[2.5rem] p-2 border border-slate-100">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-green-600 transition"><ChevronDown className="w-6 h-6"/></button>
                <span className="w-12 text-center font-black text-xl text-slate-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-green-600 transition"><ChevronUp className="w-6 h-6"/></button>
              </div>

              <button 
                onClick={() => { 
                  addToCart(product, quantity, isSubscribing ? { frequency } : undefined);
                  navigate('/cart');
                }}
                className="flex-1 min-w-[250px] bg-slate-900 text-white py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-widest hover:bg-green-600 hover:-translate-y-1 transition-all duration-500 shadow-2xl flex items-center justify-center space-x-4"
              >
                <ShoppingBag className="w-6 h-6" />
                <span>Add To Basket</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- DEDICATED TRANSPARENCY & NUTRITION SECTION --- */}
      <section className="bg-white rounded-[5rem] p-12 md:p-24 border border-slate-100 shadow-sm space-y-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">Wellness & Transparency</h2>
            <p className="text-slate-400 font-medium text-lg italic">Pure local sourcing. We believe you deserve to know exactly what goes into your home.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Ingredients Side */}
            <div className="space-y-10">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-lg shadow-green-100">
                  <Soup className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic">Ingredients Mastery</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No hidden additives. Pure sourcing.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.ingredients?.map((ing, i) => (
                  <div key={i} className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-700 uppercase tracking-tight hover:bg-white hover:border-green-500 transition-all cursor-default shadow-sm">
                    {ing}
                  </div>
                )) || <p className="text-slate-400 italic">Single-origin natural product.</p>}
              </div>

              <div className="bg-blue-50/50 p-8 rounded-[3rem] border border-blue-100/50 space-y-6">
                <div className="flex items-center space-x-3 text-blue-600">
                  <AlertCircle className="w-5 h-5" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Allergen Awareness</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.allergens?.map((al, i) => (
                    <span key={i} className="bg-white px-4 py-2 rounded-xl text-[10px] font-black text-blue-600 uppercase border border-blue-100 shadow-sm">{al}</span>
                  )) || <span className="text-[10px] font-black text-slate-400 uppercase">No major allergens detected</span>}
                </div>
              </div>
            </div>

            {/* Nutrition Side */}
            <div className="space-y-10">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic">Analytical Data</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Per serving analysis</p>
                </div>
              </div>

              {product.nutritionFacts ? (
                <div className="bg-white p-10 rounded-[3rem] border-[6px] border-slate-900 shadow-2xl relative animate-in fade-in duration-1000">
                  <h4 className="text-3xl font-black text-slate-900 uppercase italic border-b-[10px] border-slate-900 pb-2 mb-6 tracking-tighter">Nutrition Facts</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b-2 border-slate-900 pb-1">
                      <span className="text-xs font-black uppercase">Calories</span>
                      <span className="text-3xl font-black italic">{product.nutritionFacts.calories}</span>
                    </div>
                    {[
                      { label: 'Total Fat', value: product.nutritionFacts.totalFat },
                      { label: 'Saturated Fat', value: product.nutritionFacts.saturatedFat, sub: true },
                      { label: 'Cholesterol', value: product.nutritionFacts.cholesterol },
                      { label: 'Sodium', value: product.nutritionFacts.sodium },
                      { label: 'Total Carbohydrates', value: product.nutritionFacts.carbs },
                      { label: 'Dietary Fiber', value: product.nutritionFacts.fiber, sub: true },
                      { label: 'Total Sugars', value: product.nutritionFacts.sugars, sub: true },
                      { label: 'Protein', value: product.nutritionFacts.protein, bold: true },
                    ].map((row, i) => (
                      <div key={i} className={`flex justify-between items-center text-[10px] font-black uppercase border-b border-slate-200 py-1.5 ${row.sub ? 'pl-6 text-slate-500' : 'text-slate-900'} ${row.bold ? 'border-b-4 border-slate-900 pt-3' : ''}`}>
                        <span>{row.label}</span>
                        <span>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[8px] font-medium leading-tight text-slate-400 italic pt-6">
                    * Values are based on standard batch analysis. Actual values may vary by season and source.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 p-12 rounded-[4rem] text-center space-y-4 border-2 border-dashed border-slate-200">
                  <Activity className="w-10 h-10 text-slate-200 mx-auto" />
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-relaxed">Detailed macro analysis is being updated for this season's harvest.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs for extra details */}
      <section className="space-y-12">
        <div className="flex space-x-12 border-b border-slate-100">
           {(['Description', 'Reviews'] as const).map(tab => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}
             >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-900 rounded-full"></div>}
             </button>
           ))}
        </div>

        <div className="min-h-[200px]">
           {activeTab === 'Description' ? (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
               <div className="lg:col-span-2 space-y-8">
                 <p className="text-slate-500 text-lg font-medium leading-relaxed italic">{product.description}</p>
                 <div className="flex flex-wrap gap-3">
                   {product.features?.map((f, i) => (
                     <span key={i} className="bg-slate-50 text-slate-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center shadow-sm">
                       <Check className="w-4 h-4 mr-2 text-green-500" /> {f}
                     </span>
                   ))}
                 </div>
               </div>
               <div className="bg-slate-950 p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden group">
                  <Wind className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12 group-hover:rotate-45 transition duration-1000" />
                  <h4 className="text-xl font-black uppercase italic tracking-tight relative z-10">Origin Analysis</h4>
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sourced From</p>
                        <p className="text-sm font-black">{product.origin || 'Verified Partner'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Logistics Path</p>
                        <p className="text-sm font-black">Regional Direct</p>
                      </div>
                    </div>
                  </div>
               </div>
             </div>
           ) : (
             <div className="space-y-10">
               {product.reviews?.map((r, i) => (
                 <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-start space-x-8">
                   <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
                     <UserIcon className="w-8 h-8" />
                   </div>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between">
                       <h5 className="font-black text-slate-900 uppercase text-lg tracking-tight">{r.user}</h5>
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(r.date).toLocaleDateString()}</span>
                     </div>
                     <div className="flex text-yellow-400">
                       {[...Array(5)].map((_, si) => <Star key={si} className={`w-4 h-4 ${si < r.rating ? 'fill-current' : 'text-slate-100'}`} />)}
                     </div>
                     <p className="text-slate-500 font-medium italic text-lg leading-relaxed">"{r.comment}"</p>
                   </div>
                 </div>
               ))}
               {!product.reviews?.length && <p className="text-slate-400 text-center py-20 font-black uppercase tracking-widest text-xs border-2 border-dashed border-slate-100 rounded-[3rem]">No reviews yet. Be the first to share your experience!</p>}
             </div>
           )}
        </div>
      </section>

      {/* Related Products */}
      <section className="space-y-12">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Commonly Bought With</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {relatedProducts.map(p => (
            <div key={p.id} className="group bg-white rounded-[3rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-6">
                <Link to={`/product/${p.id}`}>
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt="" />
                </Link>
              </div>
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none mb-4 italic truncate">{p.name}</h4>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900 tracking-tighter italic">₹{p.price}</span>
                <button onClick={() => addToCart(p)} className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-green-600 transition shadow-xl"><ShoppingCart className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
