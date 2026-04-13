import React, { useState, useEffect } from 'react';
import { Camera, Save, Store, Clock, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import apiClient from '../../api/client';

const Settings = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        display_name: '',
        address: '',
        phone: '',
        logo_url: '',
        opening_hours: '',
        is_open: true
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get('/api/vendor/settings');
            if (res.data) {
                setFormData({
                    name: res.data.name || '',
                    display_name: res.data.display_name || '',
                    address: res.data.address || '',
                    phone: res.data.phone || '',
                    logo_url: res.data.logo_url || '',
                    opening_hours: res.data.opening_hours || '',
                    is_open: res.data.is_open !== false
                });
                if (res.data.logo_url) setImagePreview(res.data.logo_url);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const compressImage = (base64Str, maxWidth = 400, maxHeight = 400, quality = 0.7) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
                } else {
                    if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const compressed = await compressImage(reader.result);
                    setImagePreview(compressed);
                    setFormData(prev => ({ ...prev, logo_url: compressed }));
                } catch (err) {
                    console.error('Error compressing image:', err);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            setStatusMessage(null);
            await apiClient.put('/api/vendor/settings', formData);
            setStatusMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح!' });
            setTimeout(() => setStatusMessage(null), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setStatusMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ الإعدادات.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={40} color="var(--accent-primary)" /></div>;
    }

    return (
        <div className="orders-container animate-fade-up">
            <div className="orders-header">
                <div>
                    <h1 className="page-title">إعدادات المتجر</h1>
                    <p className="page-subtitle">تحديث الشعار، مواعيد العمل، وبيانات المتجر العامة</p>
                </div>
            </div>

            {statusMessage && (
                <div style={{ padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: statusMessage.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
                    <CheckCircle2 size={20} /> {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '32px', gridTemplateColumns: '1fr', maxWidth: '800px' }}>
                
                {/* Logo & Toggle Section */}
                <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
                    
                    <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2px dashed var(--border-color)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', cursor: 'pointer' }} onClick={() => document.getElementById('logoInput').click()}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Camera size={32} color="var(--text-tertiary)" />
                            )}
                        </div>
                        <input type="file" id="logoInput" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                        <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent-primary)', padding: '6px', borderRadius: '50%', color: 'white', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }} onClick={() => document.getElementById('logoInput').click()}>
                            <Camera size={16} />
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '8px' }}>حالة المتجر الآن</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>تحكم في ظهور مطعمك/متجرك للعملاء في التطبيق.</p>
                        
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: formData.is_open ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '12px 24px', borderRadius: '12px', border: `1px solid ${formData.is_open ? 'var(--success)' : 'var(--danger)'}`, width: 'fit-content' }}>
                            <input 
                                type="checkbox" 
                                name="is_open" 
                                checked={formData.is_open} 
                                onChange={handleInputChange} 
                                style={{ width: '24px', height: '24px', accentColor: formData.is_open ? 'var(--success)' : 'var(--danger)', cursor: 'pointer' }} 
                            />
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: formData.is_open ? 'var(--success)' : 'var(--danger)' }}>
                                {formData.is_open ? 'مفتوح (يستقبل الطلبات)' : 'مغلق (لا يستقبل حالياً)'}
                            </span>
                        </label>
                    </div>
                </div>

                {/* Info Fields */}
                <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-secondary)' }}><Store size={18} /> اسم المتجر (بالنظام)</label>
                        <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                        <small style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>لا يمكن تغيير اسم النظام، يمكنك تغيير اسم العرض فقط.</small>
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-secondary)' }}><Store size={18} /> اسم العرض (للعملاء)</label>
                        <input type="text" name="display_name" className="form-input" value={formData.display_name} onChange={handleInputChange} placeholder="مثال: مطعم الأكيلة" required />
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-secondary)' }}><Clock size={18} /> مواعيد العمل</label>
                        <input type="text" name="opening_hours" className="form-input" value={formData.opening_hours} onChange={handleInputChange} placeholder="مثال: من 10 صباحاً إلى 12 مساءً" />
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-secondary)' }}><Phone size={18} /> رقم هاتف المتجر</label>
                        <input type="text" name="phone" className="form-input" value={formData.phone} onChange={handleInputChange} placeholder="01xxxxxxxxx" required />
                    </div>
                    
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-secondary)' }}><MapPin size={18} /> العنوان</label>
                        <textarea name="address" className="form-input" value={formData.address} onChange={handleInputChange} placeholder="تفاصيل عنوان المتجر..." rows="3" style={{ resize: 'none' }} required />
                    </div>

                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" disabled={isSaving} style={{ padding: '16px 40px', fontSize: '1.2rem', display: 'flex', gap: '12px' }}>
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save />} 
                        {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Settings;
