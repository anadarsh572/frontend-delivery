import React, { useState } from 'react';
import { Search, ShoppingCart, User, Home as HomeIcon, Menu, ArrowRight, ChevronDown, Check, Clock, MapPin, CreditCard, ChevronLeft } from 'lucide-react';
import { useSupermarket } from '../../context/SupermarketContext';

const mockCategories = [
  { id: 1, name: 'خضروات وفواكه', icon: '🥬' },
  { id: 2, name: 'ألبان وأجبان', icon: '🥛' },
  { id: 3, name: 'مخبوزات', icon: '🥐' },
  { id: 4, name: 'لحوم ودواجن', icon: '🥩' },
  { id: 5, name: 'منظفات', icon: '🧼' },
];

export default function LocalSupermarket() {
  const { products, reserveStock } = useSupermarket();
  const [activeTab, setActiveTab] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [orderMethod, setOrderMethod] = useState('delivery'); // 'delivery' | 'pickup'
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    if(couponCode === 'MENNO10') {
      setDiscount(0.10); // 10% discount
      alert('تم بنجاح! خصم 10%');
    } else {
      setDiscount(0);
      alert('كوبون غير صالح');
    }
  };

  const addToCart = (product) => {
    if(product.stock_quantity <= 0) return;
    setCart([...cart, product]);
  };

  const handleCheckout = () => {
    if(cart.length > 0) {
      reserveStock(cart);
      setCart([]);
      setCartOpen(false);
      setActiveTab('profile'); // Send them to dashboard preview
      alert("تم تأكيد الطلب بنجاح! تم حجز المنتجات.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 pb-20 font-sans" dir="rtl">
      {/* HEADER & HERO */}
      <header className="relative bg-white shadow-sm pb-6 rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 bg-emerald-700/10 z-0"></div>
        {/* Placeholder for 3D/Hero Image */}
        <div className="absolute top-0 right-0 left-0 h-full w-full overflow-hidden z-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200" alt="Supermarket Background" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-10 px-4 pt-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">س</div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">سوبر ماركت الهدى</h1>
            </div>
            <button onClick={() => setCartOpen(true)} className="relative p-2 bg-white rounded-full shadow-sm text-gray-700 hover:text-emerald-600 transition">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          <div className="text-center mt-2 mb-6">
            <h2 className="text-2xl font-black text-gray-900 mb-2 leading-snug">كل طلبات بيتك من <br/> الهدى لحد باب البيت</h2>
            <p className="text-sm text-gray-600">أسرع دليفري في المنطقة، أو اطلب واستلم من الفرع جاهز.</p>
          </div>

          <div className="relative max-w-md mx-auto shadow-xl rounded-2xl overflow-hidden bg-white">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="عن ماذا تبحث اليوم؟ (مثال: حليب، خبز...)" 
              className="w-full py-4 pr-12 pl-4 outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm font-medium"
            />
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-8 max-w-4xl mx-auto">
        
        {/* HORIZONTAL CATEGORIES */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-800">التصنيفات</h3>
            <span className="text-emerald-600 text-sm font-medium cursor-pointer">عرض الكل</span>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 scrollbar-hide">
            {mockCategories.map(cat => (
              <div key={cat.id} className="flex flex-col items-center gap-2 min-w-[72px]">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-gray-100">
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold text-gray-700 text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* OFFERS SECTION */}
        <section>
           <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-100 text-red-600 p-1.5 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11.3 22-9-9c-.7-.7-.7-2 0-2.8l9-9c.7-.7 1.9-.7 2.8 0l9 9c.7.7.7 2 0 2.8l-9 9c-.7.7-2 .7-2.8 0Z"/><path d="M16 8h.01"/></svg>
            </span>
            <h3 className="font-bold text-lg text-gray-800">عروض اليوم</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.filter(p => p.discount).map(product => (
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
            ))}
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <section>
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-800">وصل حديثاً</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.filter(p => !p.discount).map(product => (
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} />
            ))}
          </div>
        </section>
      </main>

      {/* STICKY BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-40 max-w-md mx-auto rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <NavItem icon={<HomeIcon size={24} />} label="الرئيسية" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon={<Menu size={24} />} label="الأقسام" active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} />
        <NavItem icon={<ShoppingCart size={24} />} label="السلة" active={activeTab === 'cart'} onClick={() => {setActiveTab('cart'); setCartOpen(true);}} badge={cart.length} />
        <NavItem icon={<User size={24} />} label="حسابي" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>

      {/* CART SLIDEOVER (Simplified Cart & Checkout) */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-gray-50 h-full shadow-2xl flex flex-col pt-4">
            <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="text-emerald-600" />
                سلة المشتريات
              </h2>
              <button onClick={() => setCartOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">السلة فارغة</div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((item, i) => (
                      <div key={i} className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <span className="text-xs text-gray-500">{item.unit}</span>
                          <div className="text-emerald-600 font-bold mt-1">{item.price} ج.م</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ORDER SETTINGS */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-800 border-b pb-2">طريقة الاستلام</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setOrderMethod('delivery')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${orderMethod === 'delivery' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}>
                        <MapPin size={24} className={orderMethod === 'delivery' ? 'text-emerald-600' : 'text-gray-400'} />
                        <span className={`text-sm mt-2 font-semibold ${orderMethod === 'delivery' ? 'text-emerald-700' : 'text-gray-600'}`}>توصيل للمنزل</span>
                      </button>
                      <button 
                        onClick={() => setOrderMethod('pickup')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${orderMethod === 'pickup' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}>
                        <Clock size={24} className={orderMethod === 'pickup' ? 'text-emerald-600' : 'text-gray-400'} />
                        <span className={`text-sm mt-2 font-semibold ${orderMethod === 'pickup' ? 'text-emerald-700' : 'text-gray-600'}`}>استلام من الفرع</span>
                      </button>
                    </div>

                    {orderMethod === 'delivery' && (
                      <div className="mt-3 animate-fade-up">
                        <label className="block text-xs font-bold text-gray-600 mb-1">المنطقة (رسوم التوصيل)</label>
                        <select className="w-full bg-white border border-emerald-200 rounded-lg p-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800">
                          <option>مدينتي - المنطقة الأولى (20 ج.م)</option>
                          <option>الرحاب - المرحلة الثانية (25 ج.م)</option>
                          <option>الشروق - الحي المجاور (30 ج.م)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-800 border-b pb-2">طريقة الدفع</h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <CreditCard className="text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">{orderMethod === 'delivery' ? 'الدفع عند الاستلام' : 'الدفع في المحل'}</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-2">
                    <h3 className="font-bold text-gray-800">ملاحظات الطلب</h3>
                    <textarea placeholder="تفضيلات استبدال المنتجات في حال نفاد الكمية..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-emerald-500 min-h-[80px]"></textarea>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white p-4 border-t border-gray-200 pb-8">
              
              {/* Coupon Field */}
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  placeholder="كوبون الخصم (جرب: MENNO10)" 
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-emerald-500 font-bold uppercase transition"
                />
                <button onClick={applyCoupon} className="px-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-bold rounded-xl transition">تطبيق</button>
              </div>

              <div className="flex justify-between items-center mb-1 text-sm font-medium text-gray-500">
                <span>المجموع الفرعي</span>
                <span>{cart.reduce((sum, item) => sum + item.price, 0)} ج.م</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center mb-2 text-sm font-bold text-emerald-500">
                  <span>الخصم (10%)</span>
                  <span>-{(cart.reduce((sum, item) => sum + item.price, 0) * discount).toFixed(2)} ج.م</span>
                </div>
              )}
              
              <div className="flex justify-between items-center mb-4 text-sm font-black text-gray-800 border-t pt-2 mt-2">
                <span>الإجمالي الصافي</span>
                <span className="text-lg text-emerald-600 font-black">
                  {(cart.reduce((sum, item) => sum + item.price, 0) * (1 - discount)).toFixed(2)} ج.م
                </span>
              </div>
              <button onClick={handleCheckout} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2">
                تأكيد الطلب
                <ArrowRight size={20} className="mr-2 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD MODAL PREVIEW (Simple) */}
      {activeTab === 'profile' && (
        <div className="fixed inset-0 z-30 bg-gray-50 pt-20 px-4 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">مرحباً، سعد</h2>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock size={18} className="text-emerald-500"/> حالة الطلب الحالي</h3>
            <div className="flex items-center justify-between mb-2 relative">
              <div className="absolute top-1/2 right-4 left-4 h-0.5 bg-gray-200 -z-10"></div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-md"><Check size={16}/></div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-md"><Check size={16}/></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold shadow-md">3</div>
            </div>
            <div className="flex justify-between text-xs font-semibold text-gray-500 px-1 mt-2">
              <span className="text-emerald-600">تم التأكيد</span>
              <span className="text-emerald-600">جاري التجهيز</span>
              <span>في الطريق</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4">طلباتك المتكررة</h3>
             <button className="w-full py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-100 transition flex items-center justify-center gap-2">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
               إعادة الطلب بسرعة (سلة الأسبوع)
             </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponents
function ProductCard({ product, onAdd }) {
  const isOutOfStock = product.stock_quantity <= 0;
  const isOnlyOneLeft = product.stock_quantity === 1;
  const isLowStock = product.stock_quantity > 1 && product.stock_quantity <= 3;

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 relative group overflow-hidden flex flex-col h-full">
      
      {/* Urgency & Discount Badges */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
        {isOnlyOneLeft && (
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md animate-pulse">آخر قطعة!</span>
        )}
        {isLowStock && (
          <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">باقي {product.stock_quantity} فقط</span>
        )}
        {product.discount && (
          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">{product.discount}</span>
        )}
      </div>

      {isOutOfStock && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
          <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">نفدت الكمية</span>
        </div>
      )}
      
      <div className="relative aspect-square mb-3 bg-gray-50 rounded-xl overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
      </div>
      
      <div className="flex-1 flex flex-col pt-1">
        <h4 className="font-bold text-gray-800 text-sm leading-tight mb-2">{product.name}</h4>
        
        {/* Unit Selector */}
        <div className="mb-3">
          <select className="w-full bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-lg py-1 px-2 outline-none font-semibold focus:border-emerald-500 transition">
            <option value="1">{product.unit || '1 وحدة'}</option>
            {product.unit?.includes('كيلو') && <option value="0.5">0.5 كيلو</option>}
            {product.unit?.includes('كيلو') && <option value="2">2 كيلو</option>}
            {product.unit?.includes('قطعة') && <option value="6">6 قطع</option>}
          </select>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="font-extrabold text-emerald-600 text-lg">{product.price} <span className="text-xs font-medium">ج.م</span></span>
          <button 
            disabled={isOutOfStock} 
            onClick={onAdd}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${!isOutOfStock ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
            <span className="text-xl leading-none -mt-1">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center relative w-16 h-12 transition-colors ${active ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>
      <div className={`transition-transform duration-200 ${active ? '-translate-y-1' : ''}`}>
        {icon}
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white">
            {badge}
          </span>
        )}
      </div>
      <span className={`text-[10px] font-semibold transition-opacity duration-200 absolute bottom-0 ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
      {active && <span className="absolute -bottom-1 w-1 h-1 bg-emerald-600 rounded-full"></span>}
    </button>
  );
}

// ChevronRight Fix for slide-over back button
function ChevronRight(props) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  );
}
