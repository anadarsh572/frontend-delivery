import React, { useState } from 'react';
import Navbar from '../components/storefront/Navbar';
import HeroSection from '../components/storefront/HeroSection';
import CategorySlider from '../components/storefront/CategorySlider';
import StoreCard from '../components/storefront/StoreCard';

// Dummy Data exactly as requested
const DUMMY_CATEGORIES = [
  { id: 1, name: "المطاعم", icon: "Utensils" },
  { id: 2, name: "المخبوزات", icon: "Croissant" },
  { id: 3, name: "الحلويات", icon: "Cake" },
  { id: 4, name: "السوبر ماركت", icon: "ShoppingCart" }
];

const DUMMY_STORES = [
  { id: 1, name: "مطعم الشاورما الأصلي", time: "15 دقيقة", rating: 4.8, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500" },
  { id: 2, name: "سوبر ماركت الهدى", time: "10 دقائق", rating: 4.5, image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500" },
  { id: 3, name: "مخبز العائلة", time: "5 دقائق", rating: 4.9, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500" },
  { id: 4, name: "حلويات الشرق", time: "20 دقيقة", rating: 4.6, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500" }
];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("المطاعم");

  // In a real app we would filter DUMMY_STORES based on activeCategory
  const displayedStores = DUMMY_STORES; 

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-sans text-gray-900 dark:text-gray-100" dir="rtl">
      
      {/* 1. Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Category Slider */}
        <CategorySlider 
          categories={DUMMY_CATEGORIES} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />

        {/* 4. Store Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">المتاجر الأقرب إليك</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>
      </main>

      {/* Global utility class for hiding scrollbar visually but keeping functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
        }
      `}} />
    </div>
  );
};

export default Home;
