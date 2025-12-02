import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
                    scrolled
                        ? 'bg-white/60 backdrop-blur-2xl shadow-glass border-gray-200/50'
                        : 'bg-transparent border-white/10'
                }`}
            >
                <div className="px-6 mx-auto max-w-7xl lg:px-8">
                    <div className="relative flex items-center justify-between h-16">
                        {/* Logo - Left */}
                        <Link to="/" className="group">
                            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? 'text-primary-900' : 'text-white drop-shadow-lg'}`}>
                                BookUMKM
                            </span>
                        </Link>

                        {/* Center Menu - Desktop */}
                        <div className="absolute hidden space-x-1 transform -translate-x-1/2 left-1/2 md:flex">
                            <Link
                                to="/"
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

                        <div className="items-center hidden space-x-3 md:flex">
                            <Link
                                to="/login"
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
                                    to="/register"
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
                                to="/"
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
                                            to="/login"
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
                                                to="/register"
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

            {/* Footer */}
            <footer className="mt-20 text-white bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
                <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                        {/* Info */}
                        <div>
                            <div className="flex items-center mb-4 space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl">
                                    <Calendar className="w-6 h-6 text-primary-900" />
                                </div>
                                <span className="text-xl font-bold">BookUMKM</span>
                            </div>
                            <p className="leading-relaxed text-blue-100">
                                Platform booking online untuk UMKM Indonesia. Memudahkan pelanggan untuk membuat reservasi dengan cepat dan mudah.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/" className="text-blue-100 transition hover:text-white hover:underline">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#tentang" className="text-blue-100 transition hover:text-white hover:underline">
                                        Tentang Kami
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login" className="text-blue-100 transition hover:text-white hover:underline">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="text-blue-100 transition hover:text-white hover:underline">
                                        Daftar UMKM
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold">Kontak</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 mt-1 text-blue-200" />
                                    <span className="text-blue-100">Jakarta, Indonesia</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-blue-200" />
                                    <span className="text-blue-100">info@bookumkm.com</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-blue-200" />
                                    <span className="text-blue-100">+62 812-3456-7890</span>
                                </li>
                            </ul>

                            {/* Social Media */}
                            <div className="flex mt-6 space-x-4">
                                <a
                                    href="#"
                                    className="flex items-center justify-center w-10 h-10 transition bg-white/10 rounded-xl hover:bg-white/20"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center justify-center w-10 h-10 transition bg-white/10 rounded-xl hover:bg-white/20"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center justify-center w-10 h-10 transition bg-white/10 rounded-xl hover:bg-white/20"
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 mt-12 text-center border-t border-blue-700">
                        <p className="text-blue-100">
                            © {new Date().getFullYear()} BookUMKM. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
