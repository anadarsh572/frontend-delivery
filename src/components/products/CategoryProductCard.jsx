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

  // Modern Card Wrapper (No square constraint)
  const CardWrapper = ({ children, className = "" }) => (
    <div 
      onClick={handleBuyNow}
      className={`glass-panel card-hover ${className}`} 
      style={{ 
        padding: '0', 
        overflow: 'hidden', 
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-secondary)'
      }}
    >
      {children}
    </div>
  );

  // --- Restaurant Layout ---
  if (displayCategory === 'restaurant') {
    return (
      <CardWrapper>
        <div style={{ height: '160px', width: '100%', position: 'relative' }}>
          <img 
            src={product.image_url || product.image || '/placeholder-food.png'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <button onClick={handleAdd} className="btn-add-float">
            {adding ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>
        <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 className="mobile-text-lg" style={{ margin: 0, color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 'bold' }}>🏪 {product.store_name}</p>
          <div style={{ fontWeight: '900', color: 'var(--accent-primary)', fontSize: '1.2rem', margin: '4px 0' }}>
            {product.price} <span style={{ fontSize: '0.75rem' }}>ج.م</span>
          </div>
          <button onClick={handleBuyNow} className="btn-buy-full" style={{ marginTop: 'auto' }}>
            اطلب الآن <Zap size={16} fill="white" />
          </button>
        </div>
      </CardWrapper>
    );
  }

  // --- Cafe Layout ---
  if (displayCategory === 'cafe') {
    return (
      <CardWrapper style={{ paddingBottom: '12px' }}>
        <div style={{ height: '130px', background: 'rgba(139, 69, 19, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
           <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(139, 69, 19, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B4513' }}>
              <Coffee size={35} />
           </div>
           <button onClick={handleAdd} className="btn-add-float" style={{ color: '#8B4513' }}>
             {adding ? <Check size={18} /> : <Plus size={18} />}
           </button>
        </div>
        <div style={{ padding: '12px', flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 className="mobile-text-lg" style={{ margin: 0, color: '#8B4513' }}>{product.name}</h3>
          <p style={{ fontSize: '0.8rem', color: '#8B4513', opacity: 0.8, margin: 0 }}>🥤 {product.store_name}</p>
          <div style={{ fontWeight: '900', color: '#8B4513', fontSize: '1.2rem', margin: '4px 0' }}>{product.price} ج.م</div>
          <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); onOpenCafeModal(product); }} 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '8px', fontSize: '0.8rem', borderColor: '#8B4513', color: '#8B4513' }}
              >
                تخصيص
              </button>
              <button onClick={handleBuyNow} className="btn-buy-full" style={{ flex: 2, background: '#8B4513' }}>
                اطلب <Zap size={14} fill="white" />
              </button>
          </div>
        </div>
      </CardWrapper>
    );
  }

  // --- Supermarket Layout ---
  if (displayCategory === 'supermarket') {
    return (
      <CardWrapper>
        <div style={{ height: '140px', width: '100%', position: 'relative' }}>
          <img 
            src={product.image_url || product.image || '/placeholder-item.png'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <button onClick={handleAdd} className="btn-add-float" style={{ color: 'var(--success)' }}>
            {adding ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>
        <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h4 className="mobile-text-lg" style={{ margin: 0 }}>{product.name}</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'bold', margin: 0 }}>🧺 {product.store_name}</p>
          <div style={{ fontWeight: '900', color: 'var(--accent-primary)', fontSize: '1.2rem', margin: '4px 0' }}>
            {product.price} <span style={{ fontSize: '0.8rem' }}>ج.م</span>
          </div>
          <button onClick={handleBuyNow} className="btn-buy-full" style={{ marginTop: 'auto' }}>
            اطلب الآن <Zap size={16} fill="white" />
          </button>
        </div>
      </CardWrapper>
    );
  }

  // Fallback
  return (
    <CardWrapper style={{ padding: '16px' }}>
        <h3 className="mobile-text-lg" style={{ margin: 0 }}>{product.name}</h3>
        <p style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '1.2rem', margin: '8px 0' }}>{product.price} جنيه</p>
        <button onClick={handleBuyNow} className="btn-buy-full">اطلب الآن</button>
    </CardWrapper>
  );
};

export default CategoryProductCard;
