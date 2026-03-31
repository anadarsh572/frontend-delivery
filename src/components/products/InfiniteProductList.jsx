import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from '../common/ProductSkeleton';

const InfiniteProductList = ({ 
  products, 
  isLoading, 
  onAddToCart, 
  onOpenCafeModal,
  itemsPerPage = 10 
}) => {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const loadMoreRef = useRef(null);

  // Reset pagination when products change
  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [products, itemsPerPage]);

  const visibleProducts = useMemo(() => {
    return products.slice(0, visibleCount);
  }, [products, visibleCount]);

  const hasMore = visibleCount < products.length;

  const handleIntersect = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore) {
      setVisibleCount((prev) => prev + itemsPerPage);
    }
  }, [hasMore, itemsPerPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [handleIntersect]);

  if (isLoading && products.length === 0) {
    return (
      <div className="product-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="product-grid animate-fade-up">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id || product._id}
            product={product}
            onAddToCart={onAddToCart}
            onOpenCafeModal={onOpenCafeModal}
          />
        ))}
      </div>
      
      {/* Target element for Intersection Observer */}
      <div 
        ref={loadMoreRef} 
        style={{ height: '40px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {hasMore && (
           <div className="skeleton" style={{ height: '4px', width: '100px', borderRadius: 'var(--radius-full)' }} />
        )}
      </div>
    </>
  );
};

export default InfiniteProductList;
