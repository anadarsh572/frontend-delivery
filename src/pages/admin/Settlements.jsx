import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DollarSign, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { simulateDelay } from '../../data/mockDb';

const AdminSettlements = () => {
  const { user } = useAuth();
  const [finances, setFinances] = useState({ platformEarnings: 0, vendorDebts: [], driverDebts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinances = async () => {
      await simulateDelay(600);
      setFinances({
        platformEarnings: 45800,
        vendorDebts: [
          { id: 'v1', name: 'KFC', amountOwed: 2500, type: 'Platform owes Vendor' },
          { id: 'v2', name: 'Burger King', amountOwed: 1200, type: 'Platform owes Vendor' }
        ],
        driverDebts: [
          { id: 'd1', name: 'Ali Driver', amountOwed: 850, type: 'Driver owes Platform (Cash)' },
          { id: 'd2', name: 'Omar Z', amountOwed: 320, type: 'Driver owes Platform (Cash)' }
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

      {/* Platform Earnings Hero */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><DollarSign size={20} color="var(--success)"/> Platform Net Earnings (Commissions & Fees)</p>
        <p style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--success)' }}>EGP {finances.platformEarnings.toLocaleString()}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
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

        {/* Driver Collections */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--info)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowDownRight size={24} /> Collect from Drivers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {loading ? <p style={{ color: 'var(--text-secondary)' }}>Loading drivers...</p> : finances.driverDebts.map(d => (
              <div key={d.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 'bold' }}>{d.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{d.type}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px', color: 'var(--danger)' }}>EGP {d.amountOwed}</p>
                  <button className="btn btn-secondary" onClick={() => handleSettle(d.id, 'driver')} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} /> Mark Received
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
