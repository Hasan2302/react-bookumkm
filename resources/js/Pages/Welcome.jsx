import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/Layouts/PublicLayout';
import UmkmCard from '@/Components/UmkmCard';
import BookingModal from '@/Components/BookingModal';
import usePublicUmkmStore from '@/Stores/usePublicUmkmStore';
import UmkmDetailModal from '@/Components/UmkmDetailModal';
import {
    Search, Scissors, Coffee, Wrench, Heart, Store, Calendar,
    TrendingUp, Star, Clock, MapPin, Phone, Shield, Award, Users, Zap,
    ChevronRight, Sparkles, Shirt, ChevronDown, Waves, Soup, Car,
    Stethoscope, Package
} from 'lucide-react';

export default function Welcome(userLocation) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedUmkm, setSelectedUmkm] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [myLocation, setMyLocation] = useState(userLocation);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const locationDropdownRef = useRef(null);
    const locationDropdownDesktopRef = useRef(null);

    const { umkms, featured, loading, error, fetchUmkms } = usePublicUmkmStore();

    useEffect(() => {
        fetchUmkms();
    }, [fetchUmkms]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const lat = urlParams.get('lat');
        const lng = urlParams.get('lng');
        const radius = urlParams.get('radius') || '10';

        fetchUmkms({
            lat: lat || undefined,
            lng: lng || undefined,
            radius: radius || undefined
        });
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            // For location dropdown: check both mobile and desktop
            const clickedInsideLocation =
                (locationDropdownRef.current && locationDropdownRef.current.contains(event.target)) ||
                (locationDropdownDesktopRef.current && locationDropdownDesktopRef.current.contains(event.target));

            if (!clickedInsideLocation && showLocationDropdown) {
                setShowLocationDropdown(false);
            }
        };

        // Add event listener
        if (showLocationDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLocationDropdown]);

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
const CATEGORIES = [
    {
        id: 'salon',
        name: 'Salon & Spa',
        icon: Waves,
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
        icon: Soup,
        color: 'from-primary-500 to-primary-600',
        count: 52,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop'
    },
    {
        id: 'bengkel',
        name: 'Bengkel',
        icon: Car,
        color: 'from-primary-500 to-primary-600',
        count: 28,
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop'
    },
    {
        id: 'klinik',
        name: 'Klinik & Spa',
        icon: Stethoscope,
        color: 'from-primary-500 to-primary-600',
        count: 34,
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop'
    },
    {
        id: 'laundry',
        name: 'Laundry',
        icon: Shirt,
        color: 'from-primary-500 to-primary-600',
        count: 18,
        image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop'
    },
    {
        id: 'lainnya',
        name: 'Lainnya',
        icon: Package,
        color: 'from-primary-500 to-primary-600',
        count: 24,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    },
];

const HERO_BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const STATS = [
    { icon: Store, value: '150+', label: 'UMKM', color: 'text-blue-200' },
    { icon: Calendar, value: '5K+', label: 'Booking', color: 'text-blue-200' },
    { icon: Star, value: '4.8', label: 'Rating', color: 'text-yellow-300', fill: true }
];

const FEATURES = [
    {
        icon: Zap,
        title: 'Booking Instan',
        description: 'Reservasi dalam hitungan detik',
        gradient: 'from-primary-500 to-primary-600'
    },
    {
        icon: Shield,
        title: 'Aman & Terpercaya',
        description: 'Data terenkripsi dengan sistem keamanan berlapis',
        gradient: 'from-primary-600 to-primary-700'
    },
    {
        icon: Clock,
        title: '24/7 Tersedia',
        description: 'Akses kapan saja tanpa batas waktu',
        gradient: 'from-primary-500 to-primary-600'
    },
    {
        icon: Users,
        title: 'Support Responsif',
        description: 'Tim siap membantu dengan cepat',
        gradient: 'from-primary-600 to-primary-700'
    }
];

