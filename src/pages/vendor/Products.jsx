import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle, CheckCircle2 } from 'lucide-react';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Appends to the user's note about manually adding store
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80', // Default burger image as fallback
    storeId: '', // User will input this manually for now
    isAvailable: true
  });
  
  const [formStatus, setFormStatus] = useState(null); // { type: 'success' | 'error', text: '' }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        // The API might return the array directly or wrapped in an object like { products: [...] }
        const productsArray = Array.isArray(data) ? data : data.products || [];
        // Optional: filter by this vendor's store. For now, showing all or wait for store ID.
        // Let's just show all fetched products for this demo API integration so the user can see them
        setProducts(productsArray);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    try {
      // Convert price to number before sending
      const payload = { ...formData, price: Number(formData.price) };

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({ type: 'success', text: 'Product added successfully!' });
        setFormData({ ...formData, name: '', price: '', description: '' }); // reset some fields
        fetchProducts(); // Refresh list
        setTimeout(() => {
            setShowAddForm(false);
            setFormStatus(null);
        }, 2000);
      } else {
        setFormStatus({ type: 'error', text: data.message || 'Error adding product.' });
      }
    } catch (error) {
      console.error('Submit Error:', error);
      setFormStatus({ type: 'error', text: 'Network error. Please make sure the backend server is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAvailability = (id) => {
    // In a full implementation, this should also send a PUT/PATCH to the API
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
  };

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Menu Products</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your store's inventory and prices. Connected to Live API.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '12px 24px' }} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <X size={20} /> : <Plus size={20} />} 
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* ADD PRODUCT FORM */}
      {showAddForm && (
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', borderLeft: '4px solid var(--accent-primary)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Create New Product</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Note: Ensure you have manually created a store in pgAdmin and use its exact ID below if there are no existing stores.
          </p>

          {formStatus && (
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', background: formStatus.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: formStatus.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
              {formStatus.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              <p style={{ fontWeight: 'bold' }}>{formStatus.text}</p>
            </div>
          )}

          <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Store ID (Reference to Stores Table)</label>
              <input type="text" name="storeId" value={formData.storeId} onChange={handleInputChange} required placeholder="e.g. 1" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Cheese Burger" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Price (EGP)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="e.g. 150" min="0" step="0.01" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" placeholder="Delicious beef burger..." style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', resize: 'vertical' }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Image URL</label>
              <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="checkbox" id="isAvailable" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} style={{ width: '20px', height: '20px' }} />
              <label htmlFor="isAvailable" style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Product is currently available for ordering</label>
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '200px' }}>
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRODUCTS LIST */}
      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading inventory from DB...</div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>No products found in the database.</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Ensure your backend is running / add some products using the form above.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Product</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Price</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Status</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold', textAlign: 'right' }}>Store ID</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id || product._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      <div>
                        <p style={{ fontWeight: 'bold' }}>{product.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {product.id || product._id}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>EGP {product.price}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div 
                      onClick={() => toggleAvailability(product.id || product._id)}
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '6px 12px', 
                        borderRadius: 'var(--radius-full)', 
                        background: product.isAvailable !== false ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                        color: product.isAvailable !== false ? 'var(--success)' : 'var(--danger)',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
                      {product.isAvailable !== false ? 'Available' : 'Out of Stock'}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {product.storeId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
