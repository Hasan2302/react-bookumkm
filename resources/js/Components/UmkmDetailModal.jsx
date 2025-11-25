import { X, MapPin, Star, Clock, Phone, Mail, Calendar, Info } from 'lucide-react';
import { useEffect } from 'react';

// Constants
const STORAGE_URL = 'http://127.0.0.1:8000/storage/';
const DEFAULT_RATING = 4.9;
const RATING_STARS = 5;
const DEFAULT_SCHEDULE = 'Senin - Jumat: 09:00 - 17:00';

const DEFAULT_IMAGES = {
    banners: {
        salon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
        barbershop: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop',
        cafe: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
        bengkel: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop',
        klinik: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
        laundry: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&h=600&fit=crop',
        default: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'
    },
    logos: {
        salon: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=200&fit=crop',
        barbershop: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop',
        cafe: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop',
        bengkel: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=200&h=200&fit=crop',
        klinik: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop',
        laundry: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=200&h=200&fit=crop',
        default: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop'
    }
};

// Helper Functions
const getCategoryKey = (category) => {
    const categoryLower = category?.toLowerCase() || '';
    
    if (categoryLower.includes('salon') || categoryLower.includes('spa')) return 'salon';
    if (categoryLower.includes('barber') || categoryLower.includes('cukur')) return 'barbershop';
    if (categoryLower.includes('cafe') || categoryLower.includes('resto') || categoryLower.includes('kuliner')) return 'cafe';
    if (categoryLower.includes('bengkel')) return 'bengkel';
    if (categoryLower.includes('klinik')) return 'klinik';
    if (categoryLower.includes('laundry')) return 'laundry';
    
    return 'default';
};

const getDefaultBanner = (category) => {
    const key = getCategoryKey(category);
    return DEFAULT_IMAGES.banners[key];
};

const getDefaultLogo = (category) => {
    const key = getCategoryKey(category);
    return DEFAULT_IMAGES.logos[key];
};

const getImageUrl = (imagePath, category, type = 'banner') => {
    if (imagePath) return `${STORAGE_URL}${imagePath}`;
    return type === 'banner' ? getDefaultBanner(category) : getDefaultLogo(category);
};

// Component
export default function UmkmDetailModal({ isOpen, umkm, onClose, onBooking }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !umkm) return null;

    const bannerUrl = getImageUrl(umkm.banner, umkm.category, 'banner');
    const logoUrl = getImageUrl(umkm.logo, umkm.category, 'logo');

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
            {/* Modal Container */}
            <div 
                className="relative w-full max-w-4xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 active:scale-95"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[95vh] sm:max-h-[90vh] scrollbar-thin">
                    {/* Banner Image */}
                    <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
                        <img
                            src={bannerUrl}
                            alt={umkm.name}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                                e.target.src = getDefaultBanner(umkm.category);
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                        
                        {/* Logo */}
                        <div className="absolute bottom-4 left-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 overflow-hidden border-4 border-white shadow-xl rounded-xl sm:rounded-2xl bg-white">
                            <img
                                src={logoUrl}
                                alt="logo"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    e.target.src = getDefaultLogo(umkm.category);
                                }}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 md:p-8">
                        {/* Header Info */}
                        <div className="mb-6">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                        {umkm.name}
                                    </h2>
                                    
                                    {umkm.category && (
                                        <span className="inline-block px-3 py-1 text-xs sm:text-sm font-semibold rounded-full bg-primary-100 text-primary-700">
                                            {umkm.category}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(RATING_STARS)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <span className="text-sm sm:text-base font-semibold text-gray-900">{DEFAULT_RATING}</span>
                                <span className="text-xs sm:text-sm text-gray-500">(127 ulasan)</span>
                            </div>
                        </div>

                        {/* Description */}
                        {umkm.description && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="w-5 h-5 text-primary-600" />
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Tentang</h3>
                                </div>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    {umkm.description}
                                </p>
                            </div>
                        )}

                        {/* Information Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {/* Address */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary-100">
                                        <MapPin className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Alamat</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                            {umkm.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary-100">
                                        <Clock className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Jam Operasional</h4>
                                        <p className="text-xs sm:text-sm text-gray-600">
                                            {umkm.schedule || DEFAULT_SCHEDULE}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            {umkm.phone && (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary-100">
                                            <Phone className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Telepon</h4>
                                            <a 
                                                href={`tel:${umkm.phone}`}
                                                className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium"
                                            >
                                                {umkm.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            {umkm.email && (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary-100">
                                            <Mail className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Email</h4>
                                            <a 
                                                href={`mailto:${umkm.email}`}
                                                className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium break-all"
                                            >
                                                {umkm.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 active:scale-95"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                    onBooking(umkm);
                                }}
                                className="flex-1 px-6 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Calendar className="w-5 h-5" />
                                <span>Booking Sekarang</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
