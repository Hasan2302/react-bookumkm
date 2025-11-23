import { MapPin, Star, Clock } from 'lucide-react';

export default function UmkmCard({ umkm, onClick, featured = false }) {
    const storageUrl = 'http://127.0.0.1:8000/storage/';
    
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
    
    const bannerUrl = umkm.banner ? `${storageUrl}${umkm.banner}` : getDefaultBanner(umkm.category);
    const logoUrl = umkm.logo ? `${storageUrl}${umkm.logo}` : getDefaultLogo(umkm.category);

    if (featured) {
        return (
            <div className="relative overflow-hidden shadow-glass-xl rounded-3xl bg-white/80 backdrop-blur-lg border border-white/20">
                <div className="absolute inset-0 bg-gradient-glass opacity-50" />
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
                        <div className="absolute top-4 left-4">
                            <span className="px-4 py-2 text-sm font-bold text-white bg-yellow-500 shadow-lg rounded-full">
                                ⭐ Unggulan
                            </span>
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
                                <MapPin className="flex-shrink-0 w-5 h-5 mt-1 text-primary-600" />
                                <span className="text-gray-700">{umkm.address}</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Clock className="flex-shrink-0 w-5 h-5 mt-1 text-primary-600" />
                                <span className="text-gray-700">
                                    Senin - Jumat: 09:00 - 17:00
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => onClick(umkm)}
                            className="relative w-full px-8 py-4 text-lg font-bold text-white overflow-hidden group transition-all duration-300 shadow-glass bg-gradient-primary rounded-xl hover:scale-105 hover:shadow-glass-lg"
                        >
                            <span className="relative z-10">Book Sekarang</span>
                            <div className="absolute inset-0 transition-transform duration-300 scale-x-0 bg-gradient-to-r from-primary-600 to-primary-800 group-hover:scale-x-100" />
                            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-white/10 group-hover:opacity-100" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => onClick(umkm)}
            className="relative overflow-hidden transition-all duration-300 cursor-pointer group rounded-2xl hover:scale-105 bg-white/80 backdrop-blur-lg border border-white/20 shadow-glass hover:shadow-glass-xl"
        >
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-glass group-hover:opacity-100" />
            
            {/* Banner Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={bannerUrl}
                    alt={umkm.name}
                    className="object-cover w-full h-full transition group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = getDefaultBanner(umkm.category);
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                
                {/* Logo */}
                <div className="absolute w-16 h-16 overflow-hidden border-4 border-white shadow-lg bottom-4 left-4 rounded-2xl bg-white">
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
            <div className="p-5">
                <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-1">
                    {umkm.name}
                </h3>

                <div className="flex items-center mb-3 space-x-2">
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">4.9</span>
                </div>

                <div className="flex items-start mb-4 space-x-2 text-sm text-gray-600">
                    <MapPin className="flex-shrink-0 w-4 h-4 mt-0.5 text-primary-600" />
                    <span className="line-clamp-2">{umkm.address}</span>
                </div>

                {umkm.category && (
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full text-primary-700 bg-primary-50">
                        {umkm.category}
                    </span>
                )}

                <button className="relative w-full py-3 font-bold text-white overflow-hidden group/btn transition-all duration-300 shadow-glass bg-gradient-primary rounded-xl hover:shadow-glass-lg">
                    <span className="relative z-10">Lihat Detail</span>
                    <div className="absolute inset-0 transition-transform duration-300 scale-x-0 bg-gradient-to-r from-primary-600 to-primary-800 group-hover/btn:scale-x-100" />
                </button>
            </div>
        </div>
    );
}
