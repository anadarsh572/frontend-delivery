import React from 'react';
import { ShoppingCart, User, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Right: MENNO Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-emerald-500 leading-none">MENNO</span>
              <span className="font-bold text-sm text-gray-900 dark:text-white leading-none mt-1">مينو</span>
            </div>
          </div>

          {/* Middle: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none pr-4">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-3 pr-12 py-3 border border-gray-200 dark:border-gray-800 rounded-full leading-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium sm:text-sm shadow-inner" 
                placeholder="ماذا تبحث عن اليوم؟ (مطاعم، مخابز، سوبر ماركت...)" 
              />
            </div>
          </div>

          {/* Left: Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full transition-colors">
              <User className="h-6 w-6" />
            </button>
            <button className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full transition-colors">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-emerald-500 rounded-full shadow-sm ring-2 ring-white dark:ring-gray-950">
                1
              </span>
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
