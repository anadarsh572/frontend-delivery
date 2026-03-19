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

  const addToCart = (product, storeId, quantity = 1) => {
    setCartItems(prev => {
      // Enforce single-store grouping:
      // If the cart is not empty and the new item is from a different store,
      // we clear the cart and start fresh with the new store's item.
      if (prev.length > 0 && prev[0].storeId !== storeId) {
        // Optional: You could show a confirmation dialog here, 
        // but for now we follow the "strictly groups" requirement by resetting.
        return [{ 
          id: Date.now().toString(), 
          productId: product.id, 
          storeId, 
          quantity, 
          product,
        }];
      }

      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { 
        id: Date.now().toString(), 
        productId: product.id, 
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
