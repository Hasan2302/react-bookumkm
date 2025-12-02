import { MapPin, Star, Clock, Eye } from 'lucide-react';

export default function UmkmCard({ umkm, onClick, featured = false, onViewDetail }) {
    const storageUrl = '/storage';

    // Default images berdasarkan kategori
    const getDefaultBanner = (category) => {
        const categoryLower = category?.toLowerCase() || '';
        if (categoryLower.includes('salon') || categoryLower.includes('spa')) {
            return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop';
        } else if (categoryLower.includes('barber') || categoryLower.includes('cukur')) {
            return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop';
        } else if (categoryLower.includes('cafe') || categoryLower.includes('resto') || categoryLower.includes('kuliner')) {
            return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop';
        } else if (categoryLower.includes('bengkel')) {
            return 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop';
        } else if (categoryLower.includes('klinik')) {
            return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop';
        }
        return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop';
    };

    const getDefaultLogo = (category) => {
        const categoryLower = category?.toLowerCase() || '';
        if (categoryLower.includes('salon') || categoryLower.includes('spa')) {
            return 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=200&fit=crop';
        } else if (categoryLower.includes('barber') || categoryLower.includes('cukur')) {
            return 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop';
        } else if (categoryLower.includes('cafe') || categoryLower.includes('resto') || categoryLower.includes('kuliner')) {
            return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop';
        } else if (categoryLower.includes('bengkel')) {
            return 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=200&h=200&fit=crop';
        } else if (categoryLower.includes('klinik')) {
            return 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop';
        }
        return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop';
    };

    const handleViewDetail = (e) => {
        e.stopPropagation();
        if (onViewDetail) onViewDetail(umkm);
    };

    const handleBooking = (e) => {
        e.stopPropagation();
        if (onClick) onClick(umkm);
    };

    const bannerUrl = umkm.banner ? `${storageUrl}/${umkm.banner}` : getDefaultBanner(umkm.category);
    const logoUrl = umkm.logo ? `${storageUrl}/${umkm.logo}` : getDefaultLogo(umkm.category);

    if (featured) {
        return (
            <div className="relative overflow-hidden border shadow-glass-xl rounded-3xl bg-white/80 backdrop-blur-lg border-white/20">
                <div className="absolute inset-0 opacity-50 bg-gradient-glass" />
                <div className="relative grid grid-cols-1 md:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-64 md:h-full">
                        <img
                            src={bannerUrl}
                            alt={umkm.name}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                                e.target.src = getDefaultBanner(umkm.category);
                            }}
                        />
                        <div className="absolute flex gap-2 top-4 left-4">
                            <span className="px-4 py-2 text-sm font-bold text-white bg-yellow-500 rounded-full shadow-lg">
                                ⭐ Unggulan
                            </span>
                            {umkm.distance && (
                                <span className="px-3 py-2 text-sm font-bold rounded-full shadow-lg bg-white-500 text-dark">
                                    📍 {parseFloat(umkm.distance).toFixed(1)} km
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                                    {umkm.name}
                                </h2>
                                <div className="flex items-center space-x-2 text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-current" />
                                    ))}
                                    <span className="ml-2 text-sm font-medium text-gray-600">
                                        (4.9 / 127 ulasan)
                                    </span>
                                </div>
                            </div>
                            <div className="flex-shrink-0 w-16 h-16 overflow-hidden border-4 border-white shadow-lg rounded-2xl">
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

                        <p className="mb-6 text-gray-600 line-clamp-3">
                            {umkm.description || 'Layanan terbaik untuk kebutuhan Anda'}
                        </p>

                        <div className="mb-6 space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin className="flex-shrink-0 w-5 h-5 mt-1 text-brand-600" />
                                <span className="text-gray-700">{umkm.address}</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Clock className="flex-shrink-0 w-5 h-5 mt-1 text-brand-600" />
                                <span className="text-gray-700">
                                    Senin - Jumat: 09:00 - 17:00
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => onClick(umkm)}
                            className="relative w-full px-8 py-4 overflow-hidden text-lg font-bold text-white transition-all duration-300 rounded-full group shadow-linear bg-brand-600 hover:bg-brand-700 hover:scale-105 hover:shadow-linear-lg"
                        >
                            <span className="relative z-10">Book Sekarang</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-200 group rounded-2xl hover:shadow-xl hover:-translate-y-1">
        <div className="cursor-default">
        {/* Banner Image */}
        <div className="relative h-32 overflow-hidden sm:h-40 md:h-48">
            <img
                src={bannerUrl}
                alt={umkm.name}
                className="object-cover w-full h-full transition duration-500 group-hover:scale-110"
                onError={(e) => {
                    e.target.src = getDefaultBanner(umkm.category);
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />

            {/* Top Right - Distance & View Button */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-start gap-1.5 sm:gap-2 z-10">
                {/* Distance Badge */}
                {umkm.distance && (
                    <span className="px-2.5 py-1 text-[10px] sm:text-xs font-bold text-gray-800 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                        📍 {parseFloat(umkm.distance).toFixed(1)} km
                    </span>
                )}

                {/* View Detail Button */}
                <button
                    onClick={handleViewDetail}
                    className="p-2 transition-all duration-200 rounded-full shadow-sm bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-md active:scale-95 group/btn"
                    title="Lihat Detail"
                >
                    <Eye className="w-4 h-4 text-gray-600 group-hover/btn:text-brand-600" />
                </button>
            </div>

            {/* Logo */}
            <div className="absolute w-10 h-10 overflow-hidden bg-white border-2 border-white shadow-md sm:w-12 sm:h-12 md:w-14 md:h-14 bottom-3 left-3 sm:bottom-4 sm:left-4 rounded-2xl">
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
        <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-bold text-gray-900 sm:text-lg line-clamp-1">
                    {umkm.name}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    <span className="text-xs font-bold text-gray-700">4.9</span>
                </div>
            </div>

            <div className="flex items-start mb-3 space-x-1.5 text-xs sm:text-sm text-gray-500">
                <MapPin className="flex-shrink-0 w-3.5 h-3.5 mt-0.5" />
                <span className="line-clamp-1">{umkm.address}</span>
            </div>

            {umkm.category && (
                <span className="inline-block px-3 py-1 mb-4 text-[10px] sm:text-xs font-medium rounded-full text-brand-700 bg-brand-50">
                    {umkm.category}
                </span>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2.5">
                <button
                    onClick={handleViewDetail}
                    className="flex-1 py-2.5 text-xs sm:text-sm font-bold text-gray-700 transition-all duration-200 bg-gray-50 rounded-full hover:bg-gray-100 active:scale-95"
                >
                    Detail
                </button>
                <button
                    onClick={handleBooking}
                    className="flex-1 py-2.5 text-xs sm:text-sm font-bold text-white transition-all duration-200 bg-brand-600 rounded-full hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20 active:scale-95"
                >
                    Booking
                </button>
            </div>
        </div>
        </div>
    </div>
    );
}
