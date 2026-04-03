export const MOCK_USERS = [
  { id: 'u1', name: 'Ahmed Customer', email: 'customer@test.com', phone: '01000000001', role: 'customer', address: 'Cairo, Egypt', password: 'password', walletBalance: 0 },
  { id: 'u2', name: 'KFC Vendor', email: 'vendor@test.com', phone: '01000000002', role: 'vendor', address: 'Maadi, Cairo', password: 'password', walletBalance: 5000 },
  { id: 'u3', name: 'Ali Driver', email: 'driver@test.com', phone: '01000000003', role: 'driver', address: 'Nasr City', password: 'password', walletBalance: 200 },
  { id: 'u4', name: 'Super Admin', email: 'admin@test.com', phone: '01000000004', role: 'admin', address: 'HQ', password: 'password', walletBalance: 15000 },
];

export const MOCK_STORES = [
  { 
    id: 's1', 
    name: 'KFC', 
    ownerId: 'u2', 
    location: 'Maadi', 
    image: 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?auto=format&fit=crop&q=80&w=600', 
    status: 'Active', 
    averageRating: 4.5 
  },
  { 
    id: 's2', 
    name: 'Burger King', 
    ownerId: 'u5', 
    location: 'Nasr City', 
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=600', 
    status: 'Active', 
    averageRating: 4.2 
  },
  { 
    id: 's3', 
    name: 'Pizza Hut', 
    ownerId: 'u6', 
    location: 'Zamalek', 
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600', 
    status: 'Active', 
    averageRating: 4.8 
  }
];

export const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Zinger Combo', price: 150, description: 'Spicy chicken burger with fries and drink', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600', storeId: 's1', isAvailable: true },
  { id: 'p2', name: 'Mighty Zinger', price: 200, description: 'Double spicy chicken burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600', storeId: 's1', isAvailable: true },
  { id: 'p3', name: 'Whopper', price: 180, description: 'Classic beef burger', image: 'https://images.unsplash.com/photo-1594212586048-fb62224df0bc?auto=format&fit=crop&q=80&w=600', storeId: 's2', isAvailable: true },
  { id: 'p4', name: 'Pepperoni Pizza', price: 250, description: 'Large pepperoni pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=600', storeId: 's3', isAvailable: true }
];

// Helper to simulate DB delay
export const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
