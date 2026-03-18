import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Coffee, Utensils, ShoppingBasket } from 'lucide-react';

const CategoryProductCard = ({ product, category, onAddToCart, onOpenCafeModal }) => {
  const [qty, setQty] = useState(1);

  // --- Restaurant Layout ---
  if (category === 'restaurant') {
    return (
      <div className="glass-panel card-hover" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ height: '200px', width: '100%' }}>
          <img 
            src={product.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>{product.name}</h3>
            <p style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '1.1rem', margin: 0 }}>{product.price} جنيه</p>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
          <button onClick={() => onAddToCart(product, 1)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginBottom: '4px' }}>
            <ShoppingCart size={18} /> أضف للسلة
          </button>
        </div>
      </div>
    );
  }

  // --- Cafe Layout ---
  if (category === 'cafe') {
    return (
      <div className="glass-panel card-hover" style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', borderTop: '4px solid #8B4513', height: '100%' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(139, 69, 19, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B4513' }}>
          <Coffee size={40} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{product.name}</h3>
          <p style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{product.price} جنيه</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>{product.description}</p>
        </div>
        <button onClick={() => onOpenCafeModal(product)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', borderColor: '#8B4513', color: '#8B4513', marginBottom: '4px' }}>
          تخصيص وإضافة
        </button>
      </div>
    );
  }

  // --- Supermarket Layout ---
  if (category === 'supermarket') {
    return (
      <div className="glass-panel card-hover" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
        <div style={{ height: '160px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <img 
            src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ textAlign: 'right', flex: 1 }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
          <p style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{product.price} جنيه</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', padding: '4px' }}>
            <button 
                onClick={() => setQty(prev => prev + 1)} 
                style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--success)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Plus size={14} />
            </button>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{qty}</span>
            <button 
                onClick={() => setQty(prev => Math.max(1, prev - 1))} 
                style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--danger)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Minus size={14} />
            </button>
        </div>

        <button onClick={() => onAddToCart(product, qty)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem', background: 'var(--success)', marginBottom: '4px' }}>
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
