import React from 'react';
import { ChevronLeft, Store } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-emerald-50/50 dark:bg-emerald-950/20 rounded-3xl shadow-sm border border-emerald-100 dark:border-emerald-900/30">
      <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8 relative z-10">
        
        {/* Text & CTA */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-bold text-sm shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            استلام من الفرع فقط
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.2]">
            اطلب أونلاين، واستلم من الفرع <span className="text-emerald-500 block mt-2">بدون انتظار!</span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed font-medium">
            اطلب ما تحتاجه من مطاعمك وسوبر ماركتك المفضل واستلمه جاهزاً عند وصولك بدون الوقوف في الطوابير.
          </p>
          
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-emerald-500/30 transition-transform transform hover:-translate-y-1 flex items-center gap-3">
            تصفح المتاجر الآن
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        
        {/* 3D Illustration Area */}
        <div className="flex-1 relative w-full justify-center items-center hidden md:flex">
            {/* Glowing background behind image */}
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-[80px]"></div>
            
            {/* Placeholder for 3D image */}
            <div className="relative z-10 w-80 h-80 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700 flex flex-col items-center justify-center text-center p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <Store className="w-24 h-24 text-emerald-500 mb-4 drop-shadow-md" />
                <span className="font-extrabold text-gray-800 dark:text-gray-200">3D Illustration Here</span>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-2">Pickup Guy isolated</span>
            </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
