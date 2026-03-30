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
        <div style={{ height: '42%', width: '100%', position: 'relative' }}>
          <img 
            src={product.image_url || product.image || '/placeholder-food.png'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div className="mobile-padding-sm" style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', background: 'var(--bg-secondary)' }}>
          <h3 className="mobile-text-lg" style={{ fontSize: '1.05rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
          <p className="mobile-text-xs" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '0 0 2px', opacity: 0.8 }}>🏪 {product.store_name}</p>
          <div style={{ fontWeight: '900', color: 'var(--accent-primary)', fontSize: '1rem', marginBottom: '4px' }}>
            {product.price} <span style={{ fontSize: '0.7rem' }}>ج.م</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto' }}>
            <button 
              onClick={handleAdd} 
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '6px', fontSize: '0.8rem', borderRadius: '4px', justifyContent: 'center', gap: '4px' }}
            >
              {adding ? <Check size={14} /> : <ShoppingCart size={14} />}
              <span>أضف</span>
            </button>
            <button 
              onClick={handleBuyNow} 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '6px', fontSize: '0.8rem', borderRadius: '4px', justifyContent: 'center', background: 'var(--accent-primary)', border: 'none' }}
            >
              <span>اطلب الآن</span>
            </button>
          </div>
        </div>
      </CardWrapper>
    );
  }

  // --- Cafe Layout ---
  if (displayCategory === 'cafe') {
    return (
      <CardWrapper className="mobile-padding-sm" style={{ padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px' }}>
          <h3 className="mobile-text-lg" style={{ fontSize: '1.05rem', fontWeight: '900', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h3>
          <p className="mobile-text-xs" style={{ fontSize: '0.75rem', color: '#8B4513', opacity: 0.8, margin: 0 }}>🥤 {product.store_name}</p>
          <p className="mobile-text-sm" style={{ fontWeight: '900', color: '#8B4513', margin: '2px 0' }}>{product.price} ج.م</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', marginTop: 'auto' }}>
            <button 
                onClick={(e) => { e.stopPropagation(); onOpenCafeModal(product); }} 
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', padding: '6px', fontSize: '0.8rem', borderRadius: '4px', borderColor: '#8B4513', color: '#8B4513' }}
            >
              تخصيص
            </button>
            <button 
                onClick={handleBuyNow} 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', background: '#8B4513', border: 'none', color: 'white', padding: '6px', fontSize: '0.8rem', borderRadius: '4px' }}
            >
              اطلب الآن
            </button>
        </div>
      </CardWrapper>
    );
  }

  // --- Supermarket Layout ---
  if (displayCategory === 'supermarket') {
    return (
      <CardWrapper>
        <div style={{ height: '42%', width: '100%', position: 'relative' }}>
          <img 
            src={product.image_url || product.image || '/placeholder-item.png'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div className="mobile-padding-sm" style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', background: 'var(--bg-secondary)' }}>
          <h4 className="mobile-text-lg" style={{ fontSize: '1rem', fontWeight: '900', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
          <p className="mobile-text-xs" style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 'bold', margin:0 }}>🧺 {product.store_name}</p>
          <p className="mobile-text-sm" style={{ fontWeight: '900', color: 'var(--accent-primary)', fontSize: '1rem', margin: '2px 0' }}>{product.price} ج</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto' }}>
            <button 
                onClick={handleAdd} 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '6px', fontSize: '0.8rem', borderRadius: '4px', justifyContent: 'center' }}
            >
              أضف للسلة
            </button>
            <button 
                onClick={handleBuyNow} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '6px', fontSize: '0.8rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '4px', justifyContent: 'center' }}
            >
               اطلب الآن
            </button>
          </div>
        </div>
      </CardWrapper>
    );
  }

  // Fallback
  return (
    <CardWrapper className="mobile-padding-sm" style={{ padding: '12px', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
        <h3 className="mobile-text-lg" style={{ fontWeight: '900', margin: 0, fontSize: '1rem' }}>{product.name}</h3>
        <p className="mobile-text-sm" style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.1rem', margin: '4px 0' }}>{product.price} جنيه</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
          <button onClick={handleAdd} className="btn btn-secondary" style={{ padding: '6px', fontSize: '0.8rem' }}>أضف</button>
          <button onClick={handleBuyNow} className="btn btn-primary" style={{ padding: '6px', fontSize: '0.8rem' }}>اطلب</button>
        </div>
    </CardWrapper>
  );
};

export default CategoryProductCard;
