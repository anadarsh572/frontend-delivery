import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CategoryProductCard from '../../components/products/CategoryProductCard';
import CafeCustomizationModal from '../../components/modals/CafeCustomizationModal';

import { API_URL } from '../../api/config';

const CategoryPage = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Modal state for Cafe
    const [isCafeModalOpen, setIsCafeModalOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);

    const fetchCategoryProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/products/category/${category}`);
            if (response.ok) {
                const data = await response.json();
                const productsArray = Array.isArray(data) ? data : data.products || [];
                setProducts(productsArray);
            }
        } catch (error) {
            console.error('Error fetching category products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryProducts();
    }, [category]);

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
            case 'restaurant': return 'المطاعم (Restaurants)';
            case 'cafe': return 'الكافيهات (Cafes)';
            case 'supermarket': return 'السوبر ماركت (Supermarkets)';
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
                <ArrowRight size={18} /> العودة للرئيسية
            </button>

            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '40px' }}>
                {getCategoryTitle()}
            </h1>

            {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                    Loading products...
                </div>
            ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.2rem', padding: '100px 0' }}>
                    عذراً، لا توجد منتجات متاحة في هذا القسم حالياً.
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: category === 'supermarket' ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: category === 'supermarket' ? '16px' : '24px' 
                }}>
                    {products.map((product) => (
                        <CategoryProductCard 
                            key={product.id || product._id}
                            product={product}
                            category={category}
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

