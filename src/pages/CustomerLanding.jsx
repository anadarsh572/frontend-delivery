import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, MapPin, Star, ChevronLeft, Store, Clock } from 'lucide-react';
import apiClient from '../api/client';

const CustomerLanding = () => {
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, storeRes] = await Promise.all([
        apiClient.get('/api/public/categories'),
        apiClient.get('/api/public/stores')
      ]);
      setCategories([{ name: 'الكل' }, ...catRes.data]);
      setStores(storeRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStores = selectedCategory === 'الكل' 
    ? stores 
    : stores.filter(store => store.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-sans text-gray-900 dark:text-gray-100" dir="rtl">
      
      {/* 1. Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Right: MENNO Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <Store className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter text-gray-900 dark:text-white leading-none">MENNO</span>
                <span className="font-bold text-sm text-green-500 leading-none">مينو</span>
              </div>
            </div>

            {/* Middle: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none pr-4">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-3 pr-12 py-3 border border-gray-200 dark:border-gray-800 rounded-full leading-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all sm:text-sm" 
                  placeholder="ماذا تبحث عن اليوم؟ (مطاعم، سوبر ماركت...)" 
                />
              </div>
            </div>

            {/* Left: Icons */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <User className="h-6 w-6" />
              </button>
              <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-green-500 rounded-full shadow-sm">
                  1
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-l from-green-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-3xl shadow-sm border border-green-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
            <div className="flex-1 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium text-sm">
                <MapPin className="w-4 h-4" />
                <span>استلام من الفرع فقط</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight">
                اطلب أونلاين، واستلم من الفرع <span className="text-green-500">بدون انتظار!</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg">
                اكتشف مئات المتاجر من حولك، اطلب ما تحتاجه، واستلمه جاهزاً عند وصولك بدون الوقوف في طوابير.
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-3">
                تصفح المتاجر الآن
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            
            {/* 3D Illustration Placeholder */}
            <div className="flex-1 relative w-full max-w-md aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-green-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 w-full h-full bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700 flex flex-col items-center justify-center text-center p-6">
                    <Store className="w-24 h-24 text-green-500 mb-4 opacity-80" />
                    <span className="font-bold text-gray-400 dark:text-gray-500">3D Illustration Placeholder</span>
                    <span className="text-sm text-gray-400 dark:text-gray-500">Pickup Guy with Green MENNO Bag</span>
                </div>
            </div>
          </div>
        </section>

        {/* 3. Categories Slider */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">الفئات</h2>
          </div>
          <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar snap-x">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex-shrink-0 snap-start flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 transition-all duration-200 ${
                  selectedCategory === cat.name 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 shadow-md shadow-green-500/10' 
                    : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-green-200 hover:shadow-sm'
                }`}
              >
                <div className="w-12 h-12 mb-2 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  {/* Category icon logic can go here. Using a generic icon for now based on name */}
                  <span className="text-2xl">{cat.name === 'الكل' ? '🌟' : (cat.name.includes('مطعم') ? '🍽️' : cat.name.includes('مخبز') ? '🥖' : '🍱')}</span>
                </div>
                <span className="font-bold text-sm">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Stores Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">المتاجر المتاحة</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-900 rounded-2xl h-72"></div>
              ))}
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-500">لا توجد متاجر في هذه الفئة</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStores.map((store) => (
                <div key={store.id} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  
                  {/* Store Image */}
                  <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-800">
                    {store.cover_image ? (
                      <img src={store.cover_image} alt={store.display_name || store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">بدون صورة</div>
                    )}
                    
                    {/* Pickup Tag Overlap */}
                    <div className="absolute top-4 right-4 bg-green-500/95 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5 transform hover:scale-105 transition-transform">
                      <Clock className="w-3 h-3" />
                      {store.pickup_time || 'جاهز في 15 دقيقة'}
                    </div>
                  </div>

                  {/* Store Details */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                        {store.display_name || store.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded text-amber-600 dark:text-amber-400 font-bold text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        {store.rating || '4.5'}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-4">{store.category || 'متجر متنوع'}</p>
                    
                    {/* CTA Menu Button */}
                    <button className="mt-auto w-full bg-gray-50 dark:bg-gray-800 hover:bg-green-500 dark:hover:bg-green-500 text-gray-700 dark:text-gray-200 hover:text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300">
                      تصفح المنيو
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Basic Custom Styles to hide scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default CustomerLanding;
