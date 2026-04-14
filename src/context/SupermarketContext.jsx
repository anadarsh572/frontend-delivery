import React, { createContext, useState, useEffect, useContext } from 'react';

export const SupermarketContext = createContext();

const defaultProducts = [
  { id: 1, name: 'طماطم بلدي طازجة', price: 15, low_stock_threshold: 10, total_physical_stock: 0, reserved_quantity: 0, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500', unit: '1 كيلو', discount: null, barcode: '1001' },
  { id: 2, name: 'حليب كامل الدسم', price: 35, low_stock_threshold: 5, total_physical_stock: 5, reserved_quantity: 2, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500', unit: '1 لتر', discount: null, barcode: '1002' },
  { id: 3, name: 'خبز فرنسي طازج', price: 20, low_stock_threshold: 15, total_physical_stock: 0, reserved_quantity: 0, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500', unit: '3 قطع', discount: null, barcode: '1003' },
  { id: 4, name: 'موز استيراد', price: 40, low_stock_threshold: 5, total_physical_stock: 20, reserved_quantity: 0, image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=500', unit: '1 كيلو', discount: 'عروض اليوم', barcode: '1004' },
];

const mockSalesAnalytics = [
  { productId: 1, online_sales: 120, instore_sales: 30 },
  { productId: 2, online_sales: 50, instore_sales: 150 },
  { productId: 4, online_sales: 200, instore_sales: 200 },
];

const initialOrders = [
  { id: 101, customer: "أحمد علي", total: 120, status: "Pending", method: "delivery", time: "10:30 AM" },
  { id: 102, customer: "عمر خالد", total: 45, status: "Preparing", method: "pickup", time: "11:00 AM" }
];

export const SupermarketProvider = ({ children }) => {
  const [internalProducts, setInternalProducts] = useState(() => {
    const saved = localStorage.getItem('supermarket_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('supermarket_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [revenue, setRevenue] = useState(4250); // Daily mock revenue

  // Cross-Tab Sync
  useEffect(() => {
    localStorage.setItem('supermarket_products', JSON.stringify(internalProducts));
  }, [internalProducts]);

  useEffect(() => {
    localStorage.setItem('supermarket_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'supermarket_products') setInternalProducts(JSON.parse(e.newValue));
      if (e.key === 'supermarket_orders') setOrders(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const products = internalProducts.map(p => ({
    ...p,
    stock_quantity: Math.max(0, p.total_physical_stock - p.reserved_quantity)
  }));

  const alerts = products.filter(p => p.stock_quantity <= p.low_stock_threshold).map(p => ({
    id: p.id,
    title: `تنبيه حد الأمان: ${p.name}`,
    message: `الرصيد المتاح (${p.stock_quantity}) حرج جداً!`,
    severity: p.stock_quantity === 0 ? 'critical' : 'warning'
  }));

  const kpis = {
    revenue,
    ordersCount: orders.length,
    pendingCount: orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length,
    deliveredCount: orders.filter(o => o.status === 'Completed').length,
  };

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

  const inlineUpdateProduct = (productId, updates) => {
    setInternalProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (newStatus === 'Completed') {
       // Mock Revenue generation
       setRevenue(r => r + orders.find(o => o.id === orderId).total);
    }
  };

  const processPOSOrder = (cartItems, total) => {
    // Deduct physical stock
    setInternalProducts(prev => prev.map(p => {
       const cartItem = cartItems.find(i => i.id === p.id);
       if(cartItem) {
          return { ...p, total_physical_stock: Math.max(0, p.total_physical_stock - 1) }; // mock deducting quantity
       }
       return p;
    }));
    setRevenue(r => r + total);
    alert("تم الدفع بنجاح وتسجيل المبيعات!");
  };

  const reserveStock = (orderItems) => {
    setInternalProducts((prevProducts) =>
      prevProducts.map((p) => {
        const itemInOrder = orderItems.find(item => item.id === p.id);
        if (itemInOrder) return { ...p, reserved_quantity: p.reserved_quantity + 1 };
        return p;
      })
    );
  };

  return (
    <SupermarketContext.Provider value={{ 
      products, alerts, orders, kpis, 
      updateInventoryAndPrice, inlineUpdateProduct, 
      reserveStock, updateOrderStatus, processPOSOrder 
    }}>
      {children}
    </SupermarketContext.Provider>
  );
};

export const useSupermarket = () => useContext(SupermarketContext);
