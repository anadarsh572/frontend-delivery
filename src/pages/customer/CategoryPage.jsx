import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../../context/CartContext';
import apiClient from '../../api/client';
import ProductCard from '../../components/products/ProductCard';
import InfiniteProductList from '../../components/products/InfiniteProductList';
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
                const url = `/api/products/category/${category}`;
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

    const handleAddToCart = useCallback((product, quantity = 1) => {
        const storeId = product.store_id || product.storeId || 1;
        addToCart(product, storeId, quantity);
    }, [addToCart]);

    const handleOpenCafeModal = useCallback((product) => {
        setActiveProduct(product);
        setIsCafeModalOpen(true);
    }, []);

    const handleConfirmCafeAdd = useCallback((customizedProduct) => {
        addToCart(customizedProduct, customizedProduct.store_id || customizedProduct.storeId || 1, 1);
        setIsCafeModalOpen(false);
        navigate('/cart');
    }, [addToCart, navigate]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.category === category);
    }, [products, category]);

    const getCategoryTitle = () => {
        switch (category) {
            case 'restaurant': return 'المطاعم 🍔';
            case 'cafe': return 'الكافيهات ☕';
            case 'supermarket': return 'السوبر ماركت 🛒';
            default: return category;
        }
    };

    return (
        <div className="container animate-fade-up" style={{ padding: '40px 20px 80px' }}>
            <button 
                onClick={() => navigate('/')} 
                className="btn btn-secondary" 
                style={{ marginBottom: '32px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
            >
                <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> العودة للرئيسية
            </button>

            <h1 className="gradient-text" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '40px', fontWeight: '900' }}>
                {getCategoryTitle()}
            </h1>

            {isError ? (
                <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '40px' }}>
                    <p>حدث خطأ أثناء تحميل المنتجات.</p>
                    <button onClick={() => refetch()} className="btn btn-secondary" style={{ marginTop: '16px' }}>إعادة المحاولة</button>
                </div>
            ) : filteredProducts.length === 0 && !isLoading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.2rem', padding: '100px 0' }}>
                    {category === 'restaurant' ? 'لا توجد مطاعم متاحة حالياً' : 'عذراً، لا توجد منتجات متاحة في هذا القسم حالياً.'}
                </div>
            ) : (
                <InfiniteProductList 
                    products={filteredProducts}
                    isLoading={isLoading}
                    onAddToCart={handleAddToCart}
                    onOpenCafeModal={handleOpenCafeModal}
                />
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


