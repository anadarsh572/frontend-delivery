import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Coffee, Utensils, ShoppingBasket, Zap, ArrowRight, Check } from 'lucide-react';

const CategoryProductCard = ({ product, category, onAddToCart, onOpenCafeModal }) => {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const displayCategory = product.category || category;

  const handleBuyNow = (e) => {
    if (e) e.stopPropagation();
    onAddToCart(product, qty);
    navigate('/cart');
  };

  const handleAdd = (e) => {
    if (e) e.stopPropagation();
    setAdding(true);
    onAddToCart(product, qty);
    setTimeout(() => setAdding(false), 2000);
  };

  // Common wrapper with click handler
  const CardWrapper = ({ children, className = "" }) => (
    <div 
      onClick={handleBuyNow}
      className={`glass-panel card-hover ${className}`} 
      style={{ 
        padding: '0', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        border: '1px solid var(--border-color)',
        cursor: 'pointer'
      }}
    >
      {children}
    </div>
  );

  // --- Restaurant Layout ---
  if (displayCategory === 'restaurant') {
    return (
      <CardWrapper>
        <div style={{ height: 'clamp(80px, 25vw, 200px)', width: '100%', position: 'relative' }}>
          <img 
            src={product.image_url || product.image || '/placeholder-food.png'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div className="mobile-padding-sm" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '4px' }}>
            <h3 className="mobile-text-lg" style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h3>
            <div className="mobile-text-sm" style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--accent-primary)' }}>
              {product.price} <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>ج.م</span>
            </div>
          </div>
          <p className="mobile-text-xs" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', margin: 0 }}>🏪 {product.store_name}</p>
          <p className="mobile-hide" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>{product.description}</p>
          
          <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
            <button 
              onClick={handleAdd} 
              className="btn btn-secondary mobile-hide" 
              style={{ flex: 1, justifyContent: 'center', padding: '10px', borderRadius: 'var(--radius-md)', gap: '4px' }}
            >
              {adding ? <Check size={16} /> : <ShoppingCart size={16} />}
            </button>
            <button 
              onClick={handleBuyNow} 
              className="btn btn-primary mobile-text-sm" 
              style={{ flex: 2, justifyContent: 'center', padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', fontSize: '0.9rem' }}
            >
              إطلب
            </button>
          </div>
        </div>
      </CardWrapper>
    );
  }

  // --- Cafe Layout ---
  if (displayCategory === 'cafe') {
    return (
      <CardWrapper className="mobile-padding-sm" style={{ padding: '24px', textAlign: 'center', alignItems: 'center' }}>
        <div className="mobile-hide" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(139, 69, 19, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B4513', marginBottom: '8px' }}>
          <Coffee size={30} />
        </div>
        <div style={{ flex: 1, width: '100%', textAlign: 'center' }}>
          <h3 className="mobile-text-lg" style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h3>
          <p className="mobile-text-sm" style={{ fontWeight: '900', color: '#8B4513', margin: '0 0 8px' }}>{product.price} ج.م</p>
          <p className="mobile-text-xs" style={{ fontSize: '0.8rem', color: '#8B4513', opacity: 0.8, marginBottom: '8px' }}>🥤 {product.store_name}</p>
          <p className="mobile-hide" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>{product.description}</p>
        </div>
        <button 
            onClick={(e) => { e.stopPropagation(); onOpenCafeModal(product); }} 
            className="btn btn-primary mobile-text-xs" 
            style={{ width: '100%', justifyContent: 'center', background: '#8B4513', borderColor: '#8B4513', color: 'white', padding: '8px', borderRadius: 'var(--radius-md)', marginTop: '8px' }}
        >
          طلب سريع
        </button>
      </CardWrapper>
    );
  }

  // --- Supermarket Layout ---
  if (displayCategory === 'supermarket') {
    return (
      <CardWrapper className="mobile-padding-sm" style={{ padding: '16px' }}>
        <div style={{ height: 'clamp(60px, 20vw, 160px)', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
          <img 
            src={product.image_url || product.image || '/placeholder-item.png'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ textAlign: 'center', flex: 1, marginTop: '8px' }}>
          <h4 className="mobile-text-lg" style={{ fontSize: '1rem', fontWeight: '900', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
          <p className="mobile-text-sm" style={{ fontWeight: '900', color: 'var(--accent-primary)', fontSize: '1rem', margin: '0 0 4px' }}>{product.price} ج</p>
          <p className="mobile-text-xs" style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 'bold' }}>🧺 {product.store_name}</p>
        </div>
        
        <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', padding: '4px 12px', margin: '8px 0' }}>
            <button onClick={(e) => { e.stopPropagation(); setQty(q => q + 1); }} style={{ background: 'none', border: 'none', color: 'var(--success)' }}><Plus size={14} /></button>
            <span style={{ fontWeight: 'bold' }}>{qty}</span>
            <button onClick={(e) => { e.stopPropagation(); setQty(q => Math.max(1, q - 1)); }} style={{ background: 'none', border: 'none', color: 'var(--danger)' }}><Minus size={14} /></button>
        </div>

        <button 
            onClick={handleBuyNow} 
            className="btn btn-primary mobile-text-xs" 
            style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.85rem', background: 'var(--accent-primary)', borderRadius: 'var(--radius-md)' }}
        >
           إطلب
        </button>
      </CardWrapper>
    );
  }

  // Fallback
  return (
    <div onClick={handleBuyNow} className="glass-panel mobile-padding-sm" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }}>
        <h3 className="mobile-text-lg" style={{ fontWeight: '900' }}>{product.name}</h3>
        <p className="mobile-text-sm" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{product.price} جنيه</p>
    </div>
  );
};

export default CategoryProductCard;
