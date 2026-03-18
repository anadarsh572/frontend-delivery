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

  if (!user) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>سجل الدخول لعرض المحفظة</div>;

  const totalEarnings = 5000; // Mock from DB user.walletBalance
  const pendingPayout = 850;

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>محفظة المتجر والأرباح</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>تتبع مبيعاتك، رسوم المنصة، وعمليات سحب الأرباح.</p>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--success)' }}>
              <DollarSign size={20} />
            </div>
            <span>الرصيد المتاح</span>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{totalEarnings} جنيه</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', padding: '12px' }}>طلب سحب الأرباح</button>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--info)' }}>
              <ArrowDownRight size={20} />
            </div>
            <span>في انتظار التحصيل من الكاش</span>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{pendingPayout} جنيه</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>في انتظار تسوية المندوبين للطلبات الكاش مع المنصة.</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>أحدث العمليات</h2>
      
      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>جاري تحميل سجل العمليات...</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="glass-panel desktop-only-block" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>التاريخ والمرجع</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>النوع</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>المبلغ</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(trx => (
                  <tr key={trx.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{trx.date}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>مرجع: {trx.id} | طلب: {trx.orderId}</p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {trx.amount > 0 ? <ArrowDownRight size={16} color="var(--success)"/> : <ArrowUpRight size={16} color="var(--danger)"/>}
                        {trx.type === 'Sale' ? 'عملية بيع' : trx.type === 'Commission_Fee' ? 'رسوم المنصة' : trx.type === 'Payout' ? 'سحب أرباح' : trx.type}
                      </span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{trx.method === 'Online' ? 'دفع إلكتروني' : trx.method === 'Deduction' ? 'خصم مالي' : trx.method === 'Cash_To_Driver' ? 'كاش مع المندوب' : trx.method === 'Bank Transfer' ? 'تحويل بنكي' : trx.method}</p>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 'bold', fontSize: '1.1rem', color: trx.amount > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                      {trx.amount > 0 ? '+' : ''}{trx.amount}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 'bold', background: trx.status === 'Completed' || trx.status === 'Settled' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: trx.status === 'Completed' || trx.status === 'Settled' ? 'var(--success)' : 'var(--warning)' }}>
                        {trx.status === 'Completed' ? 'مكتمل' : trx.status === 'Settled' ? 'تمت التسوية' : trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-only-block" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {transactions.map(trx => (
              <div key={trx.id} className="glass-panel" style={{ padding: '20px', position: 'relative', borderRight: `4px solid ${trx.amount > 0 ? 'var(--success)' : 'var(--danger)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '4px' }}>{trx.date}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>REF: {trx.id}</p>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 'bold', background: trx.status === 'Completed' || trx.status === 'Settled' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: trx.status === 'Completed' || trx.status === 'Settled' ? 'var(--success)' : 'var(--warning)' }}>
                    {trx.status === 'Completed' ? 'مكتمل' : trx.status === 'Settled' ? 'تمت التسوية' : trx.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    {trx.amount > 0 ? <ArrowDownRight size={20} color="var(--success)"/> : <ArrowUpRight size={20} color="var(--danger)"/>}
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold' }}>
                      {trx.type === 'Sale' ? 'عملية بيع' : trx.type === 'Commission_Fee' ? 'رسوم المنصة' : trx.type === 'Payout' ? 'سحب أرباح' : trx.type}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {trx.method === 'Online' ? 'دفع إلكتروني' : trx.method === 'Deduction' ? 'خصم مالي' : trx.method === 'Cash_To_Driver' ? 'كاش مع المندوب' : trx.method === 'Bank Transfer' ? 'تحويل بنكي' : trx.method}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
                  <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: trx.amount > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                    {trx.amount > 0 ? '+' : ''}{trx.amount} جنيه
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          .desktop-only-block { display: none !important; }
          .mobile-only-block { display: flex !important; }
        }
        @media (min-width: 768px) {
          .mobile-only-block { display: none !important; }
          .desktop-only-block { display: block !important; }
        }
      `}} />
    </div>
  );
};

export default VendorWallet;
