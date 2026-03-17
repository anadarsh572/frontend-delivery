import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, MapPin } from 'lucide-react';
import { MOCK_STORES, simulateDelay } from '../../data/mockDb';

const CustomerHome = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      await simulateDelay(600);
      setStores(MOCK_STORES);
      setLoading(false);
    };
    fetchStores();
  }, []);

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(query.toLowerCase()) || 
    store.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="animate-fade-up">
      {/* Search Bar */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '24px', 
          marginBottom: '32px', 
          display: 'flex', 
          gap: '16px',
          alignItems: 'center'
        }}
      >
        <Search size={24} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder="Search for restaurants, cuisines, or locations..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ 
            flex: 1, 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
            outline: 'none'
          }}
        />
      </div>

      <h2 style={{ marginBottom: '24px', fontSize: '2rem' }}>Featured Restaurants</h2>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
          Loading premium stores...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {filteredStores.map(store => (
            <Link 
              key={store.id} 
              to={`/customer/store/${store.id}`} 
              className="card-hover glass-panel"
              style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                <img 
                  src={store.image} 
                  alt={store.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--glass-bg)', padding: '6px 12px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(8px)' }}>
                  <Star size={16} color="var(--warning)" fill="var(--warning)" />
                  <span style={{ fontWeight: 'bold' }}>{store.averageRating}</span>
                </div>
              </div>
              
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{store.name}</h3>
                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16}/> {store.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16}/> 25-35 min</span>
                </div>
              </div>
            </Link>
          ))}
          {filteredStores.length === 0 && (
            <p style={{ color: 'var(--text-secondary)' }}>No restaurants found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerHome;
