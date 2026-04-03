import { CheckCircle, CreditCard } from 'lucide-react';

const VendorPayments = () => {
  return (
    <div className="admin-page animate-fade-in" dir="rtl" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>الدفعات</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
         <div style={{ textAlign: 'right' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
             التحقق من الدفع <CreditCard size={24} color="var(--text-secondary)" />
           </h2>
           <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>التحقق من الدفعات والمبالغ</p>
         </div>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: 'var(--radius-xl)', 
        border: '1px solid var(--border-color)', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: '300px'
      }}>
         <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            border: '2px dashed var(--border-color)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'var(--text-tertiary)'
         }}>
            <CheckCircle size={40} />
         </div>
         <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>لا توجد بيانات دفع معلقة</h3>
      </div>
    </div>
  );
};

export default VendorPayments;
