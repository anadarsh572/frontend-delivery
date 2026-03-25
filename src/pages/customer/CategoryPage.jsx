import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../../context/CartContext';
import apiClient from '../../api/client';
import CategoryProductCard from '../../components/products/CategoryProductCard';
import CafeCustomizationModal from '../../components/modals/CafeCustomizationModal';

const CategoryPage = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Modal state for Cafe
    const [isCafeModalOpen, setIsCafeModalOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);

    // React Query for category products
    const { 
        data: products = [], 
        isLoading, 
        isError, 
        refetch 
    } = useQuery({
        queryKey: ['products', 'category', category],
        queryFn: async () => {
            try {
                const url = `/api/products?category=${category}`;
                const response = await apiClient.get(url);
                const data = response.data;
                return Array.isArray(data) ? data : data.products || [];
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    return [];
                }
                throw error;
            }
        },
    });

    const handleQuickAdd = (product, quantity = 1) => {
        addToCart(product, product.store_id || product.storeId || 1, quantity);
        navigate('/cart');
    };

    const handleOpenCafeModal = (product) => {
        setActiveProduct(product);
        setIsCafeModalOpen(true);
    };

    const handleConfirmCafeAdd = (customizedProduct) => {
        addToCart(customizedProduct, customizedProduct.store_id || customizedProduct.storeId || 1, 1);
        setIsCafeModalOpen(false);
        navigate('/cart');
    };

    const getCategoryTitle = () => {
        switch (category) {
            case 'restaurant': return 'المطاعم';
            case 'cafe': return 'الكافيهات';
            case 'supermarket': return 'السوبر ماركت';
            default: return category;
        }
    };

    return (
        <div className="container animate-fade-up" style={{ padding: '40px 20px 80px' }}>
            <button 
                onClick={() => navigate('/')} 
                className="btn" 
                style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
                <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> العودة للرئيسية
            </button>

            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '40px' }}>
                {getCategoryTitle()}
            </h1>

            {isLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: category === 'supermarket' ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: category === 'supermarket' ? '16px' : '24px' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="glass-panel animate-pulse" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ height: '180px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
                            <div style={{ padding: '15px' }}>
                                <div style={{ height: '18px', background: 'var(--bg-tertiary)', borderRadius: '4px', width: '80%', marginBottom: '10px' }} />
                                <div style={{ height: '14px', background: 'var(--bg-tertiary)', borderRadius: '4px', width: '50%', marginBottom: '15px' }} />
                                <div style={{ height: '36px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : isError ? (
                <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '40px' }}>
                    <p>حدث خطأ أثناء تحميل المنتجات.</p>
                    <button onClick={() => refetch()} className="btn btn-secondary" style={{ marginTop: '16px' }}>إعادة المحاولة</button>
                </div>
            ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.2rem', padding: '100px 0' }}>
                    {category === 'restaurant' ? 'لا توجد مطاعم متاحة حالياً' : 'عذراً، لا توجد منتجات متاحة في هذا القسم حالياً.'}
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: category === 'supermarket' ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: category === 'supermarket' ? '16px' : '24px' 
                }}>
                    {products.filter(p => p.category === category).map((product) => (
                        <CategoryProductCard 
                            key={product.id || product._id}
                            product={product}
                            category={product.category || category}
                            onAddToCart={handleQuickAdd}
                            onOpenCafeModal={handleOpenCafeModal}
                        />
                    ))}
                </div>
            )}

            {activeProduct && (
              <CafeCustomizationModal 
                isOpen={isCafeModalOpen}
                onClose={() => setIsCafeModalOpen(false)}
                product={activeProduct}
                onConfirm={handleConfirmCafeAdd}
              />
            )}
        </div>
    );
};

export default CategoryPage;

