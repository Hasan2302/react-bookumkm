import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/Layouts/PublicLayout';
import UmkmCard from '@/Components/UmkmCard';
import BookingModal from '@/Components/BookingModal';
import usePublicUmkmStore from '@/Stores/usePublicUmkmStore';
import UmkmDetailModal from '@/Components/UmkmDetailModal';
import MagneticCursor from '@/Components/MagneticCursor';
import {
    Search, Scissors, Coffee, Wrench, Heart, Store, Calendar,
    TrendingUp, Star, Clock, MapPin, Phone, Shield, Award, Users, Zap,
    ChevronRight, Sparkles, Shirt, ChevronDown, Waves, Soup, Car,
    Stethoscope, Package, MessageCircle, Instagram, Video
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
        color: 'from-brand-500 to-brand-600',
        count: 45,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop'
    },
    {
        id: 'barbershop',
        name: 'Barbershop',
        icon: Scissors,
        color: 'from-brand-500 to-brand-600',
        count: 38,
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop'
    },
    {
        id: 'cafe',
        name: 'Café & Resto',
        icon: Soup,
        color: 'from-brand-500 to-brand-600',
        count: 52,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop'
    },
    {
        id: 'bengkel',
        name: 'Bengkel',
        icon: Car,
        color: 'from-brand-500 to-brand-600',
        count: 28,
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop'
    },
    {
        id: 'klinik',
        name: 'Klinik & Spa',
        icon: Stethoscope,
        color: 'from-brand-500 to-brand-600',
        count: 34,
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop'
    },
    {
        id: 'laundry',
        name: 'Laundry',
        icon: Shirt,
        color: 'from-brand-500 to-brand-600',
        count: 18,
        image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop'
    },
    {
        id: 'lainnya',
        name: 'Lainnya',
        icon: Package,
        color: 'from-brand-500 to-brand-600',
        count: 24,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    },
];

const HERO_BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';



const FEATURES = [
    {
        icon: Zap,
        title: 'Booking Instan',
        description: 'Reservasi dalam hitungan detik'
    },
    {
        icon: Shield,
        title: 'Aman & Terpercaya',
        description: 'Data terenkripsi dengan sistem keamanan berlapis'
    },
    {
        icon: Clock,
        title: '24/7 Tersedia',
        description: 'Akses kapan saja tanpa batas waktu'
    },
    {
        icon: Users,
        title: 'Support Responsif',
        description: 'Tim siap membantu dengan cepat'
    }
];

const CTA_BENEFITS = [
    { icon: Zap, text: 'Gratis 30 hari' },
    { icon: Calendar, text: 'Booking otomatis' },
    { icon: Users, text: 'Database pelanggan' },
    { icon: TrendingUp, text: 'Tingkatkan revenue' }
];

