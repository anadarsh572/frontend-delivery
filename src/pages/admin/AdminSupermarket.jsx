import React, { useState, useEffect } from 'react';
import { useSupermarket } from '../../context/SupermarketContext';
import { 
  Package, LayoutDashboard, ShoppingBag, ShoppingCart, 
  Menu, X, Bell, TrendingUp, AlertTriangle, CheckSquare, 
  Clock, CheckCircle, Search, ScanBarcode, Minus, Plus, Save
} from 'lucide-react';

export default function UnifiedAdminDashboard() {
  const { products, alerts, orders, kpis, inlineUpdateProduct, processPOSOrder, updateOrderStatus } = useSupermarket();
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | inventory | orders | pos
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // === POS State ===
  const [posCart, setPosCart] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('');

  // POS Barcode Listener Effect
  useEffect(() => {
    if (activeTab !== 'pos') return;
    const handleKeyPress = (e) => {
      // Ignore if typing in a generic input (unless it's our specific hidden barcode input if we had one)
      if (e.target.tagName === 'INPUT' && e.target.type !== 'text') return;
      if (e.key === 'Enter') {
         const p = products.find(prod => prod.barcode === barcodeInput);
         if(p && p.stock_quantity > 0) addToPos(p);
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
    activeTab === tab ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-700'
  }`;

  const renderSidebar = () => (
    <div className="w-64 bg-white border-l border-gray-200 h-full flex flex-col fixed sm:relative z-40 right-0 top-0 transition-transform transform translate-x-0">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h1 className="text-xl font-black text-emerald-700 flex items-center gap-2">
          <Package className="text-emerald-500"/>
          إدارة السوبر ماركت
        </h1>
        <button className="sm:hidden text-gray-500" onClick={() => setMobileMenuOpen(false)}>
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
        <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className={tabClass('dashboard')}>
          <LayoutDashboard size={20}/> النبض (الرئيسية)
        </button>
        <button onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }} className={tabClass('inventory')}>
          <Package size={20}/> محرك المخزون المباشر
        </button>
        <button onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }} className={tabClass('orders')}>
          <ShoppingBag size={20}/> إدارة الطلبات {kpis.pendingCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full mr-auto animate-pulse">{kpis.pendingCount}</span>}
        </button>
        <button onClick={() => { setActiveTab('pos'); setMobileMenuOpen(false); }} className={tabClass('pos')}>
          <ShoppingCart size={20}/> نقطة البيع (POS)
        </button>
      </div>
    </div>
  );

  // --- Sub-View: 1. Dashboard ---
  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-black text-gray-800">نظرة عامة على الأداء</h2>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><TrendingUp size={28}/></div>
          <div><p className="text-sm font-bold text-gray-500">إجمالي الإيرادات</p><h3 className="text-2xl font-black text-gray-800">{kpis.revenue} ج.م</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Clock size={28}/></div>
          <div><p className="text-sm font-bold text-gray-500">طلبات معلقة</p><h3 className="text-2xl font-black text-gray-800">{kpis.pendingCount} طلب</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><CheckCircle size={28}/></div>
          <div><p className="text-sm font-bold text-gray-500">تم التوصيل</p><h3 className="text-2xl font-black text-gray-800">{kpis.deliveredCount} طلب</h3></div>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h3 className="flex items-center gap-2 text-xl font-bold text-red-700 mb-4"><AlertTriangle size={24}/> تنبيهات المخزون الحرجة</h3>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-red-500">
                <div><h4 className="font-bold text-gray-800">{alert.title}</h4><p className="text-sm text-gray-600">{alert.message}</p></div>
                <button onClick={() => setActiveTab('inventory')} className="mt-3 sm:mt-0 text-sm bg-red-100 text-red-700 px-4 py-2 font-bold rounded-lg hover:bg-red-200">تحديث المخزون</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // --- Sub-View: 2. Smart Inventory ---
  const handleInlineEdit = (id, field, value) => {
    let val = field === 'price' || field === 'total_physical_stock' ? Number(value) : value;
    inlineUpdateProduct(id, { [field]: val });
  };

  const renderInventory = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black text-gray-800">محرك المخزون الذكي</h2>
         <p className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border inline-block">التعديلات تنعكس فوراً للعميل</p>
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-6 text-right font-bold text-gray-500 text-xs">المنتج</th>
              <th className="py-4 px-6 text-right font-bold text-gray-500 text-xs text-orange-600">محجوز للأونلاين</th>
              <th className="py-4 px-6 text-right font-bold text-gray-500 text-xs bg-emerald-50">المخزون المادي (تعديل)</th>
              <th className="py-4 px-6 text-right font-bold text-gray-500 text-xs">السعر (تعديل)</th>
              <th className="py-4 px-6 text-right font-bold text-gray-500 text-xs">الباركود (تعديل)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="py-4 px-6 text-right flex items-center gap-3">
                  <img src={p.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  <div><p className="font-bold text-gray-800">{p.name}</p><span className={`text-xs px-2 py-0.5 rounded-full font-bold ${p.stock_quantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{p.stock_quantity} متاح للبيع</span></div>
                </td>
                <td className="py-4 px-6 text-right font-black text-orange-500 text-lg">{p.reserved_quantity}</td>
                <td className="py-4 px-6 text-right bg-emerald-50/30">
                  <input type="number" value={p.total_physical_stock} onChange={(e) => handleInlineEdit(p.id, 'total_physical_stock', e.target.value)}
                         className="w-20 bg-white border border-gray-300 rounded-lg p-2 font-bold text-center outline-none focus:border-emerald-500 transition"/>
                </td>
                <td className="py-4 px-6 text-right">
                  <input type="number" value={p.price} onChange={(e) => handleInlineEdit(p.id, 'price', e.target.value)}
                         className="w-24 bg-white border border-gray-200 rounded-lg p-2 font-bold text-center outline-none focus:border-emerald-500 transition"/>
                </td>
                <td className="py-4 px-6 text-right">
                  <input type="text" value={p.barcode || ''} onChange={(e) => handleInlineEdit(p.id, 'barcode', e.target.value)} placeholder="مسح..."
                         className="w-32 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-semibold text-center outline-none focus:bg-white focus:border-emerald-500"/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="sm:hidden grid grid-cols-1 gap-4">
         {products.map(p => (
           <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                 <img src={p.image} className="w-14 h-14 rounded-lg object-cover" alt="" />
                 <div><h3 className="font-bold text-gray-800">{p.name}</h3><p className={`text-xs font-bold ${p.stock_quantity > 0 ? 'text-emerald-500' : 'text-red-500'}`}>متاح للسحب: {p.stock_quantity}</p></div>
              </div>
              <div className="flex gap-2">
                 <div className="flex-1 bg-gray-50 rounded-xl p-2 border border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-bold">المخزون</span>
                    <div className="flex items-center gap-3">
                       <button onClick={() => inlineUpdateProduct(p.id, { total_physical_stock: Math.max(0, p.total_physical_stock - 1)})} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-red-500 font-bold active:scale-95"><Minus size={18}/></button>
                       <span className="font-black text-lg">{p.total_physical_stock}</span>
                       <button onClick={() => inlineUpdateProduct(p.id, { total_physical_stock: p.total_physical_stock + 1})} className="w-8 h-8 rounded-lg bg-emerald-500 shadow-sm flex items-center justify-center text-white font-bold active:scale-95"><Plus size={18}/></button>
                    </div>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );

  // --- Sub-View: 3. Kanban Orders ---
  const renderOrders = () => {
    const cols = ['Pending', 'Preparing', 'Completed'];
    const colTitles = { Pending: 'طلبات جديدة', Preparing: 'جاري التجهيز', Completed: 'تم التسليم' };
    const colColors = { Pending: 'border-orange-500 bg-orange-50', Preparing: 'border-blue-500 bg-blue-50', Completed: 'border-emerald-500 bg-emerald-50' };

    return (
      <div className="space-y-6 h-full flex flex-col animate-fade-in">
        <h2 className="text-2xl font-black text-gray-800">إدارة الطلبات (Kanban)</h2>
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-[800px] h-full">
            {cols.map(status => (
              <div key={status} className={`flex-1 rounded-2xl p-4 border-t-4 shadow-sm flex flex-col gap-4 ${colColors[status]}`}>
                 <h3 className="font-black text-gray-700 text-lg">{colTitles[status]} <span className="bg-white px-2 py-1 rounded-md text-sm border shadow-sm mx-2">{orders.filter(o => o.status === status).length}</span></h3>
                 {orders.filter(o => o.status === status).map(o => (
                   <div key={o.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-black text-gray-800">#{o.id}</span>
                        <span className="text-xs font-bold text-gray-400">{o.time}</span>
                      </div>
                      <p className="font-bold text-gray-700 mb-1">{o.customer}</p>
                      <p className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 flex inline-flex rounded-lg mb-3">{o.total} ج.م</p>
                      
                      {/* Action Buttons to move status */}
                      <div className="flex gap-2 mt-2">
                         {status === 'Pending' && <button onClick={() => updateOrderStatus(o.id, 'Preparing')} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-700">تجهيز</button>}
                         {status === 'Preparing' && <button onClick={() => updateOrderStatus(o.id, 'Completed')} className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-emerald-700">تسليم للعميل</button>}
                      </div>
                   </div>
                 ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- Sub-View: 4. Integrated POS ---
  const addToPos = (p) => {
    if(p.stock_quantity <= 0) return alert('المنتج نفد من الرف المادي!');
    setPosCart(prev => [...prev, { ...p, cartId: Date.now() }]);
  };
  
  const removePosItem = (cartId) => {
    setPosCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const handlePosCheckout = () => {
    if(posCart.length === 0) return;
    const total = posCart.reduce((sum, item) => sum + item.price, 0);
    processPOSOrder(posCart, total);
    setPosCart([]);
  };

  const renderPOS = () => {
    const total = posCart.reduce((sum, item) => sum + item.price, 0);
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col sm:flex-row gap-6 animate-fade-in pb-10">
        
        {/* Right Side: Fast Product Tap Grid */}
        <div className="flex-[2] bg-white rounded-3xl shadow-sm border border-gray-200 p-6 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-black text-gray-800">المنتجات السريعة</h2>
             <div className="flex bg-gray-100 items-center px-4 py-2 rounded-xl text-gray-500 font-bold text-sm">
                <ScanBarcode size={20} className="mr-2 opacity-50"/> مستمع الباركود مفعل (Scanner is listening)
             </div>
          </div>
          <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pr-2 custom-scrollbar">
            {products.map(p => (
              <button key={p.id} onClick={() => addToPos(p)} disabled={p.stock_quantity <= 0} 
                      className="bg-white border hover:border-emerald-400 shadow-sm hover:shadow-md rounded-2xl p-4 flex flex-col items-center gap-3 transition active:scale-95 disabled:opacity-50 disabled:active:scale-100">
                <img src={p.image} className="w-16 h-16 rounded-full object-cover" alt="" />
                <h3 className="font-bold text-gray-700 text-sm text-center leading-tight">{p.name}</h3>
                <span className="font-black text-emerald-600 block">{p.price} ج</span>
              </button>
            ))}
          </div>
        </div>

        {/* Left Side: Receipt & Checkout */}
        <div className="flex-1 bg-gray-900 text-white rounded-3xl shadow-xl flex flex-col overflow-hidden p-6 relative">
           <h2 className="text-xl font-black text-white mb-6 border-b border-gray-700 pb-4">قائمة الكاشير (الفاتورة)</h2>
           <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar mb-6">
              {posCart.length === 0 ? (
                <div className="text-gray-500 font-bold text-center mt-20 flex flex-col items-center justify-center h-full">السلة فارغة المحتوى<br/>امسح باركود لبدء المبيعات</div>
              ) : posCart.map((item, idx) => (
                <div key={item.cartId} className="flex justify-between items-center bg-gray-800 p-3 rounded-xl border border-gray-700">
                   <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-bold">{idx + 1}.</span>
                      <p className="font-bold text-gray-200 text-sm">{item.name}</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="font-bold text-emerald-400">{item.price} ج</span>
                      <button onClick={() => removePosItem(item.cartId)} className="text-red-400 hover:bg-red-500 hover:text-white p-1 rounded transition"><X size={16}/></button>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mt-auto">
             <div className="flex justify-between text-gray-400 font-bold mb-2"><span>الصافي:</span><span>{total} ج.م</span></div>
             <div className="flex justify-between text-2xl font-black text-emerald-400 mb-6"><span>الإجمالي:</span><span>{total} ج.م</span></div>
             <button onClick={handlePosCheckout} disabled={posCart.length === 0} 
                     className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-black py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                <CheckSquare size={24}/> تأكيد البيع واستلام النقدية
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
        <span className="font-black text-gray-800">إدارة السوبر ماركت</span>
        <div className="relative">
          <Bell className="text-gray-600" />
          {alerts.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="flex h-[calc(100vh-60px)] sm:h-screen overflow-hidden">
        
        {/* Sidebar Injection for Mobile & Desktop */}
        <div className={`${mobileMenuOpen ? 'fixed inset-0 bg-black/50 z-50' : 'hidden'} sm:block sm:w-64 flex-shrink-0 transition-opacity`}>
           <div className={`h-full ${mobileMenuOpen ? 'w-64 max-w-[80vw]' : 'w-full'}`}>
              {renderSidebar()}
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-4 sm:p-8">
           {activeTab === 'dashboard' && renderDashboard()}
           {activeTab === 'inventory' && renderInventory()}
           {activeTab === 'orders' && renderOrders()}
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
