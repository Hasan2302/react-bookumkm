import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X, Calendar, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function PublicLayout({ children, canLogin, canRegister }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar - More Transparent */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
                    scrolled
                        ? 'bg-white/30 backdrop-blur-xl shadow-sm border-gray-200/30'
                        : 'bg-transparent border-white/10'
                }`}
            >
                <div className="px-6 mx-auto max-w-7xl lg:px-8">
                    <div className="relative flex items-center justify-between h-16">
                        {/* Logo - Left */}
                        <Link href="/" className="group">
                            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? 'text-primary-900' : 'text-white drop-shadow-lg'}`}>
                                BookUMKM
                            </span>
                        </Link>

                        {/* Center Menu - Desktop */}
                        <div className="absolute hidden space-x-1 transform -translate-x-1/2 left-1/2 md:flex">
                            <Link
                                href="/"
                                className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                                    scrolled 
                                        ? 'text-gray-700 hover:bg-gray-700/20 hover:text-primary-700' 
                                        : 'text-white/90 hover:bg-white/20 hover:text-white'
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="#tentang"
                                className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                                    scrolled 
                                        ? 'text-gray-700 hover:bg-gray-700/20 hover:text-primary-700' 
                                        : 'text-white/90 hover:bg-white/20 hover:text-white'
                                }`}
                            >
                                Tentang
                            </Link>
                        </div>

                        {/* Right Menu - Desktop */}
                        {canLogin && (
                            <div className="items-center hidden space-x-3 md:flex">
                                <Link
                                    href="/login"
                                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                                        scrolled 
                                            ? 'text-gray-700 hover:bg-gray-700/20 hover:text-primary-700' 
                                            : 'text-white hover:bg-white/20 hover:text-white'
                                    }`}
                                >
                                    Login
                                </Link>
                                {canRegister && (
                                    <Link
                                        href="/register"
                                        className={`relative px-6 py-2 text-sm font-semibold transition-all duration-300 overflow-hidden group rounded-lg ${
                                            scrolled 
                                                ? 'bg-white text-primary-700 border-2 border-primary-200 hover:bg-white/80 hover:border-primary-300 shadow-sm' 
                                                : 'bg-white text-primary-700 hover:bg-white/80 shadow-lg'
                                        }`}
                                    >
                                        <span className="relative z-10">Daftar</span>
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`p-2 transition-all duration-300 rounded-lg md:hidden ${
                                scrolled 
                                    ? 'hover:bg-gray-700/20' 
                                    : 'hover:bg-white/20'
                            }`}
                        >
                            {mobileMenuOpen ? (
                                <X className={`w-5 h-5 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
                            ) : (
                                <Menu className={`w-5 h-5 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - Minimalist */}
                {mobileMenuOpen && (
                    <div className="absolute left-0 right-0 shadow-glass-lg md:hidden top-full bg-white/80 backdrop-blur-2xl">
                        <div className="px-4 py-4 space-y-1">
                            <Link
                                href="/"
                                className="block px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 rounded-lg hover:bg-gray-700/20 hover:text-primary-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="#tentang"
                                className="block px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 rounded-lg hover:bg-gray-700/20 hover:text-primary-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Tentang
                            </Link>
                            
                            {canLogin && (
                                <>
                                    <div className="pt-3 mt-3 space-y-2 border-t border-gray-200/50">
                                        <Link
                                            href="/login"
                                            className="relative block px-4 py-2.5 text-sm font-semibold text-primary-700 transition-all duration-300 rounded-lg overflow-hidden group bg-primary-50 hover:bg-primary-100 shadow-sm"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                                Login
                                            </span>
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href="/register"
                                                className="relative block px-4 py-3 text-sm font-bold text-center text-white transition-all duration-300 overflow-hidden group shadow-glass bg-gradient-primary rounded-lg hover:shadow-glass-lg hover:scale-[1.02]"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                    </svg>
                                                    Daftar Sekarang
                                                </span>
                                                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-white/20 group-hover:opacity-100" />
                                            </Link>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer - Minimalist Modern */}
            <footer className="mt-16 sm:mt-20 bg-gray-50 border-t border-gray-200">
                <div className="px-4 py-12 sm:py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
                        {/* Brand & Description */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center mb-4 space-x-2">
                                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-lg">
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <span className="text-lg sm:text-xl font-bold text-gray-900">BookUMKM</span>
                            </div>
                            <p className="mb-6 text-sm sm:text-base text-gray-600 leading-relaxed max-w-md">
                                Platform booking online #1 untuk UMKM Indonesia. Mudah, cepat, dan terpercaya.
                            </p>
                            
                            {/* Social Media - Minimalist */}
                            <div className="flex gap-3">
                                <a
                                    href="#"
                                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-gray-600 transition bg-white border border-gray-200 rounded-lg hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-gray-600 transition bg-white border border-gray-200 rounded-lg hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-gray-600 transition bg-white border border-gray-200 rounded-lg hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Untuk Pelanggan */}
                        <div>
                            <h3 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wide">Untuk Pelanggan</h3>
                            <ul className="space-y-2.5">
                                <li>
                                    <Link href="/" className="text-sm text-gray-600 transition hover:text-primary-600">
                                        Cari UMKM
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#umkm-list" className="text-sm text-gray-600 transition hover:text-primary-600">
                                        Kategori
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="text-sm text-gray-600 transition hover:text-primary-600">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm text-gray-600 transition hover:text-primary-600">
                                        Bantuan
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Untuk UMKM */}
                        <div>
                            <h3 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wide">Untuk UMKM</h3>
                            <ul className="space-y-2.5">
                                <li>
                                    <Link href="/register" className="text-sm text-gray-600 transition hover:text-primary-600">
                                        Daftar UMKM
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="text-sm text-gray-600 transition hover:text-primary-600">
                                        Login Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm text-gray-600 transition hover:text-primary-600">
                                        Fitur & Harga
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm text-gray-600 transition hover:text-primary-600">
                                        Tutorial
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="flex flex-col items-center justify-between gap-4 pt-8 mt-12 border-t border-gray-200 sm:flex-row">
                        <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                            © {new Date().getFullYear()} BookUMKM. All rights reserved.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
                            <Link href="#" className="text-gray-500 transition hover:text-gray-900">
                                Syarat & Ketentuan
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link href="#" className="text-gray-500 transition hover:text-gray-900">
                                Kebijakan Privasi
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
