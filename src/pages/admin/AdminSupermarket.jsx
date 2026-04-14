import React, { useState } from 'react';
import { useSupermarket } from '../../context/SupermarketContext';
import { Package, Plus, Save, X, Edit3, BarChart2, AlertTriangle, TrendingUp, Lightbulb, Trash2, DollarSign, ClipboardCheck } from 'lucide-react';

export default function AdminSupermarket() {
  const { products, alerts, insights, updateInventoryAndPrice } = useSupermarket();
  const [editingProduct, setEditingProduct] = useState(null);
  const [adminTab, setAdminTab] = useState('inventory'); // 'inventory' | 'analytics'
  // Modal State
  const [addedStock, setAddedStock] = useState(0);
  const [newPrice, setNewPrice] = useState(0);

  const openEditModal = (product) => {
    setEditingProduct(product);
    setAddedStock(0);
    setNewPrice(product.price);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if(editingProduct) {
      updateInventoryAndPrice(editingProduct.id, addedStock, newPrice);
      setEditingProduct(null);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 text-gray-900 font-sans" dir="ltr">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-600 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white tracking-wide">POS & Merchant Brain {"🧠"}</h1>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 bg-emerald-700/50 p-1 rounded-xl">
            <button 
              onClick={() => setAdminTab('inventory')}
              className={`px-4 py-2 font-bold text-sm rounded-lg transition-all ${adminTab === 'inventory' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:text-white'}`}>
              Inventory
            </button>
            <button 
              onClick={() => setAdminTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-lg transition-all ${adminTab === 'analytics' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:text-white'}`}>
              <BarChart2 size={16} /> Automation & Analytics
              {alerts?.length > 0 && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>}
            </button>
            <button 
              onClick={() => setAdminTab('shrinkage')}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-lg transition-all ${adminTab === 'shrinkage' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:text-white'}`}>
              <Trash2 size={16} /> Shrinkage (التوالف)
            </button>
            <button 
              onClick={() => setAdminTab('reconciliation')}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-lg transition-all ${adminTab === 'reconciliation' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:text-white'}`}>
              <DollarSign size={16} /> End Shift (التقفيل)
            </button>
          </div>
        </div>

        {/* Content Area */}
        {adminTab === 'inventory' ? (
          <div className="p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 px-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Product</th>
                <th className="py-4 px-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Price</th>
                <th className="py-4 px-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Physical Shelf</th>
                <th className="py-4 px-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-orange-600">Reserved (Online)</th>
                <th className="py-4 px-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-emerald-600">Available to Sell</th>
                <th className="py-4 px-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-4 px-4 flex items-center gap-4">
                    <img src={product.image} className="w-12 h-12 rounded-lg object-cover bg-gray-100" alt="" />
                    <div>
                      <h3 className="font-bold text-gray-800">{product.name}</h3>
                      <p className="text-xs text-gray-400">{product.unit}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-700">${product.price}</td>
                  <td className="py-4 px-4 font-bold text-gray-600">{product.total_physical_stock}</td>
                  <td className="py-4 px-4 font-bold text-orange-600">{product.reserved_quantity > 0 ? `-${product.reserved_quantity}` : 0}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.stock_quantity > 10 ? 'bg-emerald-100 text-emerald-700' :
                      product.stock_quantity > 0 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.stock_quantity} available
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 px-4 py-2 rounded-lg font-semibold tracking-wide text-sm transition flex items-center gap-2 ml-auto"
                    >
                      <Edit3 size={16}/> Edit Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : (
          <div className="p-6 bg-gray-50 min-h-[400px]">
             
             {/* Dynamic Safety Alerts Section */}
             <div className="mb-8">
               <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                 <AlertTriangle className="text-red-500" />
                 تنبيهات حد الأمان (Critical Restock Alerts)
               </h2>
               
               {alerts.length === 0 ? (
                 <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center gap-3 font-semibold">
                   <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center">{"✓"}</div>
                   جميع المنتجات في النطاق الآمن. لا يوجد نواقص حرجة!
                 </div>
               ) : (
                 <div className="space-y-3">
                   {alerts.map(alert => (
                     <div key={alert.id} className="bg-white border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                       <div>
                         <h3 className="font-bold text-red-700 text-sm mb-1">{alert.title}</h3>
                         <p className="text-gray-600 text-xs font-semibold">{alert.message}</p>
                       </div>
                       <button onClick={() => {setAdminTab('inventory'); openEditModal(products.find(p=>p.id===alert.id));}} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-lg whitespace-nowrap transition">
                         + تحديث المخزون
                       </button>
                     </div>
                   ))}
                 </div>
               )}
             </div>

             {/* Omnichannel Insights Section */}
             <div>
               <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                 <Lightbulb className="text-indigo-500" />
                 رؤى قنوات البيع (Omnichannel Insights)
               </h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {insights.map(insight => (
                   <div key={insight.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                     {/* Decorative background circle */}
                     <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full z-0 group-hover:scale-110 transition-transform"></div>
                     
                     <div className="relative z-10">
                       <div className="flex justify-between items-center mb-3">
                         <h4 className="font-extrabold text-gray-800 flex items-center gap-2">
                           <TrendingUp size={16} className="text-indigo-500"/> {insight.productName}
                         </h4>
                         <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{insight.total_sales} بيعة</span>
                       </div>
                       
                       <p className="text-xs text-gray-600 font-semibold leading-relaxed p-3 bg-gray-50 rounded-lg border border-gray-100 border-l-2 border-l-indigo-400">
                         {insight.text}
                       </p>

                       <div className="mt-4 flex h-2 rounded-full overflow-hidden bg-gray-200">
                         <div style={{ width: `${insight.onlinePct * 100}%` }} className="bg-indigo-500" title="Online App"></div>
                         <div style={{ width: `${insight.instorePct * 100}%` }} className="bg-emerald-400" title="InStore POS"></div>
                       </div>
                       <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1 px-1">
                         <span>أونلاين ({Math.round(insight.onlinePct * 100)}%)</span>
                         <span>الفرع ({Math.round(insight.instorePct * 100)}%)</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

          </div>
        ) : adminTab === 'shrinkage' ? (
           <div className="p-6 bg-gray-50 min-h-[400px]">
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6 border-b pb-4">
                 <Trash2 className="text-red-500" size={24} />
                 تسجيل التوالف والهالك (Shrinkage)
             </h2>
             <div className="max-w-lg bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <p className="text-sm text-gray-500 mb-6">هام: المنتجات التالفة التي يتم تسجيلها هنا تُخصم فوراً من المخزون ولا تُحسب كإيرادات في تقفيل الوردية.</p>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">اختر المنتج عبر الباركود أو القائمة</label>
                   <select className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-3 outline-none font-semibold focus:border-emerald-500">
                     <option value="">-- اضغط أو امسح الباركود --</option>
                     {products.map(p => <option key={p.id} value={p.id}>{p.name} (متوفر: {p.total_physical_stock})</option>)}
                   </select>
                 </div>
                 
                 <div className="flex gap-4">
                   <div className="flex-1">
                     <label className="block text-sm font-bold text-gray-700 mb-2">الكمية التالفة</label>
                     <input type="number" min="1" className="w-full border border-gray-200 rounded-lg p-3 font-bold" placeholder="مثال: 2" />
                   </div>
                   <div className="flex-1">
                     <label className="block text-sm font-bold text-gray-700 mb-2">السبب</label>
                     <select className="w-full border border-gray-200 rounded-lg p-3 font-semibold text-gray-700">
                       <option>انتهاء صلاحية</option>
                       <option>كسر/تلف</option>
                       <option>إرجاع مورد</option>
                     </select>
                   </div>
                 </div>

                 <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                   <Trash2 size={18} /> تسجيل الخصم من المخزون
                 </button>
               </div>
             </div>
           </div>
        ) : adminTab === 'reconciliation' ? (
           <div className="p-6 bg-gray-50 min-h-[400px]">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6 border-b pb-4">
                 <ClipboardCheck className="text-emerald-600" size={24} />
                 تقفيل الوردية اليومي (Shift Reconciliation)
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                 <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                   <Package size={24} />
                 </div>
                 <h3 className="text-sm font-bold text-gray-500 mb-1">POS مبيعات درج</h3>
                 <span className="text-2xl font-black text-gray-800">4,250 ج.م</span>
                 <span className="text-xs text-green-500 font-bold mt-1">مدفوعة نقداً</span>
               </div>
               
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                 <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                   <DollarSign size={24} />
                 </div>
                 <h3 className="text-sm font-bold text-gray-500 mb-1">عهد الطيارين (توصيل)</h3>
                 <span className="text-2xl font-black text-gray-800">1,150 ج.م</span>
                 <span className="text-xs text-orange-500 font-bold mt-1">يجب تحصيلها منهم الآن</span>
               </div>

               <div className="bg-emerald-600 p-6 rounded-2xl shadow-lg border border-emerald-500 flex flex-col items-center justify-center text-center text-white">
                 <h3 className="text-sm font-bold text-emerald-100 mb-2">إجمالي نقدية الوردية</h3>
                 <span className="text-4xl font-black mb-1">5,400 <span className="text-xl">ج.م</span></span>
                 <span className="text-xs font-medium text-emerald-200">يجب وضع هذا المبلغ في الخزنة</span>
               </div>
             </div>

             <div className="max-w-2xl bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-800 mb-4">تسوية نقدية الطيارين (Driver Remittance)</h3>
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">م</div>
                     <div>
                       <h4 className="font-bold text-gray-800">محمود طيار الديلفري</h4>
                       <p className="text-xs text-gray-500">معلق لديه: <span className="font-bold text-orange-600">1,150 ج.م</span></p>
                     </div>
                   </div>
                   <button className="bg-emerald-100 hover:bg-emerald-500 hover:text-white text-emerald-700 font-bold px-4 py-2 rounded-lg text-sm transition">
                      استلام العهدة
                   </button>
                </div>

                <button className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg">
                   <ClipboardCheck size={20} /> إنهاء الوردية وتصفير العداد (Close Shift)
                </button>
             </div>
           </div>
        ) : null}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button type="button" onClick={() => setEditingProduct(null)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition">
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Package className="text-emerald-500" />
              Update Product
            </h2>

            {/* Current Context */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 flex items-center gap-4">
               <img src={editingProduct.image} className="w-16 h-16 rounded-xl object-cover" />
               <div>
                  <h3 className="font-bold text-gray-800">{editingProduct.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Available Stock: <span className="font-bold text-emerald-600">{editingProduct.stock_quantity}</span></p>
                  <p className="text-sm text-gray-500">Reserved (Online): <span className="font-bold text-orange-500">{editingProduct.reserved_quantity}</span></p>
               </div>
            </div>

            {/* Editing Inputs */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Add Stock Accumulation</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Plus className="text-gray-400" size={18} />
                  </div>
                  <input 
                    type="number" 
                    min="0"
                    value={addedStock}
                    onChange={(e) => setAddedStock(parseInt(e.target.value) || 0)}
                    className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition font-semibold"
                    placeholder="Enter cartons received..."
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">This will be *added* to the existing stock.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Edit Central Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-bold">$</div>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
              <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg hover:shadow-emerald-500/30">
                <Save size={20} />
                Save & Broadcast
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
