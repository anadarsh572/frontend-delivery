import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Coffee, Utensils, ShoppingBasket, Zap, ArrowRight, Check } from 'lucide-react';

const CategoryProductCard = ({ product, category, onAddToCart, onOpenCafeModal }) => {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const displayCategory = product.category || category;

  const handleBuyNow = () => {
    onAddToCart(product, product.store_id || product.storeId || 1, qty);
    navigate('/cart');
  };

  const handleAdd = () => {
    setAdding(true);
    onAddToCart(product, product.store_id || product.storeId || 1, qty);
    setTimeout(() => setAdding(false), 2000);
  };

  // --- Restaurant Layout ---
  if (displayCategory === 'restaurant') {
    return (
      <div className="glass-panel card-hover" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid var(--border-color)' }}>
        <div style={{ height: '200px', width: '100%', position: 'relative' }}>
          <img 
            src={product.image_url || product.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {product.price} جنيه
          </div>
        </div>
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>{product.name}</h3>
          </div>
          {product.store_name && (
            <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 'bold', margin: '0 0 4px' }}>بواسطة: {product.store_name}</p>
          )}
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
            <button 
              onClick={handleAdd} 
              className="btn btn-secondary" 
              style={{ flex: 1, justifyContent: 'center', padding: '12px', borderRadius: 'var(--radius-md)', gap: '8px' }}
            >
              {adding ? <Check size={18} /> : <ShoppingCart size={18} />}
              <span>سلة</span>
            </button>
            <button 
              onClick={handleBuyNow} 
              className="btn btn-primary" 
              style={{ flex: 2, justifyContent: 'center', padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', gap: '8px' }}
            >
              <Zap size={18} fill="currentColor" />
              <span>إطلب الآن</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Cafe Layout ---
  if (displayCategory === 'cafe') {
    return (
      <div className="glass-panel card-hover" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', borderTop: '4px solid #8B4513', height: '100%', border: '1px solid var(--border-color)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(139, 69, 19, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B4513', marginBottom: '8px' }}>
          <Coffee size={40} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', fontWeight: 'bold' }}>{product.name}</h3>
          {product.store_name && (
            <p style={{ fontSize: '0.75rem', color: '#8B4513', fontWeight: 'bold', marginBottom: '8px' }}>بواسطة: {product.store_name}</p>
          )}
          <p style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.2rem' }}>{product.price} جنيه</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>{product.description}</p>
        </div>
        <button 
            onClick={() => onOpenCafeModal(product)} 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', background: '#8B4513', borderColor: '#8B4513', color: 'white', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
        >
          تخصيص وطلب الآن
        </button>
      </div>
    );
  }

  // --- Supermarket Layout ---
  if (displayCategory === 'supermarket') {
    return (
      <div className="glass-panel card-hover" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', border: '1px solid var(--border-color)' }}>
        <div style={{ height: '160px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
          <img 
            src={product.image_url || product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div style={{ textAlign: 'right', flex: 1 }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
          {product.store_name && (
            <p style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 'bold', marginBottom: '8px' }}>{product.store_name}</p>
          )}
          <p style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '1.2rem' }}>{product.price} جنيه</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', padding: '6px 12px' }}>
            <button 
                onClick={() => setQty(prev => prev + 1)} 
                style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--success)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Plus size={14} />
            </button>
            <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{qty}</span>
            <button 
                onClick={() => setQty(prev => Math.max(1, prev - 1))} 
                style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--danger)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Minus size={14} />
            </button>
        </div>

        <button 
            onClick={handleAdd} 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.9rem', background: 'var(--info)', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
        >
           {adding ? 'تمت الإضافة ✅' : `إضافة ${qty} للسلة`}
        </button>
        <button 
            onClick={handleBuyNow} 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.9rem', background: 'var(--accent-primary)', borderRadius: 'var(--radius-md)', fontWeight: 'bold', gap: '8px' }}
        >
           <Zap size={16} fill="currentColor" /> شراء الآن
        </button>
      </div>
    );
  }

  // Default Fallback
  return (
    <div className="glass-panel" style={{ textAlign: 'right', padding: '24px' }}>
        <h3 style={{ fontWeight: 'bold' }}>{product.name}</h3>
        <p style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>{product.price} جنيه</p>
        <button onClick={handleAdd} className="btn btn-primary" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)' }}>أضف للسلة</button>
    </div>
  );
};

export default CategoryProductCard;
