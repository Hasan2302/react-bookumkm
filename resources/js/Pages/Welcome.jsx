import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/Layouts/PublicLayout';
import UmkmCard from '@/Components/UmkmCard';
import BookingModal from '@/Components/BookingModal';
import usePublicUmkmStore from '@/Stores/usePublicUmkmStore';
import {
    Search, Scissors, Coffee, Wrench, Heart, Store, Calendar,
    TrendingUp, Star, Clock, MapPin, Phone, Shield, Award, Users, Zap,
    ChevronRight, Sparkles
} from 'lucide-react';

export default function Welcome() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedUmkm, setSelectedUmkm] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { umkms, featured, loading, error, fetchUmkms } = usePublicUmkmStore();

    useEffect(() => {
        fetchUmkms();
    }, [fetchUmkms]);

    const filteredUmkms = useMemo(() => {
        if (!umkms || umkms.length === 0) return [];

        let filtered = umkms;

        if (selectedCategory) {
            filtered = filtered.filter(u =>
                u.category?.toLowerCase().includes(selectedCategory.toLowerCase())
            );
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(u =>
                u.name?.toLowerCase().includes(term) ||
                u.address?.toLowerCase().includes(term) ||
                u.category?.toLowerCase().includes(term) ||
                u.description?.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [umkms, searchTerm, selectedCategory]);

    // BARU BOLEH RETURN DI SINI (setelah semua hook!)
    if (loading) {
        return (
            <PublicLayout>
                <div className="py-32 text-center">
                    <div className="text-2xl font-semibold text-gray-600">Memuat UMKM...</div>
                </div>
            </PublicLayout>
        );
    }

    if (error) {
        return (
            <PublicLayout>
                <div className="py-32 text-center">
                    <div className="text-xl font-semibold text-red-600">{error}</div>
                </div>
            </PublicLayout>
        );
    }

// Categories inspired by Trip.com booking sections
const categories = [
    {
        id: 'salon',
        name: 'Salon & Spa',
        icon: Scissors,
        color: 'from-primary-500 to-primary-600',
        count: 45,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop'
    },
    {
        id: 'barbershop',
        name: 'Barbershop',
        icon: Scissors,
        color: 'from-primary-500 to-primary-600',
        count: 38,
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop'
    },
    {
        id: 'cafe',
        name: 'Café & Resto',
        icon: Coffee,
        color: 'from-primary-500 to-primary-600',
        count: 52,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop'
    },
    {
        id: 'bengkel',
        name: 'Bengkel',
        icon: Wrench,
        color: 'from-primary-500 to-primary-600',
        count: 28,
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop'
    },
    {
        id: 'klinik',
        name: 'Klinik & Spa',
        icon: Heart,
        color: 'from-primary-500 to-primary-600',
        count: 34,
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop'
    },
    {
        id: 'lainnya',
        name: 'Lainnya',
        icon: Store,
        color: 'from-primary-500 to-primary-600',
        count: 24,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    },
];

const handleOpenBooking = (umkm) => {
    setSelectedUmkm(umkm);
    setShowModal(true);
};

return (
    <PublicLayout>
        {/* <Head title="BookUMKM - Platform Booking UMKM Indonesia" /> */}

        {/* Hero Section with Search Box (Trip.com style) */}
        <section className="relative pt-24 pb-32 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&h=1080&fit=crop&q=80"
                    alt="BookUMKM Background"
                    className="object-cover w-full h-full"
                />
                {/* Blue Overlay dengan opacity rendah */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-700/40 via-primary-800/50 to-primary-900/60"></div>

                {/* Top gradient untuk kontras navbar */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>

                {/* Pattern overlay untuk texture */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 bg-white rounded-full w-96 h-96 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 bg-white rounded-full w-96 h-96 blur-3xl"></div>
                </div>
            </div>

            <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Hero Text - Minimalist */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 space-x-2 rounded-full bg-white/20 backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 text-yellow-300 sm:w-4 sm:h-4" />
                        <span className="text-xs font-semibold text-white sm:text-sm">Platform Booking UMKM Terpercaya</span>
                    </div>

                    <h1 className="mb-3 text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                        Booking UMKM<br className="md:hidden" /> Jadi Mudah
                    </h1>
                    <p className="text-base text-white/90 md:text-lg">
                        Reservasi salon, barbershop, klinik & lebih banyak lagi
                    </p>
                </div>

                {/* Search Box Card - Mobile Optimized */}
                <div className="max-w-4xl p-4 mx-auto shadow-2xl sm:p-6 lg:p-8 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl">
                    {/* Category Tabs - Compact Mobile */}
                    <div className="grid grid-cols-3 gap-2 mb-4 sm:gap-3 sm:mb-6 md:grid-cols-6">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id === selectedCategory ? '' : cat.id)}
                                className={`flex flex-col items-center p-2 sm:p-3 lg:p-4 transition-all duration-300 rounded-xl sm:rounded-2xl group ${
                                    selectedCategory === cat.id
                                        ? 'bg-gradient-to-br ' + cat.color + ' text-white shadow-lg scale-105'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <cat.icon className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${selectedCategory === cat.id ? 'text-white' : 'text-gray-600'}`} />
                                <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight">{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Search Input - Mobile Optimized */}
                    <div className="relative">
                        <div className="absolute -translate-y-1/2 left-4 sm:left-6 top-1/2">
                            <Search className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari UMKM atau lokasi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-3 pl-12 pr-20 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all duration-300 border-2 border-gray-200 sm:py-4 lg:py-5 sm:pl-14 lg:pl-16 sm:pr-24 sm:text-base lg:text-lg rounded-xl sm:rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none"
                        />
                        <button
                            onClick={() => document.getElementById('umkm-list')?.scrollIntoView({ behavior: 'smooth' })}
                            className="absolute px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base font-bold text-white transition-all duration-300 shadow-lg right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg sm:rounded-xl hover:shadow-xl hover:scale-105"
                        >
                            Cari
                        </button>
                    </div>

                    {/* Quick Stats - Hidden on Mobile, Show on Tablet+ */}
                    <div className="hidden gap-4 mt-4 text-xs text-gray-600 sm:flex sm:items-center sm:justify-center sm:gap-6 sm:mt-6 sm:text-sm">
                        <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-primary-600" />
                            <span><strong className="text-gray-900">150+</strong> UMKM</span>
                        </div>
                        <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary-600" />
                            <span><strong className="text-gray-900">5K+</strong> Booking</span>
                        </div>
                        <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span><strong className="text-gray-900">4.8</strong> Rating</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Featured UMKM Banner (if exists) */}
        {featured && (
            <section className="py-12 bg-white">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Premium Border Container */}
                    <div className="relative p-[3px] rounded-3xl bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 shadow-2xl">
                        {/* White Background Card */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-white rounded-3xl">
                            {/* Subtle Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-cyan-300 blur-3xl"></div>
                            </div>

                            <div className="relative z-10 grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
                                <div>
                                    {/* Premium Badge */}
                                    <div className="inline-flex items-center px-4 py-2 mb-4 space-x-2 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                                        <Award className="w-5 h-5 text-yellow-300" />
                                        <span className="text-sm font-bold text-white">UMKM Pilihan</span>
                                    </div>

                                    <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
                                        {featured.name}
                                    </h2>
                                    <p className="mb-2 text-lg font-semibold text-primary-600">{featured.category}</p>
                                    <p className="flex items-start gap-2 mb-6 text-gray-700">
                                        <MapPin className="w-5 h-5 mt-1 text-primary-600 shrink-0" />
                                        <span>{featured.address}</span>
                                    </p>
                                    <button
                                        onClick={() => handleOpenBooking(featured)}
                                        className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl hover:shadow-xl hover:scale-105"
                                    >
                                        Booking Sekarang
                                    </button>
                                </div>
                                <div className="relative h-64 md:h-80">
                                    <img
                                        src={featured.banner || 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop'}
                                        alt={featured.name}
                                        className="object-cover w-full h-full border-4 border-white shadow-2xl rounded-2xl"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )}

        {/* Popular Categories Section */}
        <section className="py-16 bg-white">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
                        Kategori Populer
                    </h2>
                    <p className="text-lg text-gray-600">Pilih kategori UMKM yang Anda butuhkan</p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setSelectedCategory(cat.id);
                                document.getElementById('umkm-list')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="relative overflow-hidden transition-all duration-300 bg-white border-2 border-gray-100 group rounded-2xl hover:border-primary-300 hover:shadow-lg hover:-translate-y-1"
                        >
                            {/* Background Image */}
                            <div className="relative h-32 overflow-hidden">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60`}></div>
                            </div>

                            {/* Content */}
                            <div className="relative p-4 bg-white">
                                <div className="flex flex-col items-center">
                                    <div className={`p-3 mb-2 -mt-10 rounded-xl bg-gradient-to-br ${cat.color} shadow-lg`}>
                                        <cat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="mb-1 text-sm font-bold text-center text-gray-900">{cat.name}</h3>
                                    <p className="text-xs text-gray-500">{cat.count}+ UMKM</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>

        {/* UMKM List Section */}
        <section id="umkm-list" className="py-16 bg-gray-50">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="mb-2 text-3xl font-bold text-gray-900">
                            {selectedCategory
                                ? categories.find(c => c.id === selectedCategory)?.name
                                : 'Semua UMKM'}
                        </h2>
                        <p className="text-gray-600">
                            {filteredUmkms.length} UMKM tersedia
                        </p>
                    </div>
                    {selectedCategory && (
                        <button
                            onClick={() => setSelectedCategory('')}
                            className="px-6 py-3 text-sm font-semibold transition-all duration-300 border-2 text-primary-700 border-primary-200 rounded-xl hover:bg-primary-50"
                        >
                            Lihat Semua
                        </button>
                    )}
                </div>

                {/* UMKM Grid */}
                {filteredUmkms.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredUmkms.map((umkm) => (
                            <UmkmCard
                                key={umkm.id}
                                umkm={umkm}
                                onClick={() => handleOpenBooking(umkm)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gray-100 rounded-full">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900">Tidak ada hasil</h3>
                        <p className="mb-6 text-gray-600">Coba kata kunci atau kategori lain</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('');
                            }}
                            className="px-6 py-3 text-sm font-semibold text-white transition-all duration-300 shadow-lg bg-primary-600 rounded-xl hover:bg-primary-700 hover:shadow-xl"
                        >
                            Reset Pencarian
                        </button>
                    </div>
                )}
            </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
                        Kenapa Pilih BookUMKM?
                    </h2>
                    <p className="text-lg text-gray-600">Kemudahan dan keamanan dalam satu platform</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            icon: Zap,
                            title: 'Booking Instan',
                            desc: 'Reservasi langsung tanpa menunggu konfirmasi manual',
                            color: 'from-yellow-400 to-orange-500'
                        },
                        {
                            icon: Shield,
                            title: 'Aman & Terpercaya',
                            desc: 'Data Anda dilindungi dengan enkripsi tingkat tinggi',
                            color: 'from-green-400 to-emerald-500'
                        },
                        {
                            icon: Clock,
                            title: '24/7 Tersedia',
                            desc: 'Booking kapan saja, di mana saja, tanpa batas waktu',
                            color: 'from-blue-400 to-cyan-500'
                        },
                        {
                            icon: Users,
                            title: 'Dukungan Penuh',
                            desc: 'Tim support siap membantu Anda setiap saat',
                            color: 'from-purple-400 to-pink-500'
                        }
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="p-8 transition-all duration-300 bg-white border-2 border-gray-100 group rounded-2xl hover:border-primary-300 hover:shadow-xl hover:-translate-y-2"
                        >
                            <div className={`inline-flex p-4 mb-4 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg`}>
                                <item.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-900">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
            <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
                <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
                    Punya UMKM?
                </h2>
                <p className="max-w-2xl mx-auto mb-8 text-xl text-blue-100">
                    Daftarkan bisnis Anda dan dapatkan lebih banyak pelanggan dengan sistem booking online
                </p>
                <Link
                    to="/register-umkm"
                    className="inline-flex items-center gap-2 px-10 py-5 text-lg font-bold transition-all duration-300 bg-white shadow-2xl text-primary-700 rounded-2xl hover:scale-105 hover:shadow-3xl"
                >
                    Daftar Sekarang Gratis
                    <ChevronRight className="w-5 h-5" />
                </Link>
            </div>
        </section>

        {/* Booking Modal */}
        {showModal && selectedUmkm && (
            <BookingModal
                isOpen={showModal}
                umkm={selectedUmkm}
                onClose={() => {
                    setShowModal(false);
                    setSelectedUmkm(null);
                }}
            />
        )}
    </PublicLayout>
);
}
