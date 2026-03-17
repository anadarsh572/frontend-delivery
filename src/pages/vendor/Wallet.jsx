import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react';
import { simulateDelay } from '../../data/mockDb';

const VendorWallet = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      await simulateDelay(600);
      setTransactions([
        { id: 'TRX-991', date: '2026-03-17 12:35 PM', orderId: 'ORD-124', type: 'Sale', amount: 450, status: 'Completed', method: 'Online' },
        { id: 'TRX-990', date: '2026-03-17 12:35 PM', orderId: 'ORD-124', type: 'Commission_Fee', amount: -67.5, status: 'Completed', method: 'Deduction' },
        { id: 'TRX-989', date: '2026-03-17 11:20 AM', orderId: 'ORD-123', type: 'Sale', amount: 385, status: 'Completed', method: 'Cash_To_Driver' },
        { id: 'TRX-988', date: '2026-03-16 10:00 AM', orderId: 'PAYOUT-12', type: 'Payout', amount: -2500, status: 'Settled', method: 'Bank Transfer' },
      ]);
      setLoading(false);
    };
    if (user) fetchWallet();
  }, [user]);

  if (!user) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>Log in to view wallet</div>;

  const totalEarnings = 5000; // Mock from DB user.walletBalance
  const pendingPayout = 850;

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Store Wallet & Earnings</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Track your sales, platform fees, and payouts.</p>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--success)' }}>
              <DollarSign size={20} />
            </div>
            <span>Available Balance</span>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>EGP {totalEarnings}</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', padding: '12px' }}>Request Payout</button>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--info)' }}>
              <ArrowDownRight size={20} />
            </div>
            <span>Pending from Cash Orders</span>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>EGP {pendingPayout}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Waiting for driver settlement with platform.</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Recent Transactions</h2>
      
      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading ledger...</div>
      ) : (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Date & ID</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Type</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Amount</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(trx => (
                <tr key={trx.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{trx.date}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ref: {trx.id} | Order: {trx.orderId}</p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {trx.amount > 0 ? <ArrowDownRight size={16} color="var(--success)"/> : <ArrowUpRight size={16} color="var(--danger)"/>}
                      {trx.type.replace('_', ' ')}
                    </span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{trx.method}</p>
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 'bold', fontSize: '1.1rem', color: trx.amount > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                    {trx.amount > 0 ? '+' : ''}{trx.amount}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 'bold', background: trx.status === 'Completed' || trx.status === 'Settled' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: trx.status === 'Completed' || trx.status === 'Settled' ? 'var(--success)' : 'var(--warning)' }}>
                      {trx.status}
                    </span>
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

export default VendorWallet;
