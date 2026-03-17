import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Coffee, Utensils, ShoppingBasket } from 'lucide-react';

const CategoryProductCard = ({ product, category, onAddToCart, onOpenCafeModal }) => {
  const [qty, setQty] = useState(1);

  // --- Restaurant Layout (Image Heavy, quick add) ---
  if (category === 'restaurant') {
    return (
      <div className="glass-panel card-hover" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', paddingTop: '65%' }}>
          <img 
            src={product.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80'} 
            alt={product.name} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{product.name}</h3>
            <p style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '1.3rem' }}>{product.price} EGP</p>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', flex: 1 }}>{product.description}</p>
          <button onClick={() => onAddToCart(product, 1)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
            <ShoppingCart size={18} /> أضف للسلة
          </button>
        </div>
      </div>
    );
  }

  // --- Cafe Layout (Minimalist, opens customization) ---
  if (category === 'cafe') {
    return (
      <div className="glass-panel card-hover" style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', borderTop: '4px solid #8B4513' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(139, 69, 19, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B4513' }}>
          <Coffee size={40} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{product.name}</h3>
          <p style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{product.price} EGP</p>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 12px' }}>{product.description}</p>
        <button onClick={() => onOpenCafeModal(product)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', borderColor: '#8B4513', color: '#8B4513' }}>
          تخصيص وإضافة
        </button>
      </div>
    );
  }

  // --- Supermarket Layout (Compact, qty controls) ---
  if (category === 'supermarket') {
    return (
      <div className="glass-panel card-hover" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ position: 'relative', paddingTop: '70%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <img 
            src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80'} 
            alt={product.name} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ textAlign: 'right' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
          <p style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{product.price} EGP</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', padding: '4px' }}>
            <button 
                onClick={() => setQty(prev => prev + 1)} 
                style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--success)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Plus size={16} />
            </button>
            <span style={{ fontWeight: 'bold' }}>{qty}</span>
            <button 
                onClick={() => setQty(prev => Math.max(1, prev - 1))} 
                style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--danger)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Minus size={16} />
            </button>
        </div>

        <button onClick={() => onAddToCart(product, qty)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.9rem', background: 'var(--success)' }}>
           إضافة {qty} للسلة
        </button>
      </div>
    );
  }

  // Default Fallback
  return (
    <div className="glass-panel">
        <h3>{product.name}</h3>
        <p>{product.price} EGP</p>
        <button onClick={() => onAddToCart(product, 1)}>Add to Cart</button>
    </div>
  );
};

export default CategoryProductCard;
