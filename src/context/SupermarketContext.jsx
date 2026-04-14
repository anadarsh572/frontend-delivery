import React, { createContext, useState, useEffect, useContext } from 'react';

export const SupermarketContext = createContext();

const defaultProducts = [
  { id: 1, name: 'طماطم بلدي طازجة', price: 15, low_stock_threshold: 10, total_physical_stock: 0, reserved_quantity: 0, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500', unit: '1 كيلو', discount: null },
  { id: 2, name: 'حليب كامل الدسم', price: 35, low_stock_threshold: 5, total_physical_stock: 5, reserved_quantity: 2, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500', unit: '1 لتر', discount: null },
  { id: 3, name: 'خبز فرنسي طازج', price: 20, low_stock_threshold: 15, total_physical_stock: 0, reserved_quantity: 0, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500', unit: '3 قطع', discount: null },
  { id: 4, name: 'موز استيراد', price: 40, low_stock_threshold: 5, total_physical_stock: 20, reserved_quantity: 0, image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=500', unit: '1 كيلو', discount: 'عروض اليوم' },
];

// Mock Sales Data mimicking the SQL Query Output
const mockSalesAnalytics = [
  { productId: 1, online_sales: 120, instore_sales: 30 },
  { productId: 2, online_sales: 50, instore_sales: 150 },
  { productId: 4, online_sales: 200, instore_sales: 200 },
];

export const SupermarketProvider = ({ children }) => {
  const [internalProducts, setInternalProducts] = useState(() => {
    const saved = localStorage.getItem('supermarket_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  // Cross-Tab Real-Time Sync
  useEffect(() => {
    localStorage.setItem('supermarket_products', JSON.stringify(internalProducts));
  }, [internalProducts]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'supermarket_products') {
        setInternalProducts(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Compute available stock dynamically
  const products = internalProducts.map(p => ({
    ...p,
    stock_quantity: p.total_physical_stock - p.reserved_quantity
  }));

  // Smart Engine 1: Compute Safety Alerts dynamically based on True Available Stock
  const alerts = products.filter(p => p.stock_quantity <= p.low_stock_threshold).map(p => ({
    id: p.id,
    title: `تنبيه حد الأمان: ${p.name}`,
    message: `الرصيد المتاح للبيع (${p.stock_quantity}) أقل من أو يساوي حد الأمان (${p.low_stock_threshold}). يرجى طلب كمية جديدة من المورد للضرورة القصوى!`,
    severity: p.stock_quantity === 0 ? 'critical' : 'warning'
  }));

  // Smart Engine 2: Generate Insights from Omnichannel Sales Data
  const insights = mockSalesAnalytics.map(saleData => {
    const p = products.find(prod => prod.id === saleData.productId);
    if(!p) return null;
    const total_sales = saleData.online_sales + saleData.instore_sales;
    const onlinePct = total_sales > 0 ? (saleData.online_sales / total_sales) : 0;
    const instorePct = total_sales > 0 ? (saleData.instore_sales / total_sales) : 0;

    let insightText = '';
    if (onlinePct >= 0.70) {
      insightText = `التشخيص: ${Math.round(onlinePct*100)}% من مبيعات (${p.name}) تأتي عبر تطبيق الأونلاين. التوصية: زيادة مخزون هذا المنتج للمشتريات الرقمية وإطلاق حملات تسويقية له!`;
    } else if (instorePct >= 0.70) {
      insightText = `التشخيص: إقبال كبير داخل الفرع لمنتج (${p.name}). التوصية: تحسين أرفف العرض المادية للمنتج لزيادة المبيعات.`;
    } else {
      insightText = `التشخيص: توازن ممتاز في مبيعات (${p.name}) بين الأونلاين والفرع.`;
    }

    return { id: p.id, productName: p.name, text: insightText, onlinePct, instorePct, total_sales };
  }).filter(Boolean);

  // Admin function
  const updateInventoryAndPrice = (productId, addedStock, newPrice) => {
    setInternalProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            total_physical_stock: p.total_physical_stock + parseInt(addedStock || 0),
            price: parseFloat(newPrice)
          };
        }
        return p;
      })
    );
  };

  // Customer checkout reservation function
  const reserveStock = (orderItems) => {
    setInternalProducts((prevProducts) =>
      prevProducts.map((p) => {
        const itemInOrder = orderItems.find(item => item.id === p.id);
        if (itemInOrder) {
          return {
            ...p,
            reserved_quantity: p.reserved_quantity + 1 // Simply +1 for demo based on cart items
          };
        }
        return p;
      })
    );
  };

  return (
    <SupermarketContext.Provider value={{ products, alerts, insights, updateInventoryAndPrice, reserveStock }}>
      {children}
    </SupermarketContext.Provider>
  );
};

export const useSupermarket = () => useContext(SupermarketContext);

