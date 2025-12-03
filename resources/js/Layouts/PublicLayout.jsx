import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Menu,
    X,
    Calendar,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
} from "lucide-react";

export default function PublicLayout({ children, canLogin, canRegister }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar - Modern Minimalist */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    scrolled
                        ? "bg-white/30 backdrop-blur-md border-b border-white/20 py-2 shadow-sm"
                        : "bg-transparent py-3"
                }`}
            >
                <div className="px-6 mx-auto max-w-7xl lg:px-8">
                    <div className="flex items-center justify-between h-12">
                        {/* Logo - Minimalist */}
                        <Link to="/" className="group">
                            <span className="text-xl font-bold tracking-tighter text-gray-900 transition-colors duration-300 group-hover:text-brand-600">
                                BookUMKM
                            </span>
                        </Link>

                        {/* Center Menu - Clean Text Links */}
                        <div className="absolute hidden transform -translate-x-1/2 left-1/2 md:flex items-center gap-8">
                            {['UMKM', 'Keunggulan', 'Cara Kerja'].map((item) => (
                                <a
                                    key={item}
                                    to={`#${item.toLowerCase().replace(' ', '-')}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const id = item.toLowerCase().replace(' ', '-');
                                        const element = id === 'umkm' ? document.getElementById('umkm-list') : document.querySelector(`#${id}`);
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-brand-600"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        {/* Right Menu - Modern Actions */}
                        <div className="items-center hidden gap-4 md:flex">
                            <Link
                                to="/login"
                                className="px-5 py-2 text-sm font-medium text-gray-700 transition-all duration-200 border-2 border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    to="/register-umkm"
                                    className="px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 bg-brand-600 rounded-full hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20 active:scale-95"
                                >
                                    Daftar Sekarang
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-gray-600 transition-colors duration-200 rounded-lg md:hidden hover:bg-gray-100 hover:text-gray-900"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - Modern Clean */}
                {mobileMenuOpen && (
                    <div className="absolute left-0 right-0 px-4 pt-2 pb-6 bg-white/90 backdrop-blur-2xl border-b border-gray-100 shadow-lg md:hidden top-full">
                        <div className="flex flex-col space-y-2">
                            {['UMKM', 'Keunggulan', 'Cara Kerja'].map((item) => (
                                <a
                                    key={item}
                                    to={`#${item.toLowerCase().replace(' ', '-')}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const id = item.toLowerCase().replace(' ', '-');
                                        const element = id === 'umkm' ? document.getElementById('umkm-list') : document.querySelector(`#${id}`);
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                        setMobileMenuOpen(false);
                                    }}
                                    className="px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                                >
                                    {item}
                                </a>
                            ))}

                            <div className="pt-4 mt-2 space-y-2 border-t border-gray-100">
                                <Link
                                    to="/login"
                                    className="block px-4 py-3 text-sm font-medium text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-50 hover:text-gray-900"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register-umkm"
                                    className="block w-full px-4 py-3 text-sm font-medium text-center text-white transition-all duration-300 bg-brand-600 rounded-full hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20 active:scale-95"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Daftar Sekarang
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer - Minimalist Modern */}
            <footer className="mt-16 border-t border-gray-200 sm:mt-20 bg-gray-50">
                <div className="px-4 py-12 mx-auto sm:py-16 max-w-7xl sm:px-6 lg:px-8">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
                        {/* Brand & Description */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center mb-4 space-x-2">
                                <span className="text-lg font-bold text-gray-900 sm:text-xl">
                                    BookUMKM
                                </span>
                            </div>
                            <p className="max-w-md mb-6 text-sm leading-relaxed text-gray-600 sm:text-base">
                                Platform booking online #1 untuk UMKM Indonesia.
                                Mudah, cepat, dan terpercaya.
                            </p>

                            {/* Social Media - Minimalist */}
                            <div className="flex gap-3">
                                <a
                                    to="#"
                                    className="flex items-center justify-center text-gray-600 transition bg-white border border-gray-200 rounded-lg w-9 h-9 sm:w-10 sm:h-10 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                                </a>
                                <a
                                    to="#"
                                    className="flex items-center justify-center text-gray-600 transition bg-white border border-gray-200 rounded-lg w-9 h-9 sm:w-10 sm:h-10 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                                </a>
                                <a
                                    to="#"
                                    className="flex items-center justify-center text-gray-600 transition bg-white border border-gray-200 rounded-lg w-9 h-9 sm:w-10 sm:h-10 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Untuk Pelanggan */}
                        <div>
                            <h3 className="mb-4 text-sm font-bold tracking-wide text-gray-900 uppercase">
                                Untuk Pelanggan
                            </h3>
                            <ul className="space-y-2.5">
                                <li>
                                    <Link
                                        to="/"
                                        className="text-sm text-gray-600 transition hover:text-brand-600"
                                    >
                                        Cari UMKM
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/#umkm-list"
                                        className="text-sm text-gray-600 transition hover:text-brand-600"
                                    >
                                        Kategori
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/login"
                                        className="text-sm text-gray-600 transition hover:text-brand-600"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="#"
                                        className="text-sm text-gray-600 transition hover:text-brand-600"
                                    >
                                        Bantuan
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Untuk UMKM */}
                        <div>
                            <h3 className="mb-4 text-sm font-bold tracking-wide text-gray-900 uppercase">
                                Untuk UMKM
                            </h3>
                            <ul className="space-y-2.5">
                                <li>
                                    <Link
                                        to="/register-umkm"
                                        className="text-sm text-gray-600 transition hover:text-brand-600"
                                    >
                                        Daftar UMKM
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/login"
                                        className="text-sm text-gray-600 transition hover:text-brand-600"
                                    >
                                        Login Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="#"
                                        className="text-sm text-gray-600 transition hover:text-brand-600"
                                    >
                                        Fitur & Harga
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="#"
                                        className="text-sm text-gray-600 transition hover:text-brand-600"
                                    >
                                        Tutorial
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="flex flex-col items-center justify-between gap-4 pt-8 mt-12 border-t border-gray-200 sm:flex-row">
                        <p className="text-xs text-center text-gray-500 sm:text-sm sm:text-left">
                            © {new Date().getFullYear()} BookUMKM. All rights
                            reserved.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:gap-6 sm:text-sm">
                            <Link
                                to="#"
                                className="text-gray-500 transition hover:text-gray-900"
                            >
                                Syarat & Ketentuan
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link
                                to="#"
                                className="text-gray-500 transition hover:text-gray-900"
                            >
                                Kebijakan Privasi
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