const CTA_BENEFITS = [
    { icon: Zap, text: 'Gratis 30 hari' },
    { icon: Calendar, text: 'Booking otomatis' },
    { icon: Users, text: 'Database pelanggan' },
    { icon: TrendingUp, text: 'Tingkatkan revenue' }
];

const scrollToUmkmList = () => {
    document.getElementById('umkm-list')?.scrollIntoView({ behavior: 'smooth' });
};

const handleOpenBooking = (umkm) => {
    setSelectedUmkm(umkm);
    setShowModal(true);
};

const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUmkm(null);
};

const handleViewDetail = (umkm) => {
    setSelectedUmkm(umkm);
    setShowDetailModal(true);
};

const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedUmkm(null);
};

// Toggle location dropdown
const handleToggleLocationDropdown = () => {
    setShowLocationDropdown(!showLocationDropdown);
};

const handleGetLocation = () => {
    if (!navigator.geolocation) {
        setLocationError('Browser tidak mendukung geolocation');
        return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;

            // LANGSUNG UPDATE STORE TANPA RELOAD HALAMAN!
            await fetchUmkms({ lat: latitude, lng: longitude, radius: 10 });
            setMyLocation({ lat: latitude, lng: longitude });
            setIsLocating(false);
        },
        (error) => {
            setIsLocating(false);
            setLocationError('Gagal mengambil lokasi. Pastikan izin diberikan.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
};

const handleClearLocation = () => {
    window.location.href = '/';
};

return (
    <PublicLayout>
        {/* <Head title="BookUMKM - Platform Booking UMKM Indonesia" /> */}

        {/* Hero Section with Search Box (Trip.com style) */}
        {/* Hero Section - Mobile Optimized */}
        <section className="relative pt-24 pb-16 overflow-hidden sm:pt-28 lg:pt-32 sm:pb-24 lg:pb-32">
                {/* Background Image with Parallax Effect */}
                <div className="absolute inset-0">
                    <img
                        src={HERO_BACKGROUND_IMAGE}
                        alt="BookUMKM Background"
                        className="object-cover w-full h-full scale-110"
                    />
                    {/* Gradient Overlay - Enhanced */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-700/45 via-primary-800/55 to-primary-900/65"></div>

                    {/* Top gradient untuk kontras navbar */}
                    <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>

                    {/* Subtle pattern overlay - Minimalist */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 bg-white rounded-full left-1/4 w-96 h-96 blur-3xl"></div>
                        <div className="absolute bottom-0 bg-blue-200 rounded-full right-1/4 w-96 h-96 blur-3xl"></div>
                    </div>
                </div>

                <div className="relative z-10 px-3 mx-auto sm:px-4 max-w-7xl lg:px-8">
                    {/* Hero Text - Minimalist Modern */}
                    <div className="mb-4 text-center sm:mb-6 lg:mb-8">
                        {/* Badge - Minimalist */}
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                            <div className="flex gap-0.5">
                                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="w-px h-3 sm:h-4 bg-white/30"></div>
                            <span className="text-[10px] sm:text-xs font-semibold text-white/90">Platform UMKM Terpercaya</span>
                        </div>

                        {/* Main Headline - Clean & Bold */}
                        <h1 className="mb-2 text-3xl font-bold leading-tight text-white sm:mb-3 sm:text-4xl md:text-5xl lg:text-6xl">
                            Booking UMKM
                            <br />
                            <span className="text-blue-200">
                                Jadi Mudah & Cepat
                            </span>
                        </h1>

                        <p className="max-w-2xl px-4 mx-auto text-xs sm:text-sm lg:text-base text-white/90">
                            Reservasi salon, barbershop, klinik, spa & lebih banyak lagi
                        </p>
                    </div>

                    {/* Search Box Card - Integrated with Category Dropdown */}
                    <div className="max-w-4xl mx-auto px-4 relative z-[100]">
                        {myLocation && (
                            <div className="flex items-center justify-between mb-2 text-xs">
                                <span className="text-white/90">📍 Menampilkan UMKM terdekat</span>
                                <button
                                    onClick={handleClearLocation}
                                    className="underline text-white/90 hover:text-white"
                                >
                                    Reset Lokasi
                                </button>
                            </div>
                        )}

                        {/* Mobile: Compact Search Bar */}
                        <div className="relative md:hidden">
                            <div className="flex gap-2">
                                {/* Location Dropdown Button */}
                                <div ref={locationDropdownRef} className="relative">
                                    <button
                                        onClick={handleToggleLocationDropdown}
                                        disabled={isLocating}
                                        className={`flex items-center gap-1.5 px-3 py-3.5 rounded-full transition-all ${
                                            myLocation
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-white/95 text-gray-700 hover:bg-white'
                                        } shadow-lg disabled:opacity-50`}
                                    >
                                        <MapPin className="w-4 h-4" />
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Dropdown Menu - Location Mobile */}
                                    {showLocationDropdown && (
                                        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-[9999]">
                                            <button
                                                onClick={handleGetLocation}
                                                disabled={isLocating}
                                                className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50"
                                            >
                                                <MapPin className="w-4 h-4 text-primary-600" />
                                                <div className="flex-1">
                                                    <div className="font-semibold">
                                                        {isLocating ? 'Mencari Lokasi...' : 'Lokasi Saat Ini'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Gunakan GPS saya
                                                    </div>
                                                </div>
                                                {myLocation && (
                                                    <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                                                )}
                                            </button>
                                            {myLocation && (
                                                <button
                                                    onClick={handleClearLocation}
                                                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3"
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                    <span>Reset Lokasi</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Search Input */}
                                <div className="relative flex-1">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                                        <Search className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari UMKM..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                scrollToUmkmList();
                                            }
                                        }}
                                        className="w-full py-3.5 pl-10 pr-12 text-sm font-medium text-gray-900 placeholder-gray-400 transition-all duration-200 bg-white/95 backdrop-blur-xl border-0 rounded-full shadow-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                                    />
                                    <button
                                        onClick={scrollToUmkmList}
                                        className="absolute p-2 text-white transition-all duration-300 -translate-y-1/2 rounded-full right-2 top-1/2 bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-lg active:scale-95"
                                    >
                                        <Search className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            {locationError && (
                                <p className="mt-2 text-xs text-red-300">{locationError}</p>
                            )}
                        </div>

                        {/* Desktop: Enhanced Search Bar */}
                        <div className="relative hidden md:block">
                            <div className="flex gap-2">
                                {/* Location Dropdown - Desktop */}
                                <div ref={locationDropdownDesktopRef} className="relative">
                                    <button
                                        onClick={handleToggleLocationDropdown}
                                        disabled={isLocating}
                                        className={`flex items-center gap-2 px-4 py-3 lg:py-4 rounded-full transition-all ${
                                            myLocation
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-white/95 text-gray-700 hover:bg-white'
                                        } shadow-xl disabled:opacity-50`}
                                    >
                                        <MapPin className="w-5 h-5" />
                                        <span className="text-sm font-semibold">
                                            {isLocating ? 'Mencari...' : myLocation ? 'Terdekat' : 'Lokasi'}
                                        </span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {/* Dropdown Menu - Location Desktop */}
                                    {showLocationDropdown && (
                                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-[99999]">
                                            <button
                                                onClick={handleGetLocation}
                                                disabled={isLocating}
                                                className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-left text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <MapPin className="w-5 h-5 text-primary-600" />
                                                <div className="flex-1">
                                                    <div className="font-semibold">
                                                        {isLocating ? 'Mencari Lokasi...' : 'Lokasi Saat Ini'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Tampilkan UMKM terdekat dari posisi saya
                                                    </div>
                                                </div>
                                                {myLocation && (
                                                    <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                                                )}
                                            </button>
                                            {myLocation && (
                                                <button
                                                    onClick={handleClearLocation}
                                                    className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-left text-red-600 hover:bg-red-50"
                                                >
                                                    <MapPin className="w-5 h-5" />
                                                    <span>Reset Lokasi</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Search Input */}
                                <div className="relative flex-1">
                                    <div className="absolute -translate-y-1/2 left-4 top-1/2">
                                        <Search className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari UMKM berdasarkan nama atau lokasi..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                scrollToUmkmList();
                                            }
                                        }}
                                        className="w-full py-3 pl-12 text-base font-medium text-gray-900 placeholder-gray-400 transition-all duration-300 border-0 rounded-full shadow-xl lg:py-4 pr-14 bg-white/95 backdrop-blur-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                                    />
                                    <button
                                        onClick={scrollToUmkmList}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 lg:p-3 text-white transition-all duration-300 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full hover:shadow-lg active:scale-95"
                                    >
                                        <Search className="w-4 h-4 lg:w-5 lg:h-5" />
                                    </button>
                                </div>
                            </div>
                            {locationError && (
                                <p className="mt-2 text-xs text-red-300">{locationError}</p>
                            )}
                        </div>

                        {/* Quick Stats - Hidden on Mobile, Show on Tablet+ */}
                        <div className="hidden gap-3 mt-4 text-xs sm:flex sm:items-center sm:justify-center sm:gap-4 text-white/90">
                            {STATS.map((stat, index) => (
                                <div key={index} className="flex items-center gap-1.5">
                                    {index > 0 && <div className="w-px h-3 bg-white/30 mr-1.5"></div>}
                                    <stat.icon className={`w-3.5 h-3.5 ${stat.color} ${stat.fill ? 'fill-current' : ''}`} />
                                    <span>
                                        <strong className="text-white">{stat.value}</strong> {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative z-10 pt-8 pb-4 sm:pt-10 sm:pb-6 bg-gray-50">
                <div className="mx-auto max-w-7xl">
                    {/* Mobile: Horizontal Scroll */}
                    <div className="relative sm:hidden">
                        <div className="overflow-x-auto scrollbar-hide">
                            <div className="flex gap-3 px-3 snap-x snap-mandatory">
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setSelectedCategory(category.id);
                                            scrollToUmkmList();
                                        }}
                                        className="flex flex-col items-center flex-shrink-0 w-16 gap-2 snap-start"
                                    >
                                        {/* Icon Box */}
                                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                                            selectedCategory === category.id
                                                ? 'bg-primary-600 shadow-md'
                                                : 'bg-white shadow-sm active:scale-95'
                                        }`}>
                                            <category.icon className={`w-7 h-7 ${
                                                selectedCategory === category.id
                                                    ? 'text-white'
                                                    : 'text-primary-600'
                                            }`} />
                                        </div>
                                        {/* Label */}
                                        <span className={`text-[10px] font-semibold text-center leading-tight w-16 ${
                                            selectedCategory === category.id
                                                ? 'text-primary-600'
                                                : 'text-gray-700'
                                        }`}>
                                            {category.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Gradient Indicator - Right */}
                        <div className="absolute top-0 bottom-0 right-0 w-12 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
                    </div>

                    {/* Desktop: Grid */}
                    <div className="hidden gap-4 px-4 sm:grid sm:grid-cols-4 lg:grid-cols-7 lg:px-8">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category.id);
                                    scrollToUmkmList();
                                }}
                                className="flex flex-col items-center gap-2.5"
                            >
                                {/* Icon Box */}
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                                    selectedCategory === category.id
                                        ? 'bg-primary-600 shadow-md'
                                        : 'bg-white shadow-sm hover:shadow-md active:scale-95'
                                }`}>
                                    <category.icon className={`w-7 h-7 ${
                                        selectedCategory === category.id
                                            ? 'text-white'
                                            : 'text-primary-600'
                                    }`} />
                                </div>
                                {/* Label */}
                                <span className={`text-xs font-semibold text-center leading-tight ${
                                    selectedCategory === category.id
                                        ? 'text-primary-600'
                                        : 'text-gray-700'
                                }`}>
                                    {category.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* UMKM List Section */}
            <section id="umkm-list" className="py-8 sm:py-12 bg-gray-50">
                <div className="px-3 mx-auto sm:px-4 max-w-7xl lg:px-8">
                    {/* Section Header */}
                    <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
                        <div className="flex-1 min-w-0">
                            <h2 className="mb-1 text-xl font-bold text-gray-900 truncate sm:text-2xl lg:text-3xl">
                                {selectedCategory
                                    ? CATEGORIES.find(c => c.id === selectedCategory)?.name
                                    : 'Semua UMKM'}
                            </h2>
                            <p className="text-xs text-gray-600 sm:text-sm">
                                {filteredUmkms.length} UMKM tersedia
                            </p>
                        </div>
                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory('')}
                                className="flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 border text-primary-700 border-primary-200 rounded-lg hover:bg-primary-50 active:scale-95"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    {/* UMKM Grid */}
                    {filteredUmkms.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {filteredUmkms.map((umkm) => (
                                <UmkmCard
                                    key={umkm.id}
                                    umkm={umkm}
                                    onClick={() => handleOpenBooking(umkm)}
                                    onViewDetail={handleViewDetail}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center sm:py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full sm:w-20 sm:h-20 sm:mb-6">
                                <Search className="w-8 h-8 text-gray-400 sm:w-10 sm:h-10" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">Tidak ada hasil</h3>
                            <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">Coba kata kunci atau kategori lain</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('');
                                }}
                                className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white transition-all duration-300 shadow-lg bg-primary-600 rounded-lg hover:bg-primary-700 active:scale-95"
                            >
                                Reset Pencarian
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us Section - Mobile Optimized */}
            <section className="relative py-8 overflow-hidden sm:py-12 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 rounded-full left-1/4 w-96 h-96 bg-primary-400 blur-3xl"></div>
                    <div className="absolute bottom-0 rounded-full right-1/4 w-96 h-96 bg-primary-300 blur-3xl"></div>
                </div>

                <div className="relative px-3 mx-auto sm:px-4 max-w-7xl lg:px-8">
                    {/* Header - Modern */}
                    <div className="mb-6 text-center sm:mb-8">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-3 rounded-full bg-primary-100 text-primary-700">
                            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="text-[10px] sm:text-xs font-semibold">Keunggulan Kami</span>
                        </div>
                        <h2 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
                            Kenapa Pilih BookUMKM?
                        </h2>
                        <p className="max-w-2xl px-4 mx-auto text-xs text-gray-600 sm:text-sm">
                            Solusi booking terlengkap untuk kemudahan Anda
                        </p>
                    </div>

                    {/* Features Grid - Compact Cards */}
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {FEATURES.map((item, idx) => (
                            <div
                                key={idx}
                                className="relative p-4 transition-all duration-300 bg-white border border-gray-200 rounded-lg sm:p-5 lg:p-6 group sm:rounded-xl hover:border-primary-300 hover:shadow-lg active:scale-95"
                            >
                                {/* Icon with gradient background */}
                                <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className="w-5 h-5 text-white sm:w-6 sm:h-6" />
                                </div>

                                <h3 className="mb-1.5 sm:mb-2 text-sm sm:text-base lg:text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                                    {item.description}
                                </p>

                                {/* Hover indicator */}
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-b-lg sm:rounded-b-xl bg-gradient-to-r from-primary-500 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Mobile Optimized */}
            <section className="relative py-8 overflow-hidden sm:py-12 lg:py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute bg-white rounded-full top-10 right-10 w-72 h-72 blur-3xl animate-pulse"></div>
                    <div className="absolute bg-blue-400 rounded-full bottom-10 left-10 w-96 h-96 blur-3xl"></div>
                </div>

                <div className="relative px-3 mx-auto sm:px-4 max-w-7xl lg:px-8">
                    <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
                        {/* Left: Content */}
                        <div className="text-center lg:text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-3 sm:mb-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                                <span className="text-[10px] sm:text-xs font-semibold text-white">Untuk Pemilik Bisnis</span>
                            </div>

                            <h2 className="mb-2 text-2xl font-bold leading-tight text-white sm:mb-3 sm:text-3xl lg:text-4xl">
                                Punya UMKM?
                                <br />
                                <span className="text-blue-200">Bergabung Sekarang!</span>
                            </h2>

                            <p className="max-w-xl px-2 mx-auto mb-4 text-xs leading-relaxed text-blue-100 lg:mx-0 sm:mb-6 sm:text-sm lg:text-base">
                                Tingkatkan bisnis dengan sistem booking online modern. Kelola reservasi dan pelanggan dengan mudah.
                            </p>

                            {/* Benefits List */}
                            <div className="grid grid-cols-1 gap-2 mb-4 sm:grid-cols-2 sm:gap-3 sm:mb-6">
                                {CTA_BENEFITS.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <div className="flex items-center justify-center flex-shrink-0 rounded-md w-7 h-7 sm:w-8 sm:h-8 sm:rounded-lg bg-white/20">
                                            <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                        </div>
                                        <span className="text-[11px] sm:text-xs font-medium text-white">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <Link
                                to="/register-umkm"
                                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 text-sm sm:text-base font-bold transition-all duration-300 shadow-xl text-primary-700 bg-white rounded-xl sm:rounded-2xl hover:scale-105 active:scale-95 group w-full sm:w-auto"
                            >
                                <span>Daftar Gratis</span>
                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <p className="mt-3 text-[10px] sm:text-xs text-blue-200">
                                ✨ Tanpa biaya • Tanpa kartu kredit
                            </p>
                        </div>

                        {/* Right: Visual/Stats */}
                        <div className="hidden lg:block">
                            <div className="relative">
                                {/* Main Card */}
                                <div className="relative p-6 border shadow-2xl lg:p-8 bg-white/10 backdrop-blur-xl border-white/20 rounded-3xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>

                                    <div className="relative space-y-6">
                                        {/* Mock Dashboard Preview */}
                                        <div className="flex items-center gap-4 p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-primary-600">
                                                <Store className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold text-white">Dashboard UMKM</div>
                                                <div className="text-xs text-blue-200">Kelola bisnis Anda</div>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: 'Booking Hari Ini', value: '24', icon: Calendar },
                                                { label: 'Total Revenue', value: '5.2M', icon: TrendingUp },
                                                { label: 'Pelanggan Aktif', value: '156', icon: Users },
                                                { label: 'Rating', value: '4.9', icon: Star }
                                            ].map((stat, idx) => (
                                                <div key={idx} className="p-4 border bg-white/20 backdrop-blur-sm rounded-xl border-white/30">
                                                    <stat.icon className="w-5 h-5 mb-2 text-blue-200" />
                                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                                    <div className="text-xs text-blue-200">{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Feature Highlights */}
                                        <div className="space-y-3">
                                            {[
                                                'Form booking kustom',
                                                'Notifikasi WhatsApp otomatis',
                                                'Laporan analitik lengkap'
                                            ].map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-3 text-sm text-white">
                                                    <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 bg-green-400 rounded-full">
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute px-4 py-2 rounded-full shadow-xl -top-4 -right-4 bg-gradient-to-r from-green-400 to-emerald-500">
                                    <span className="text-sm font-bold text-white">🚀 Gratis!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        {/* Detail Modal */}
        {showDetailModal && selectedUmkm && (
            <UmkmDetailModal
                isOpen={showDetailModal}
                umkm={selectedUmkm}
                onClose={handleCloseDetailModal}
                onBooking={handleOpenBooking}
            />
        )}

        {/* Booking Modal */}
        {showModal && selectedUmkm && (
            <BookingModal
                isOpen={showModal}
                umkm={selectedUmkm}
                onClose={handleCloseModal}
            />
        )}
    </PublicLayout>
);
}
