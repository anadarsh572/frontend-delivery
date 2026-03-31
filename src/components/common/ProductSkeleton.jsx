import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: '180px', width: '100%' }} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="skeleton" style={{ height: '20px', width: '80%' }} />
        <div className="skeleton" style={{ height: '16px', width: '40%' }} />
        <div className="skeleton" style={{ height: '24px', width: '30%', marginTop: '8px' }} />
        <div className="skeleton" style={{ height: '40px', width: '100%', marginTop: 'auto', borderRadius: 'var(--radius-md)' }} />
      </div>
    </div>
  );
};

export default ProductSkeleton;
