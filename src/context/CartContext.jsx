import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load from local storage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('ecom_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('ecom_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, storeId, quantityInput = 1) => {
    const quantity = Number(quantityInput);
    const productId = product.id || product._id;
    
    if (!productId) {
      console.error("Product has no ID:", product);
      return;
    }

    setCartItems(prev => {
      // Enforce single-store grouping:
      if (prev.length > 0 && prev[0].storeId !== storeId) {
        return [{ 
          id: Date.now().toString(), 
          productId: productId, 
          storeId, 
          quantity, 
          product,
        }];
      }

      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: Number(item.quantity) + quantity }
            : item
        );
      }
      return [...prev, { 
        id: Date.now().toString(), 
        productId: productId, 
        storeId, 
        quantity, 
        product, 
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCartItems(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartTotal,
      itemCount: cartItems.length
    }}>
      {children}
    </CartContext.Provider>
  );
};
