import { useState } from 'react';
import { Truck, Search, Save } from 'lucide-react';

const VendorShipping = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [shippingData, setShippingData] = useState([
    { id: 1, name: 'الإسكندرية', price: 40, active: true },
    { id: 2, name: 'الجيزة', price: 30, active: true },
    { id: 3, name: 'القاهرة', price: 20, active: true },
    { id: 4, name: 'بنى سويف', price: 50, active: true },
    { id: 5, name: 'الدقهلية', price: '', active: false },
  ]);

  const toggleActive = (id) => {
    setShippingData(prev => prev.map(item => item.id === id ? { ...item, active: !item.active } : item));
  };

  const updatePrice = (id, newPrice) => {
    setShippingData(prev => prev.map(item => item.id === id ? { ...item, price: newPrice } : item));
  };

  const handleSave = () => {
    // integration endpoint logic will go here
    alert('تم حفظ إعدادات الشحن بنجاح!');
  }

  const filteredData = shippingData.filter(item => item.name.includes(searchQuery));

  return (
    <div className="admin-page animate-fade-in" dir="rtl" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
         <button className="btn btn-primary" onClick={handleSave} style={{ padding: '10px 30px', fontSize: '1.1rem', borderRadius: '8px' }}>
            حفظ <Save size={18} style={{marginRight: '8px'}} />
         </button>
         
         <div style={{ textAlign: 'right' }}>
           <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>الشحن</h1>
           <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
             أضف المحافظات التي تشحن إليها وحدد سعر توصيل ثابت لكل طلب داخل كل محافظة.
           </p>
         </div>
      </div>

      {/* Main Container */}
      <div style={{ 
        background: 'white', 
        borderRadius: 'var(--radius-xl)', 
        border: '1px solid var(--border-color)', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
        overflow: 'hidden'
      }}>
        
        {/* Container Header */}
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '20px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '250px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <Search size={18} color="var(--text-tertiary)" style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="بحث عن المحافظات..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <div style={{ textAlign: 'right' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>تسعير الشحن لمحافظات مصر</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>فعل المحافظات التي تشحن إليها وحدد سعر توصيل ثابت لكل طلب داخل كل محافظة.</p>
             </div>
             <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
               <Truck size={24} />
             </div>
           </div>
        </div>

        {/* List of Regions */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 2fr 1fr', gap: '16px', padding: '0 16px', marginBottom: '8px', color: 'var(--text-tertiary)', fontSize: '0.85rem', fontWeight: 'bold' }}>
             <span style={{ textAlign: 'right' }}>اسم المحافظة</span>
             <span style={{ textAlign: 'center' }}>سعر الشحن</span>
             <span style={{ textAlign: 'left' }}>التوفر</span>
           </div>

           {filteredData.map(item => (
             <div key={item.id} style={{ 
               display: 'grid', 
               gridTemplateColumns: 'minmax(120px, 1fr) 2fr 1fr', 
               gap: '16px', 
               alignItems: 'center',
               padding: '16px',
               borderRadius: 'var(--radius-lg)',
               border: '1px solid var(--border-color)',
               background: item.active ? 'transparent' : 'var(--bg-primary)'
             }}>
               <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: item.active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                 {item.name}
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center' }}>
                 <div style={{ position: 'relative', width: '100%', maxWidth: '300px', display: 'flex', alignItems: 'center' }}>
                   <span style={{ position: 'absolute', right: '16px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>ج.م</span>
                   <input 
                     type="number" 
                     value={item.price}
                     onChange={(e) => updatePrice(item.id, e.target.value)}
                     disabled={!item.active}
                     style={{
                       width: '100%',
                       padding: '12px 16px 12px 50px',
                       borderRadius: 'var(--radius-full)',
                       border: '1px solid var(--border-color)',
                       background: item.active ? 'white' : 'var(--bg-primary)',
                       textAlign: 'center',
                       fontWeight: 'bold',
                       fontSize: '1rem',
                       outline: 'none',
                       opacity: item.active ? 1 : 0.5
                     }}
                   />
                 </div>
               </div>

               <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                 <button 
                   onClick={() => toggleActive(item.id)}
                   style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px',
                     padding: '6px 16px',
                     borderRadius: 'var(--radius-full)',
                     border: 'none',
                     cursor: 'pointer',
                     fontWeight: 'bold',
                     background: item.active ? 'rgba(16, 185, 129, 0.15)' : 'var(--border-color)',
                     color: item.active ? 'var(--success)' : 'var(--text-secondary)',
                     transition: 'all 0.3s'
                   }}
                 >
                   <div style={{ 
                     width: '12px', 
                     height: '12px', 
                     borderRadius: '50%', 
                     background: item.active ? 'var(--success)' : 'var(--text-tertiary)' 
                   }} />
                   {item.active ? 'مفعل' : 'معطل'}
                 </button>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default VendorShipping;
