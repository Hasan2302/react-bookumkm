import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarDays,
    Briefcase,
    Users,
    Wallet,
    Search,
    Bell,
    Menu,
    X,
    LogOut,
    ChevronDown,
    FileText,
    Settings,
    Home,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function MetronicLayout({ children, title = 'Dashboard', breadcrumbs = [] }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true); // Default collapsed
    const [isHovered, setIsHovered] = useState(false); // Hover state
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Sidebar is expanded if it's NOT collapsed OR if it IS collapsed but Hovered
    // Actually, let's simplify: 
    // If isCollapsed is true, it only expands on hover.
    // If isCollapsed is false, it stays expanded.
    // So, expanded = !isCollapsed || isHovered
    const sidebarExpanded = !isCollapsed || isHovered;

    const menuItems = [
        { name: 'Dashboard', path: '/umkm/dashboard', icon: LayoutDashboard },
        { name: 'Reservations', path: '/umkm/reservations', icon: CalendarDays, badge: 3 },
        { name: 'Services', path: '/umkm/services', icon: Briefcase },
        { name: 'Customers', path: '/umkm/customers', icon: Users },
        { name: 'Form Builder', path: '/umkm/formbuilder', icon: FileText },
        { name: 'Finance', path: '/umkm/finance', icon: Wallet },
        { name: 'Settings', path: '/umkm/settings', icon: Settings },
    ];

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <div className="h-screen overflow-hidden bg-[#F5F8FA] font-sans text-gray-600 flex">
            {/* SIDEBAR (Dark Mode - Metronic Style) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-[#1E1E2D] transition-all duration-300 ease-in-out 
                    ${sidebarExpanded ? 'w-[265px]' : 'w-[80px]'}
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 lg:static lg:inset-0`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm text-gray-500 hover:text-primary hidden lg:block z-50"
                >
                    {sidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {/* Logo Area */}
                <div className={`flex items-center h-[70px] bg-[#1E1E2D] ${!sidebarExpanded ? 'justify-center px-0' : 'justify-between px-6'}`}>
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white overflow-hidden">
                        <div className="flex items-center justify-center w-8 h-8 rounded bg-primary flex-shrink-0">
                            <span className="text-lg font-bold text-white">B</span>
                        </div>
                        {sidebarExpanded && <span>Book<span className="text-gray-400">UMKM</span></span>}
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1 text-gray-500 rounded-md lg:hidden hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
                    {sidebarExpanded && (
                        <div className="px-4 mb-4 text-xs font-bold uppercase text-gray-500 tracking-wider whitespace-nowrap">
                            Menu Utama
                        </div>
                    )}
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`group flex items-center ${!sidebarExpanded ? 'justify-center px-0' : 'justify-between px-4'} py-3 text-[13px] font-medium rounded-md transition-all duration-200 relative ${
                                    isActive
                                        ? 'bg-[#2B2B40] text-white'
                                        : 'text-[#A1A5B7] hover:text-white hover:bg-[#2B2B40]'
                                }`}
                                title={!sidebarExpanded ? item.name : ''}
                            >
                                <div className={`flex items-center ${!sidebarExpanded ? 'justify-center' : 'gap-3'}`}>
                                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-[#494B74] group-hover:text-primary'}`} />
                                    {sidebarExpanded && <span className="whitespace-nowrap">{item.name}</span>}
                                </div>
                                {sidebarExpanded && item.badge && (
                                    <span
                                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                            isActive ? 'bg-primary text-white' : 'bg-[#3E4265] text-gray-300'
                                        }`}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                                {!sidebarExpanded && item.badge && (
                                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-[#2B2B40]">
                    <button 
                        onClick={handleLogout} 
                        className={`flex items-center gap-3 ${!sidebarExpanded ? 'justify-center px-0' : 'px-4'} py-3 text-sm font-medium text-[#A1A5B7] rounded-md hover:text-white hover:bg-[#2B2B40] w-full transition-colors`}
                        title={!sidebarExpanded ? 'Sign Out' : ''}
                    >
                        <LogOut className="w-5 h-5 text-[#494B74] flex-shrink-0" />
                        {sidebarExpanded && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* OVERLAY */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
                {/* HEADER */}
                <header className="bg-white h-[70px] flex items-center justify-between px-4 sm:px-8 shadow-sm z-30 relative">
                    {/* Left: Mobile Toggle & Page Title (Mobile) */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        
                        {/* Desktop Search */}
                        <div className="hidden md:flex items-center">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    className="w-64 pl-10 pr-4 py-2 bg-[#F5F8FA] border-none rounded-lg text-sm font-medium text-gray-500 placeholder-gray-400 focus:bg-[#EFF2F5] focus:ring-0 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Toolbar */}
                    <div className="flex items-center gap-3 sm:gap-5">
                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2 rounded-lg transition-colors ${showNotifications ? 'bg-gray-100 text-primary' : 'text-gray-400 hover:text-primary hover:bg-gray-50'}`}
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full border border-white"></span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50 animate-fade-in-up">
                                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[url('https://preview.keenthemes.com/metronic8/demo1/assets/media/misc/menu-header-bg.jpg')] bg-cover bg-no-repeat rounded-t-lg">
                                        <h3 className="font-bold text-white text-lg">Notifications</h3>
                                        <span className="text-xs font-bold bg-[#50CD89] text-white px-2 py-1 rounded">2 new</span>
                                    </div>
                                    <div className="p-0">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50">
                                                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                                                    <CalendarDays className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">New Booking Received</p>
                                                    <p className="text-xs text-gray-400">2 hrs ago</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                                <div className="w-10 h-10 rounded bg-warning/10 flex items-center justify-center text-warning">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">New Customer Registered</p>
                                                    <p className="text-xs text-gray-400">5 hrs ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 border-t border-gray-100 text-center">
                                        <Link to="#" className="text-sm font-bold text-primary hover:text-primary-active">View All</Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 cursor-pointer pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{user.name || 'User'}</p>
                                <p className="text-xs font-medium text-gray-400">{user.email || 'Admin'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* TOOLBAR (Sub-header) */}
                <div className="h-[55px] flex items-center justify-between px-4 sm:px-8 bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
                    <div className="flex flex-col justify-center">
                        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                            <Link to="/umkm/dashboard" className="hover:text-primary">Home</Link>
                            {breadcrumbs.map((crumb, index) => (
                                <span key={index} className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className={index === breadcrumbs.length - 1 ? 'text-gray-600' : 'hover:text-primary'}>
                                        {crumb}
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-500 bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">
                            Today: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                </div>

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8" id="kt_content">
                    {children}
                </main>
            </div>
        </div>
    );
}
