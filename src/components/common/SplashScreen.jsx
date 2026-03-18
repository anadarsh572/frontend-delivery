import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 600); // Wait for fade out animation
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.6s ease-in-out',
      pointerEvents: visible ? 'all' : 'none'
    }}>
      <div className="animate-fade-up" style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: 'clamp(3rem, 10vw, 5rem)', 
          marginBottom: '16px',
          fontWeight: '800',
          letterSpacing: '-2px'
        }}>
          <span className="gradient-text">طلقة</span>
          <span style={{ marginLeft: '12px' }}>⚡</span>
        </h1>
        <p style={{ 
          fontSize: 'clamp(1rem, 4vw, 1.5rem)', 
          color: 'var(--text-secondary)',
          fontWeight: '500'
        }}>
          في السريع منه🏁
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
