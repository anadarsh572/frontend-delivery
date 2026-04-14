import React from 'react';
import { Star, Clock } from 'lucide-react';

const StoreCard = ({ store }) => {
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      
      {/* Cover Image & Time Tag */}
      <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <img 
          src={store.image} 
          alt={store.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        <div className="absolute top-4 right-4 bg-emerald-500/95 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          جاهز للاستلام في {store.time}
        </div>
      </div>

      {/* Store Info */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
            {store.name}
          </h3>
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded text-amber-600 dark:text-amber-400 font-bold text-xs shrink-0 ml-2">
            <Star className="w-3 h-3 fill-current" />
            {store.rating}
          </div>
        </div>
        
        {/* CTA Button */}
        <button className="mt-auto w-full bg-gray-50 dark:bg-gray-800 hover:bg-emerald-500 dark:hover:bg-emerald-500 text-gray-700 dark:text-gray-200 hover:text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 transition-all">
          تصفح المنيو
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
