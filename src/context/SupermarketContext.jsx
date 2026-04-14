import React, { createContext, useState, useEffect, useContext } from 'react';

export const SupermarketContext = createContext();

const erpProducts = [
  { id: 1, name: 'طماطم بلدي طازجة', purchase_price: 10, selling_price: 15, min_stock: 10, current_stock: 50, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500', unit: '1 كيلو', barcode: '1001' },
  { id: 2, name: 'حليب كامل الدسم', purchase_price: 25, selling_price: 35, min_stock: 5, current_stock: 5, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500', unit: '1 لتر', barcode: '1002' },
  { id: 3, name: 'خبز فرنسي طازج', purchase_price: 12, selling_price: 20, min_stock: 15, current_stock: 30, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500', unit: '3 قطع', barcode: '1003' },
  { id: 4, name: 'موز استيراد', purchase_price: 30, selling_price: 40, min_stock: 5, current_stock: 20, image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=500', unit: '1 كيلو', barcode: '1004' },
];

export const SupermarketProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('erp_products');
    return saved ? JSON.parse(saved) : erpProducts;
  });

  const [revenue, setRevenue] = useState(0); 
  const [cogs, setCogs] = useState(0); // Cost of Goods Sold
  const [salesCount, setSalesCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('erp_products', JSON.stringify(products));
  }, [products]);

  const alerts = products.filter(p => p.current_stock <= p.min_stock).map(p => ({
    id: p.id,
    title: `طلب شراء عاجل: ${p.name}`,
    message: `الرصيد المتاح (${p.current_stock}) وصل لحد الأمان المستهدف (${p.min_stock}). تواصل مع المورد.`,
    severity: p.current_stock === 0 ? 'critical' : 'warning'
  }));

  const profitMargin = revenue > 0 ? (((revenue - cogs) / revenue) * 100).toFixed(1) : 0;
  
  const kpis = {
    revenue,
    cogs,
    profitMargin,
    salesCount,
    lowStockCount: alerts.length
  };

  const inlineUpdateProduct = (productId, updates) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  const processPOSOrder = (cartItems, totalSale, totalCost) => {
    // Pure ERP: Deduct stock directly and log financials immediately
    setProducts(prev => prev.map(p => {
       const cartItem = cartItems.find(i => i.id === p.id);
       if(cartItem) {
          return { ...p, current_stock: Math.max(0, p.current_stock - 1) }; // Assuming qty 1 for demo
       }
       return p;
    }));
    
    setRevenue(r => r + totalSale);
    setCogs(c => c + totalCost);
    setSalesCount(s => s + 1);
    
    alert("تم تدوين المبيعات وتحديث المخزون ودفتر الأستاذ بنجاح!");
  };

  return (
    <SupermarketContext.Provider value={{ 
      products, alerts, kpis, 
      inlineUpdateProduct, processPOSOrder 
    }}>
      {children}
    </SupermarketContext.Provider>
  );
};

export const useSupermarket = () => useContext(SupermarketContext);
