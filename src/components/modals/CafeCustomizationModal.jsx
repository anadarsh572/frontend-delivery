import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const CafeCustomizationModal = ({ isOpen, onClose, product, onConfirm }) => {
  const [size, setSize] = useState('Medium');
  const [extras, setExtras] = useState({
    extraSugar: false,
    noSugar: false,
    almondMilk: false,
  });

  if (!isOpen) return null;

  const handleConfirm = () => {
    let optionsText = `Size: ${size}`;
    const selectedExtras = [];
    if (extras.extraSugar) selectedExtras.push('Sugar++');
    if (extras.noSugar) selectedExtras.push('No Sugar');
    if (extras.almondMilk) selectedExtras.push('Almond Milk');
    
    if (selectedExtras.length > 0) {
      optionsText += `, Extras: ${selectedExtras.join(', ')}`;
    }

    // Adjust price based on size
    let finalPrice = product.price;
    if (size === 'Medium') finalPrice += 10;
    if (size === 'Large') finalPrice += 20;

    onConfirm({
        ...product,
        price: finalPrice,
        options_notes: optionsText
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
      <div className="glass-panel animate-fade-up" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>تخصيص طلبك</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{product.name}</p>
        </div>

        {/* Size Selection */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>اختر الحجم (Size)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {['Small', 'Medium', 'Large'].map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${size === s ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  background: size === s ? 'rgba(255, 75, 43, 0.1)' : 'transparent',
                  color: size === s ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                {s === 'Small' ? 'صغير' : s === 'Medium' ? 'وسط' : 'كبير'}
              </button>
            ))}
          </div>
        </div>

        {/* Extras Selection */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>إضافات (Add-ons)</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <input type="checkbox" checked={extras.extraSugar} onChange={e => setExtras({...extras, extraSugar: e.target.checked})} />
              <span>سكر زيادة (Extra Sugar)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <input type="checkbox" checked={extras.noSugar} onChange={e => setExtras({...extras, noSugar: e.target.checked})} />
              <span>بدون سكر (No Sugar)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <input type="checkbox" checked={extras.almondMilk} onChange={e => setExtras({...extras, almondMilk: e.target.checked})} />
              <span>حليب خالي الدسم (Low Fat Milk)</span>
            </label>
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          className="btn btn-primary" 
          style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem' }}
        >
          <Check size={20} /> تأكيد الإضافة للسلة
        </button>
      </div>
    </div>
  );
};

export default CafeCustomizationModal;
