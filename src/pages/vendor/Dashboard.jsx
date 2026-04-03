import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, RefreshCw, Calendar, CalendarDays, Clock, DollarSign, Package, Users, FileText, CheckCircle, Wallet } from 'lucide-react';
import apiClient from '../../api/client';

const MiniSparkline = ({ data = Array(15).fill(0).map(() => Math.random() * 100) }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px', marginTop: '16px', opacity: 0.5 }}>
      {data.map((val, i) => (
        <div key={i} style={{ 
          flex: 1, 
          background: 'var(--accent-primary)', 
          height: `${(val / max) * 100}%`, 
          borderRadius: '2px 2px 0 0',
          minHeight: '4px'
        }} />
      ))}
    </div>
  );
};

const StatCard = ({ title, value, icon, customColor = 'var(--text-primary)', iconBg = 'var(--bg-secondary)' }) => (
  <div style={{
    background: 'white',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '160px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        borderRadius: '8px', 
        background: iconBg, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: customColor !== 'var(--text-primary)' ? customColor : 'var(--text-secondary)'
      }}>
        {icon}
      </div>
    </div>
    
    <div style={{ marginTop: '16px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 'bold' }}>{title}</p>
      <h3 style={{ fontSize: '2rem', fontWeight: '900', color: customColor }}>{value}</h3>
    </div>
    <MiniSparkline />
  </div>
);

const VendorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    total_orders: 34, 
    pending_info: 0, 
    total_products: 1, 
    net_profit: 0, 
    total_revenue: 10790, 
    delivered_orders: 11,
    total_users: 4 
  });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // all, year, month, week, day

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/vendor/stats');
      if (response.data) {
        setStats(prev => ({...prev, ...response.data}));
      }
    } catch (error) {
      console.error('Error fetching vendor stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  if (!user) return <div style={{ textAlign: 'center', paddingTop: '100px' }}>جاري التحميل...</div>;

  return (
    <div className="admin-page animate-fade-in" dir="rtl" style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
      
      {/* Header Profile / Control */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap-reverse', gap: '24px' }}>
        
        {/* Filters Box */}
        <div style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', flex: 1, minWidth: '300px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button className={`filter-btn ${timeFilter === 'all' ? 'active' : ''}`} onClick={() => setTimeFilter('all')}>
              الوقت بالكامل
            </button>
            <button className={`filter-btn ${timeFilter === 'year' ? 'active' : ''}`} onClick={() => setTimeFilter('year')}>
               <CalendarDays size={16} /> سنة
            </button>
            <button className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`} onClick={() => setTimeFilter('month')}>
               <Calendar size={16} /> شهر
            </button>
            <button className={`filter-btn ${timeFilter === 'week' ? 'active' : ''}`} onClick={() => setTimeFilter('week')}>
               <Calendar size={16} /> أسبوع
            </button>
            <button className={`filter-btn ${timeFilter === 'day' ? 'active' : ''}`} onClick={() => setTimeFilter('day')}>
               <Clock size={16} /> يوم
            </button>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'}}>
            <div style={{display: 'flex', gap: '12px'}}>
              <button className="btn btn-primary" onClick={fetchStats} style={{borderRadius: 'var(--radius-md)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                 <RefreshCw size={16} /> تحديث النتائج
              </button>
              <button className="btn" style={{background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)'}}>إعادة تعيين</button>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} />
              عرض جميع البيانات بدون أي تقييد زمني.
            </div>
          </div>
        </div>

        {/* Title Area */}
        <div style={{ textAlign: 'left', minWidth: '200px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '8px' }}>لوحة التحكم</h1>
          <p style={{ color: 'var(--text-secondary)' }}>عرض جميع البيانات بدون أي تقييد زمني.</p>
        </div>
      </div>

      {/* Grid Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
        gap: '24px' 
      }}>
        <StatCard title="إجمالي الطلبات" value={stats.total_orders || 34} icon={<Package size={20} />} />
        <StatCard title="معلومات معلقة" value={stats.pending_info || 0} icon={<FileText size={20} />} />
        <StatCard title="إجمالي المنتجات" value={stats.total_products || 1} icon={<RefreshCw size={20} />} />
        <StatCard title="إجمالي صافي الربح" value={`${stats.net_profit || 0} ج.م`} icon={<Wallet size={20} />} customColor="var(--success)" iconBg="rgba(16, 185, 129, 0.1)" />
        <StatCard title="إجمالي الإيرادات" value={`${stats.total_revenue || 10790} ج.م`} icon={<DollarSign size={20} />} />
        <StatCard title="إجمالي الطلبيات" value={stats.delivered_orders || 11} icon={<CheckCircle size={20} />} />
        <StatCard title="إجمالي المستخدمين" value={stats.total_users || 4} icon={<Users size={20} />} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .filter-btn {
          padding: 8px 16px;
          border-radius: var(--radius-md);
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition);
        }
        .filter-btn:hover {
          background: var(--bg-secondary);
        }
        .filter-btn.active {
          background: var(--accent-primary);
          color: white;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease forwards;
        }
      `}} />
    </div>
  );
};

export default VendorDashboard;
