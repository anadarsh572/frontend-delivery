import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DollarSign, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { simulateDelay } from '../../data/mockDb';

const AdminSettlements = () => {
  const { user } = useAuth();
  const [finances, setFinances] = useState({ vendorDebts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinances = async () => {
      await simulateDelay(600);
      setFinances({
        vendorDebts: [
          { id: 'v1', name: 'KFC', amountOwed: 2500, type: 'Platform owes Vendor' },
          { id: 'v2', name: 'Burger King', amountOwed: 1200, type: 'Platform owes Vendor' }
        ]
      });
      setLoading(false);
    };
    if (user) fetchFinances();
  }, [user]);

  if (!user) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Log in to view settlements.</div>;

  const handleSettle = (id, type) => {
    alert(`Settlement Processed for ID: ${id}. The balances have been updated.`);
    // Typically we would call the DB to mark as Settled and reset balance
  };

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Financial Settlements</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Manage platform revenue and user payouts.</p>


      <div>
        {/* Vendor Payouts */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpRight size={24} /> Pay to Vendors
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? <p style={{ color: 'var(--text-secondary)' }}>Loading vendors...</p> : finances.vendorDebts.map(v => (
              <div key={v.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 'bold' }}>{v.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{v.type}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px' }}>EGP {v.amountOwed}</p>
                  <button className="btn btn-primary" onClick={() => handleSettle(v.id, 'vendor')} style={{ padding: '6px 12px', fontSize: '0.85rem', background: 'var(--warning)' }}>
                    <CheckCircle2 size={16} /> Mark Paid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSettlements;
