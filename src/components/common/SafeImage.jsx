import React, { useState, useEffect } from 'react';

const SafeImage = ({ src, alt, className, style, fallback = '/placeholder-food.png' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true); // Stop shimmer if it fails
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }} className={className}>
      {!isLoaded && (
        <div className="skeleton" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
      )}
      <img
        src={error ? fallback : currentSrc}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </div>
  );
};

export default SafeImage;
