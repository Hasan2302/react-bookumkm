// resources/js/Components/AdminSidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, ShoppingBag,
  ChevronDown, ChevronRight, Menu, X, Sun, Moon, LogOut
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function AdminSidebar() {
  const [openMenu, setOpenMenu] = useState('umkm');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // KALAU LAGI RESIZE KE DESKTOP, PASTIKAN MOBILE SIDEBAR TERTUTUP!
      if (!mobile && mobileOpen) {
        setMobileOpen(false);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [mobileOpen]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

  const menus = [
    { icon: LayoutDashboard, label: 'Overview', path: '/superadmin/dashboard' },
    { icon: Building2, label: 'Umkm', path: '/superadmin/umkm' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full pt-8 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-primary-600 dark:bg-primary-500 rounded-xl">
            <div className="w-6 h-6 bg-white rounded-sm dark:bg-black"></div>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">BookUMKM</h1>
        </div>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="p-2 transition rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isOpen = openMenu === menu.id;

          if (menu.submenus) {
            return (
              <div key={menu.id} className="space-y-1">
                <button
                  onClick={() => setOpenMenu(isOpen ? null : menu.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                    isOpen ? 'bg-white dark:bg-gray-800 shadow-sm' : 'hover:bg-primary-50 dark:hover:bg-primary-900/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{menu.label}</span>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="ml-12 space-y-1"
                    >
                      {menu.submenus.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={() => isMobile && setMobileOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                            location.pathname === sub.path
                              ? 'bg-primary-600 text-white font-semibold'
                              : 'hover:bg-white/70 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <span>{sub.label}</span>
                          {sub.badge && (
                            <span className="px-2.5 py-1 text-xs font-bold bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full">
                              {sub.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={menu.path}
              to={menu.path}
              onClick={() => isMobile && setMobileOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                location.pathname === menu.path
                  ? 'bg-white dark:bg-gray-800 shadow-sm'
                  : 'hover:bg-primary-50 dark:hover:bg-primary-900/30'
              }`}
            >
              <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">{menu.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Dark Mode */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800">
        {/* Toggle Dark Mode - Icon Left */}
        <button onClick={toggle} className="flex items-center justify-center w-full gap-3 px-5 py-4 mr-2 transition bg-white border p rounded-2xl dark:bg-gray-800 border-primary-500/50 dark:border-gray-700 hover:shadow-lg" > {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />} <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span> </button>

        {/* Logout - Icon Right */}
        <button
            onClick={handleLogout}
            className="flex items-center justify-center w-24 transition bg-white border h-14 rounded-2xl dark:bg-gray-800 border-primary-500/50 dark:border-gray-700 hover:shadow-lg"
        >
            <LogOut className="w-6 h-6 text-red-500" />
        </button>
      </div>


    </div>
  );

  return (
    <>
      {/* Hamburger Button — Hanya muncul di mobile */}
      {isMobile && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed z-50 p-3 bg-white border shadow-lg top-4 right-4 dark:bg-gray-800 border-primary-500/50 dark:border-gray-700 rounded-2xl"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR — SATU DOANG, CERDAS! */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-80 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 transition-transform duration-300 ${
          isMobile
            ? mobileOpen ? 'translate-x-0' : '-translate-x-full'
            : 'translate-x-0' // Desktop selalu muncul
        }`}
      >
        {sidebarContent}
      </aside>

      {/* MAIN CONTENT PADDING — HANYA DI DESKTOP */}
      {!isMobile && (
        <div className="pl-80" />
      )}
    </>
  );
}