const BRAND_LOGOS = [
    { name: 'GoPay', color: 'text-blue-500' },
    { name: 'OVO', color: 'text-purple-600' },
    { name: 'Dana', color: 'text-blue-400' },
    { name: 'ShopeePay', color: 'text-orange-500' },
    { name: 'BCA', color: 'text-blue-700' },
    { name: 'Mandiri', color: 'text-yellow-600' },
    { name: 'BRI', color: 'text-blue-600' },
    { name: 'BNI', color: 'text-orange-600' },
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
        <MagneticCursor />
        {/* Hero Section - Linear Style Light Mode */}
        <section className="relative pt-24 pb-20 overflow-hidden bg-white sm:pt-32 lg:pt-40 sm:pb-28 lg:pb-32">
            {/* Metronic Grid Background */}
            <div className="absolute inset-0 bg-[size:30px_30px] bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"></div>

            {/* White Gradients for Edges & Center - Stronger Fade */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white to-transparent"></div> {/* Top */}
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white to-transparent"></div> {/* Left */}
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white via-white to-transparent"></div> {/* Right */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,transparent_60%)]"></div> {/* Center Spotlight */}

            {/* Floating App Icons (Hidden on Mobile) */}
            <div className="absolute inset-0 hidden pointer-events-none lg:block">
                {/* Left Side Icons */}
                <div className="absolute top-1/4 left-10 animate-float-slow">
                    <div className="flex items-center justify-center w-16 h-16 bg-white shadow-lg rounded-2xl rotate-[-6deg]">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
                            <MapPin className="w-8 h-8 text-gray-600 fill-current" />
                        </div>
                    </div>
                </div>
                <div className="absolute top-1/2 left-24 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center justify-center w-14 h-14 bg-white shadow-lg rounded-2xl rotate-[12deg]">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl">
                            <MessageCircle className="w-6 h-6 text-gray-600 fill-current" />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-1/4 left-12 animate-float-slow" style={{ animationDelay: '2s' }}>
                    <div className="flex items-center justify-center w-12 h-12 bg-white shadow-lg rounded-2xl rotate-[-15deg]">
                        <div className="flex items-center justify-center bg-gray-100 w-9 h-9 rounded-xl">
                            <Instagram className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Right Side Icons */}
                <div className="absolute top-1/4 right-10 animate-float" style={{ animationDelay: '1.5s' }}>
                    <div className="flex items-center justify-center w-16 h-16 bg-white shadow-lg rounded-2xl rotate-[6deg]">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
                            <Calendar className="w-8 h-8 text-gray-600" />
                        </div>
                    </div>
                </div>
                <div className="absolute top-1/2 right-24 animate-float-slow" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center justify-center w-14 h-14 bg-white shadow-lg rounded-2xl rotate-[-12deg]">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl">
                            <Star className="w-6 h-6 text-gray-600 fill-current" />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-1/4 right-12 animate-float" style={{ animationDelay: '2.5s' }}>
                    <div className="flex items-center justify-center w-12 h-12 bg-white shadow-lg rounded-2xl rotate-[15deg]">
                        <div className="flex items-center justify-center bg-gray-100 w-9 h-9 rounded-xl">
                            <Video className="w-5 h-5 text-gray-600 fill-current" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 px-4 mx-auto sm:px-6 max-w-7xl lg:px-8">
                {/* Hero Text */}
                <div className="mb-8 text-center sm:mb-16">
                    {/* Badge - Linear style */}
                    <div data-magnetic="true" className="relative inline-flex p-[1px] mb-6 overflow-hidden transition-all duration-300 rounded-full group hover:scale-105 hover:shadow-lg">
                        <div className="absolute inset-0 transition-opacity duration-300 opacity-100 bg-gradient-to-r from-brand-500 via-white to-brand-500 animate-gradient-x" />
                        <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md">
                            <span className="relative flex w-2.5 h-2.5">
                                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
                                <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            </span>
                            <span className="text-sm font-medium text-gray-700">Platform UMKM Terpercaya</span>
                        </div>
                    </div>

                    {/* Main Headline - Clean & Modern */}
                    <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-5xl lg:text-6xl">
                        Booking UMKM
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600 animate-gradient-x bg-[length:200%_auto]">
                            Jadi Mudah & Cepat
                        </span>
                    </h1>

                    <p className="max-w-2xl px-4 mx-auto text-base text-gray-600 sm:text-lg">
                        Reservasi salon, barbershop, klinik, spa & lebih banyak lagi
                    </p>
                </div>

                {/* Search Box - Linear Style */}
                <div className="relative max-w-3xl mx-auto">
                    {/* Search Glow Effect */}
                    <div className="absolute inset-0 transition-opacity duration-500 transform scale-105 bg-gradient-to-r from-white/80 via-white/50 to-white/80 blur-2xl -z-10"></div>


                    {/* Search Bar - Mobile & Desktop */}
                    <div className="flex gap-3">
                        {/* Location Button */}
                        <div ref={locationDropdownRef} className="relative">
                            <button
                                data-magnetic="true"
                                onClick={handleToggleLocationDropdown}
                                disabled={isLocating}
                                className={`flex items-center justify-center w-[52px] h-[52px] rounded-full transition-all border-2 ${
                                    myLocation
                                        ? 'bg-white text-gray-900 border-red-100 shadow-sm'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                } disabled:opacity-50`}
                            >
                                <MapPin className={`w-5 h-5 ${myLocation ? 'text-red-500' : 'text-gray-500'}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {showLocationDropdown && (
                                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-linear-lg py-2 z-[9999]">
                                    <button
                                        onClick={handleGetLocation}
                                        disabled={isLocating}
                                        className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-left text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <MapPin className="w-5 h-5 text-brand-600" />
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">
                                                {isLocating ? 'Mencari Lokasi...' : 'Lokasi Saat Ini'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Gunakan GPS saya
                                            </div>
                                        </div>
                                        {myLocation && (
                                            <div className="w-2 h-2 rounded-full bg-brand-600"></div>
                                        )}
                                    </button>
                                    {myLocation && (
                                        <button
                                            onClick={handleClearLocation}
                                            className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-left text-red-600 transition hover:bg-red-50"
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
                                className="w-full py-3.5 pl-12 pr-24 text-base font-medium text-gray-900 placeholder-gray-400 transition-all duration-200 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                            />
                            <button
                                data-magnetic="true"
                                onClick={scrollToUmkmList}
                                className="absolute px-4 py-2 text-sm font-semibold text-white transition-all duration-200 -translate-y-1/2 rounded-full right-2 top-1/2 bg-brand-600 hover:bg-brand-700 active:scale-95"
                            >
                                Cari
                            </button>
                        </div>
                    </div>

                    {locationError && (
                        <p className="mt-3 text-sm text-red-600">{locationError}</p>
                    )}

                    {/* Social Proof */}
                    <div className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row sm:gap-6">
                        {/* Avatars */}
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <img
                                    key={i}
                                    className="w-10 h-10 border-2 border-white rounded-full shadow-sm"
                                    src={`https://i.pravatar.cc/150?img=${i + 10}`}
                                    alt={`User ${i}`}
                                />
                            ))}
                        </div>

                        {/* Rating & Stats */}
                        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-base font-bold text-gray-900">4.8 Rating</span>
                            </div>
                            <p className="text-sm font-medium text-gray-600">
                                <span className="font-bold text-gray-900">150+</span> UMKM • <span className="font-bold text-gray-900">5K+</span> Bookings
                            </p>
                        </div>
                    </div>

                    {/* Brand Slider */}
                    <div className="pt-10 mt-10 sm:mt-16">
                        {/* <p className="mb-6 text-sm font-medium text-center text-gray-500">
                            Didukung oleh berbagai metode pembayaran & mitra terpercaya
                        </p> */}

                        <div className="relative flex overflow-x-hidden group">
                            <div className="flex items-center gap-12 animate-marquee whitespace-nowrap sm:gap-20">
                                {/* First set of logos */}
                                {BRAND_LOGOS.map((brand, index) => (
                                    <span
                                        key={`brand-1-${index}`}
                                        className={`text-xl sm:text-2xl font-bold opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${brand.color}`}
                                    >
                                        {brand.name}
                                    </span>
                                ))}
                                {/* Duplicate set for seamless loop */}
                                {BRAND_LOGOS.map((brand, index) => (
                                    <span
                                        key={`brand-2-${index}`}
                                        className={`text-xl sm:text-2xl font-bold opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${brand.color}`}
                                    >
                                        {brand.name}
                                    </span>
                                ))}
                                {/* Triplicate set for wide screens */}
                                {BRAND_LOGOS.map((brand, index) => (
                                    <span
                                        key={`brand-3-${index}`}
                                        className={`text-xl sm:text-2xl font-bold opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${brand.color}`}
                                    >
                                        {brand.name}
                                    </span>
                                ))}
                            </div>

                            {/* Fade edges */}
                            <div className="absolute top-0 left-0 z-10 w-32 h-full bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                            <div className="absolute top-0 right-0 z-10 w-32 h-full bg-gradient-to-l from-white via-white/80 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom Fade to UMKM Section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-b from-transparent to-gray-50"></div>
        </section>

        {/* UMKM List Section */}
        <section id="umkm-list" className="py-8 sm:py-12 bg-gray-50">
            <div className="px-3 mx-auto sm:px-4 max-w-7xl lg:px-8">

                {/* Filter Bar (Dribbble Style) */}
                {/* Filter Bar (Dribbble Style) */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 md:flex-nowrap">
                    {/* Popular Dropdown */}
                    <div className="relative order-1 shrink-0">
                        <button data-magnetic="true" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-colors">
                            <span>Terpopuler</span>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Categories Scroll */}
                    <div className="order-3 w-full min-w-0 md:order-2 md:w-auto md:flex-1">
                        <div className="flex gap-2 pb-2 -mb-2 overflow-x-auto scrollbar-hide mask-linear-fade md:justify-center">
                            <button
                                data-magnetic="true"
                                onClick={() => {
                                    setSelectedCategory('');
                                    scrollToUmkmList();
                                }}
                                className={`flex items-center px-6 py-2.5 text-sm font-medium transition-all duration-200 rounded-full whitespace-nowrap border ${
                                    selectedCategory === ''
                                        ? 'bg-gray-100 border-gray-200 text-gray-900'
                                        : 'bg-transparent border-transparent text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Semua
                            </button>
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category.id}
                                    data-magnetic="true"
                                    onClick={() => {
                                        setSelectedCategory(category.id);
                                        scrollToUmkmList();
                                    }}
                                    className={`flex items-center px-6 py-2.5 text-sm font-medium transition-all duration-200 rounded-full whitespace-nowrap border ${
                                        selectedCategory === category.id
                                            ? 'bg-gray-100 border-gray-200 text-gray-900'
                                            : 'bg-transparent border-transparent text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter Button */}
                    <div className="order-2 shrink-0 md:order-3">
                        <button data-magnetic="true" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" y1="21" x2="4" y2="14"></line>
                                <line x1="4" y1="10" x2="4" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12" y2="3"></line>
                                <line x1="20" y1="21" x2="20" y2="16"></line>
                                <line x1="20" y1="12" x2="20" y2="3"></line>
                                <line x1="1" y1="14" x2="7" y2="14"></line>
                                <line x1="9" y1="8" x2="15" y2="8"></line>
                                <line x1="17" y1="16" x2="23" y2="16"></line>
                            </svg>
                            <span>Filter</span>
                        </button>
                    </div>
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
                                className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white transition-all duration-300 shadow-lg bg-brand-600 rounded-lg hover:bg-brand-700 active:scale-95"
                            >
                                Reset Pencarian
                            </button>
                        </div>
                    )}
                </div>
            </section>

        {/* Features Section - Linear Style */}
        <section id="keunggulan" className="relative py-16 overflow-hidden border-t border-gray-100 sm:py-20 bg-gray-50">
            <div className="relative px-4 mx-auto sm:px-6 max-w-7xl lg:px-8">
                {/* Header */}
                <div className="mb-12 text-center sm:mb-16">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                        Kenapa Pilih Book UMKM?
                    </h2>
                    <p className="max-w-2xl mx-auto text-base text-gray-600 sm:text-lg">
                        Solusi booking terlengkap untuk kemudahan Anda
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-6 transition-all duration-200 bg-white group rounded-xl shadow-linear hover:shadow-linear-md hover:scale-[1.02]"
                        >
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-brand-50">
                                <item.icon className="w-6 h-6 text-brand-600" />
                            </div>

                            <h3 className="mb-2 text-lg font-bold text-gray-900">
                                {item.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section - Linear Purple */}
        <section id="cara-kerja" className="relative py-20 overflow-hidden border-t border-gray-100 sm:py-24 lg:py-32 bg-gradient-primary">
            <div className="relative px-4 mx-auto sm:px-6 max-w-7xl lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left: Content */}
                    <div className="text-center lg:text-left">
                        <h2 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                            Punya UMKM?
                            <br />
                            Bergabung Sekarang!
                        </h2>

                        <p className="max-w-xl mx-auto mb-8 text-lg leading-relaxed lg:mx-0 text-white/90">
                            Tingkatkan bisnis dengan sistem booking online modern. Kelola reservasi dan pelanggan dengan mudah.
                        </p>

                        {/* Benefits List */}
                        <div className="grid grid-cols-1 gap-3 mb-8 sm:grid-cols-2">
                            {CTA_BENEFITS.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg bg-white/10 border-white/20">
                                    <item.icon className="w-5 h-5 text-white" />
                                    <span className="text-sm font-medium text-white">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <Link
                            to="/register-umkm"
                            data-magnetic="true"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold transition-all duration-200 bg-white rounded-lg text-brand-700 hover:bg-gray-100 shadow-linear-lg active:scale-95 group"
                        >
                            <span>Daftar Gratis</span>
                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>

                        <p className="mt-4 text-sm text-white/70">
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
                                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-brand-600">
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
