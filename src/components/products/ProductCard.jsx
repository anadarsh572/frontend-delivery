import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, Zap } from 'lucide-react';
import SafeImage from '../common/SafeImage';

const ProductCard = memo(({ product, onAddToCart }) => {
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    if (e) e.stopPropagation();
    onAddToCart(product, 1);
    navigate('/cart');
  };

  const handleQuickAdd = (e) => {
    if (e) e.stopPropagation();
    setAdding(true);
    onAddToCart(product, 1);
    setTimeout(() => setAdding(false), 2000);
  };


  return (
    <div 
      className="glass-panel card-hover" 
      onClick={handleBuyNow}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {/* Quick Add Button */}
      <button 
        onClick={handleQuickAdd} 
        className="btn-add-float"
        aria-label="Add to cart"
      >
        {adding ? <Check size={20} color="var(--success)" /> : <Plus size={20} />}
      </button>

      {/* Image Section */}
      <div style={{ height: '180px', width: '100%', position: 'relative' }}>
        <SafeImage 
          src={product.image_url || product.image} 
          alt={product.name}
          fallback={product.category === 'restaurant' ? '/placeholder-food.png' : '/placeholder-item.png'}
        />
      </div>

      {/* Content Section */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 className="mobile-text-lg" style={{ 
          margin: 0, 
          color: 'var(--text-primary)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.name}
        </h3>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, fontWeight: '600', opacity: 0.8 }}>
          {product.category === 'restaurant' ? '🏪' : '🧺'} {product.store_name}
        </p>

        <div style={{ 
          fontWeight: '900', 
          color: 'var(--accent-primary)', 
          fontSize: '1.4rem', 
          margin: '4px 0' 
        }}>
          {product.price} <span style={{ fontSize: '0.8rem' }}>ج.م</span>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
          <button onClick={handleBuyNow} className="btn-buy-full">
            اطلب الآن <Zap size={18} fill="white" />
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
