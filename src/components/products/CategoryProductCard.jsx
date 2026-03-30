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

  // Improved Common wrapper for the "Bigger & Square" layout
  const CardWrapper = ({ children, className = "" }) => (
    <div 
      onClick={handleBuyNow}
      className={`glass-panel card-hover product-card-square ${className}`} 
      style={{ 
        padding: '0', 
        overflow: 'hidden', 
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {children}
    </div>
  );

  // --- Restaurant Layout ---
  if (displayCategory === 'restaurant') {
    return (
      <CardWrapper>
        <div style={{ height: '65%', width: '100%', position: 'relative' }}>
          <img 
            src={product.image_url || product.image || '/placeholder-food.png'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div className="mobile-padding-sm" style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
          <h3 className="mobile-text-lg" style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.2' }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
            <span className="mobile-text-sm" style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--accent-primary)' }}>
              {product.price} <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>ج.م</span>
            </span>
            <button 
              onClick={handleAdd} 
              className="mobile-hide" 
              style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
          <p className="mobile-text-xs" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, opacity: 0.8 }}>🏪 {product.store_name}</p>
          <p className="mobile-hide" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
        </div>
      </CardWrapper>
    );
  }

  // --- Cafe Layout ---
  if (displayCategory === 'cafe') {
    return (
      <CardWrapper className="mobile-padding-sm" style={{ padding: '12px', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
        <div className="mobile-hide" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(139, 69, 19, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B4513', marginBottom: '8px' }}>
          <Coffee size={35} />
        </div>
        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
          <h3 className="mobile-text-lg" style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h3>
          <p className="mobile-text-sm" style={{ fontSize: '1.1rem', fontWeight: '900', color: '#8B4513', margin: 0 }}>{product.price} ج.م</p>
          <p className="mobile-text-xs" style={{ fontSize: '0.8rem', color: '#8B4513', opacity: 0.8, borderTop: '1px solid rgba(139,69,19,0.1)', paddingTop: '4px' }}>🥤 {product.store_name}</p>
        </div>
        <button 
            onClick={(e) => { e.stopPropagation(); onOpenCafeModal(product); }} 
            className="btn btn-primary mobile-text-xs" 
            style={{ width: '100%', justifyContent: 'center', background: '#8B4513', borderColor: '#8B4513', color: 'white', padding: '10px', borderRadius: 'var(--radius-md)', marginTop: '8px', fontWeight: 'bold' }}
        >
          طلب سريع
        </button>
      </CardWrapper>
    );
  }

  // --- Supermarket Layout ---
  if (displayCategory === 'supermarket') {
    return (
      <CardWrapper>
        <div style={{ height: '65%', width: '100%', position: 'relative' }}>
          <img 
            src={product.image_url || product.image || '/placeholder-item.png'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div className="mobile-padding-sm" style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', background: 'var(--bg-secondary)', justifyContent: 'center' }}>
          <h4 className="mobile-text-lg" style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="mobile-text-sm" style={{ fontWeight: '900', color: 'var(--accent-primary)', fontSize: '1.1rem', margin: 0 }}>{product.price} ج</p>
            <div className="mobile-hide" style={{ display: 'flex', gap: '4px' }}>
                <button onClick={(e) => { e.stopPropagation(); setQty(q => q + 1); }} style={{ background: 'none', border: 'none', color: 'var(--success)' }}><Plus size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); setQty(q => Math.max(1, q - 1)); }} style={{ background: 'none', border: 'none', color: 'var(--danger)' }}><Minus size={14} /></button>
            </div>
          </div>
          <p className="mobile-text-xs" style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 'bold', margin:0 }}>🧺 {product.store_name}</p>
        </div>
      </CardWrapper>
    );
  }

  // Fallback
  return (
    <CardWrapper className="mobile-padding-sm" style={{ padding: '20px', textAlign: 'center', justifyContent: 'center' }}>
        <h3 className="mobile-text-lg" style={{ fontWeight: '900', margin: 0 }}>{product.name}</h3>
        <p className="mobile-text-sm" style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.2rem', margin: '8px 0' }}>{product.price} جنيه</p>
    </CardWrapper>
  );
};

export default CategoryProductCard;
