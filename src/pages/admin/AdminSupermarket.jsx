import React, { useState, useEffect } from 'react';
import { useSupermarket } from '../../context/SupermarketContext';
import { 
  Package, LayoutDashboard, ShoppingCart, 
  Menu, X, Bell, TrendingUp, AlertTriangle, CheckSquare, 
  ScanBarcode, Save, Activity, Target
} from 'lucide-react';

export default function UnifiedAdminDashboard() {
  const { products, alerts, kpis, inlineUpdateProduct, processPOSOrder } = useSupermarket();
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | inventory | pos
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // === POS State ===
  const [posCart, setPosCart] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('');

  // POS Barcode Listener Effect
  useEffect(() => {
    if (activeTab !== 'pos') return;
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' && e.target.type !== 'text') return;
      if (e.key === 'Enter') {
         const p = products.find(prod => prod.barcode === barcodeInput);
         if(p && p.current_stock > 0) addToPos(p);
         setBarcodeInput('');
      } else {
         setBarcodeInput(prev => prev + e.key);
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [barcodeInput, activeTab, products]);

  // === Handlers ===
  const tabClass = (tab) => `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
    activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-700'
  }`;

  const renderSidebar = () => (
    <div className="w-64 bg-white border-l border-gray-200 h-full flex flex-col fixed sm:relative z-40 right-0 top-0 transition-transform transform translate-x-0">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h1 className="text-xl font-black text-indigo-800 flex items-center gap-2">
          <Activity className="text-indigo-500"/>
          ERP Merchant
        </h1>
        <button className="sm:hidden text-gray-500" onClick={() => setMobileMenuOpen(false)}>
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
        <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className={tabClass('dashboard')}>
          <LayoutDashboard size={20}/> نبض المؤسسة
        </button>
        <button onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }} className={tabClass('inventory')}>
          <Package size={20}/> جرد المخازن
        </button>
        <button onClick={() => { setActiveTab('pos'); setMobileMenuOpen(false); }} className={tabClass('pos')}>
          <ShoppingCart size={20}/> كاشير الفرع
        </button>
      </div>
    </div>
  );

  // --- Sub-View: 1. Dashboard (ERP Pulse) ---
  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-black text-gray-800">نظرة عامة محاسبية</h2>
      
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
          <p className="text-sm font-bold text-gray-500 mb-2">إجمالي المبيعات (Revenue)</p>
          <h3 className="text-3xl font-black text-indigo-700">{kpis.revenue} ج.م</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
          <p className="text-sm font-bold text-gray-500 mb-2">تكلفة البضاعة المباعة (COGS)</p>
          <h3 className="text-3xl font-black text-red-600">{kpis.cogs} ج.م</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
          <p className="text-sm font-bold text-gray-500 mb-2">صافي الربح (Net Profit)</p>
          <h3 className="text-3xl font-black text-emerald-600">{kpis.revenue - kpis.cogs} ج.م</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
          <p className="text-sm font-bold text-gray-500 mb-2">هامش الربح (Margin)</p>
          <h3 className="text-3xl font-black text-orange-500">{kpis.profitMargin}%</h3>
        </div>
      </div>

      {/* Critical Stock Purchase Orders Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mt-8">
          <h3 className="flex items-center gap-2 text-xl font-bold text-red-700 mb-4"><Target size={24}/> أوامر شراء مطلوبة (نواقص)</h3>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-red-500">
                <div><h4 className="font-bold text-gray-800">{alert.title}</h4><p className="text-sm text-gray-600">{alert.message}</p></div>
                <button onClick={() => setActiveTab('inventory')} className="mt-3 sm:mt-0 text-sm bg-red-100 text-red-700 px-4 py-2 font-bold rounded-lg hover:bg-red-200">إنشاء Purchase Order</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // --- Sub-View: 2. ERP Inventory ---
  const handleInlineEdit = (id, field, value) => {
    let val = (field === 'purchase_price' || field === 'selling_price' || field === 'current_stock' || field === 'min_stock') ? Number(value) : value;
    inlineUpdateProduct(id, { [field]: val });
  };

  const renderInventory = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black text-gray-800">بيانات المخزون والأساسيات</h2>
         <p className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border">Autosave Active</p>
      </div>

      {/* Desktop Grid ERP */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-indigo-50 border-b border-indigo-100">
            <tr>
              <th className="py-4 px-4 text-right font-bold text-gray-600 text-sm">كود الصنف</th>
              <th className="py-4 px-4 text-right font-bold text-gray-600 text-sm">المنتج</th>
              <th className="py-4 px-4 text-right font-bold text-gray-600 text-sm">سعر التكلفة</th>
              <th className="py-4 px-4 text-right font-bold text-gray-600 text-sm">سعر البيع</th>
              <th className="py-4 px-4 text-right font-bold text-gray-600 text-sm">المخزون الفعلي</th>
              <th className="py-4 px-4 text-right font-bold text-gray-600 text-sm border-l">أمان التنبيه</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-indigo-50/30 transition">
                <td className="py-3 px-4 text-right">
                  <input type="text" value={p.barcode || ''} onChange={(e) => handleInlineEdit(p.id, 'barcode', e.target.value)}
                         className="w-28 bg-gray-50 border border-transparent rounded p-1 text-sm font-mono text-center focus:bg-white focus:border-indigo-500 outline-none"/>
                </td>
                <td className="py-3 px-4 text-right font-bold text-gray-800">{p.name}</td>
                <td className="py-3 px-4 text-right">
                  <input type="number" value={p.purchase_price} onChange={(e) => handleInlineEdit(p.id, 'purchase_price', e.target.value)}
                         className="w-20 bg-red-50 border border-transparent rounded p-1 font-bold text-red-700 text-center focus:border-red-500 outline-none"/>
                </td>
                <td className="py-3 px-4 text-right">
                  <input type="number" value={p.selling_price} onChange={(e) => handleInlineEdit(p.id, 'selling_price', e.target.value)}
                         className="w-20 bg-emerald-50 border border-transparent rounded p-1 font-bold text-emerald-700 text-center focus:border-emerald-500 outline-none"/>
                </td>
                <td className="py-3 px-4 text-right bg-indigo-50/20">
                  <input type="number" value={p.current_stock} onChange={(e) => handleInlineEdit(p.id, 'current_stock', e.target.value)}
                         className="w-20 bg-white border border-gray-300 rounded p-1 font-black text-center focus:border-indigo-500 outline-none"/>
                </td>
                <td className="py-3 px-4 text-right border-l">
                  <input type="number" value={p.min_stock} onChange={(e) => handleInlineEdit(p.id, 'min_stock', e.target.value)}
                         className="w-16 bg-gray-50 border border-transparent rounded p-1 font-bold text-gray-500 text-center focus:border-indigo-500 outline-none"/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="sm:hidden grid grid-cols-1 gap-4">
         {products.map(p => (
           <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-3">
              <div><h3 className="font-bold text-gray-800">{p.name}</h3><p className="text-xs text-gray-400">{p.barcode}</p></div>
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                 <div className="bg-red-50 p-2 rounded text-red-700 text-center">تكلفة: {p.purchase_price}</div>
                 <div className="bg-emerald-50 p-2 rounded text-emerald-700 text-center">بيع: {p.selling_price}</div>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded mt-2 border">
                 <span className="font-bold text-gray-600 text-sm">في المخزن:</span>
                 <input type="number" value={p.current_stock} onChange={e => handleInlineEdit(p.id, 'current_stock', e.target.value)} className="w-16 font-black p-1 text-center border rounded"/>
              </div>
           </div>
         ))}
      </div>
    </div>
  );

  // --- Sub-View: 3. Integrated POS ---
  const addToPos = (p) => {
    if(p.current_stock <= 0) return alert('الرصيد الفعلي يمنع البيع (غير متوفر)');
    setPosCart(prev => [...prev, { ...p, cartId: Date.now() }]);
  };
  
  const removePosItem = (cartId) => {
    setPosCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const handlePosCheckout = () => {
    if(posCart.length === 0) return;
    const totalSale = posCart.reduce((sum, item) => sum + item.selling_price, 0);
    const totalCost = posCart.reduce((sum, item) => sum + item.purchase_price, 0);
    processPOSOrder(posCart, totalSale, totalCost);
    setPosCart([]);
  };

  const renderPOS = () => {
    const total = posCart.reduce((sum, item) => sum + item.selling_price, 0);
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col sm:flex-row gap-6 animate-fade-in pb-10">
        
        {/* Right Side: Fast Product Tap Grid */}
        <div className="flex-[2] bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-black text-gray-800">ميزة المسح أو الضغط</h2>
             <div className="flex bg-gray-100 items-center px-4 py-2 rounded-xl text-gray-500 font-bold text-sm">
                <ScanBarcode size={20} className="mr-2 opacity-50"/> جاهز لالتقاط الباركود
             </div>
          </div>
          <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pr-2 custom-scrollbar">
            {products.map(p => (
              <button key={p.id} onClick={() => addToPos(p)} disabled={p.current_stock <= 0} 
                      className="bg-white border hover:border-indigo-400 shadow-sm hover:shadow-md rounded-xl p-4 flex flex-col items-center gap-3 transition active:scale-95 disabled:opacity-50 disabled:active:scale-100">
                <h3 className="font-bold text-gray-700 text-sm text-center leading-tight">{p.name}</h3>
                <span className="font-black text-indigo-600 block">{p.selling_price} ج</span>
                <span className="text-xs text-gray-400 border-t pt-1 w-full text-center">مخزون: {p.current_stock}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Left Side: Receipt & Checkout */}
        <div className="flex-1 bg-gray-900 text-white rounded-2xl shadow-xl flex flex-col overflow-hidden p-6 relative">
           <h2 className="text-xl font-black text-white mb-6 border-b border-gray-700 pb-4">قائمة الكاشير</h2>
           <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar mb-6">
              {posCart.length === 0 ? (
                <div className="text-gray-500 font-bold text-center mt-20 flex flex-col items-center justify-center h-full">السلة فارغة</div>
              ) : posCart.map((item, idx) => (
                <div key={item.cartId} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg border border-gray-700">
                   <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-bold">{idx + 1}.</span>
                      <p className="font-bold text-gray-200 text-sm">{item.name}</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="font-bold text-indigo-400">{item.selling_price} ج</span>
                      <button onClick={() => removePosItem(item.cartId)} className="text-red-400 hover:bg-red-500 hover:text-white p-1 rounded transition"><X size={16}/></button>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mt-auto">
             <div className="flex justify-between text-2xl font-black text-indigo-400 mb-6"><span>الإجمالي:</span><span>{total} ج.م</span></div>
             <button onClick={handlePosCheckout} disabled={posCart.length === 0} 
                     className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-black py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                <CheckSquare size={24}/> ترحيل المبيعات للمخزن
             </button>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans" dir="rtl">
      
      {/* Mobile Topbar */}
      <div className="sm:hidden bg-white px-4 py-4 border-b flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <button onClick={() => setMobileMenuOpen(true)} className="text-gray-700 p-1"><Menu size={28} /></button>
        <span className="font-black text-indigo-800">ERP Merchant</span>
        <div className="relative">
          <Bell className="text-gray-600" />
          {alerts.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
        </div>
      </div>

      <div className="flex h-[calc(100vh-60px)] sm:h-screen overflow-hidden">
        
        {/* Sidebar Injection */}
        <div className={`${mobileMenuOpen ? 'fixed inset-0 bg-black/50 z-50' : 'hidden'} sm:block sm:w-64 flex-shrink-0 transition-opacity`}>
           <div className={`h-full ${mobileMenuOpen ? 'w-64 max-w-[80vw]' : 'w-full'}`}>
              {renderSidebar()}
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-4 sm:p-8">
           {activeTab === 'dashboard' && renderDashboard()}
           {activeTab === 'inventory' && renderInventory()}
           {activeTab === 'pos' && renderPOS()}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
