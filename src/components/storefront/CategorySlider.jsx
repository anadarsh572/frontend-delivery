import React from 'react';
import { Utensils, Croissant, Cake, ShoppingCart } from 'lucide-react';

// Using a dictionary to map string names to Lucide icons dynamically 
// since Lucide reacts components shouldn't be passed directly in raw JSON easily.
const IconMap = {
  Utensils: Utensils,
  Croissant: Croissant,
  Cake: Cake,
  ShoppingCart: ShoppingCart
};

const CategorySlider = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">الفئات</h2>
      
      {/* Hide scrollbar classes will be in Home.style or global CSS */}
      <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar snap-x">
        {categories.map((cat) => {
          const Icon = IconMap[cat.icon] || Utensils;
          const isActive = activeCategory === cat.name;
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex-shrink-0 snap-start flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 transition-all duration-200 ${
                isActive 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/10' 
                  : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-emerald-200 hover:shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-gray-50 dark:bg-gray-800'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`} />
              </div>
              <span className="font-bold text-sm leading-tight text-center px-1">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySlider;
