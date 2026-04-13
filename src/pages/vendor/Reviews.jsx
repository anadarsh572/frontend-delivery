import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import apiClient from '../../api/client';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get('/api/vendor/reviews');
            setReviews(res.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <Star key={i} size={16} fill={i < rating ? "#FBBF24" : "transparent"} color={i < rating ? "#FBBF24" : "#D1D5DB"} />
        ));
    };

    return (
        <div className="orders-container animate-fade-up">
            <div className="orders-header">
                <div>
                    <h1 className="page-title">تقييمات العملاء</h1>
                    <p className="page-subtitle">شاهد آراء وملحوظات عملائك حول متجرك</p>
                </div>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                    <Loader2 className="animate-spin" size={40} style={{ margin: '0 auto' }} />
                </div>
            ) : reviews.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
                    <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>لا توجد تقييمات حتى الآن.</h3>
                    <p>سيتم عرض التقييمات هنا بمجرد أن يقوم العملاء باختبار متجرك.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {reviews.map((review) => (
                        <div key={review.id} className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
                           <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: review.rating >= 4 ? 'var(--success)' : review.rating === 3 ? '#F59E0B' : 'var(--danger)' }} />
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                              <div>
                                 <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>{review.customer_name || 'عميل مجهول'}</h4>
                                 <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{new Date(review.created_at).toLocaleDateString('ar-EG')}</div>
                              </div>
                              <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '20px' }}>
                                 {renderStars(review.rating)}
                              </div>
                           </div>
                           
                           <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', fontStyle: 'italic' }}>
                               "{review.comment || 'بدون تعليق'}"
                           </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;
