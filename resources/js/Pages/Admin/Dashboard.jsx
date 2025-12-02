// resources/js/Pages/Superadmin/Dashboard.jsx
import AdminSidebar from '@/Components/AdminSidebar';
import { Search, Filter, X, TrendingUp, Users, Building2, DollarSign, Calendar } from 'lucide-react';
import { useTheme } from '@/Components/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/dark.css';
import {
    ResponsiveContainer,
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip
  } from 'recharts';

export default function Dashboard() {
  const { isDark } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('line');

  const pieData = [
    { name: 'Total UMKM', value: stats?.total_umkm || 120 },
    { name: 'Revenue (dalam juta)', value: (stats?.revenue || 11800000) / 1000000 }
  ];

  const tooltipStyle = {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '12px'
  };

  const dateInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const fpInstance = useRef(null);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

  const [filter, setFilter] = useState({
    startDate: null,
    endDate: null,
    status: 'all'
  });

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/dashboard/data', {
        params: {
          start_date: filter.startDate,
          end_date: filter.endDate,
          status: filter.status !== 'all' ? filter.status : undefined,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(res.data.summary);
      setChartData(res.data.chart || dummyChartData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dummyChartData = [
    { name: 'Jan', umkm: 12, revenue: 2400000 },
    { name: 'Feb', umkm: 19, revenue: 3800000 },
    { name: 'Mar', umkm: 24, revenue: 5200000 },
    { name: 'Apr', umkm: 28, revenue: 6800000 },
    { name: 'Mei', umkm: 35, revenue: 9200000 },
    { name: 'Jun', umkm: 42, revenue: 11800000 },
  ];

  const handleSearch = async (value) => {
    setSearch(value);
    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      const res = await axios.get('/api/admin/dashboard/data', {
        params: { search: value },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSearchResults(res.data.umkms);
      setShowDropdown(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (showFilter && dateInputRef.current) {
      fpInstance.current = flatpickr(dateInputRef.current, {
        mode: "range",
        dateFormat: "d M Y",
        theme: isDark ? "dark" : "light",
        conjunction: " - ",
        onClose: (dates) => {
          if (dates.length === 2) {
            setFilter(prev => ({
              ...prev,
              startDate: dates[0]?.toISOString().split('T')[0],
              endDate: dates[1]?.toISOString().split('T')[0]
            }));
          }
        }
      });
    }
  }, [showFilter, isDark]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [filter]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} transition-colors`}>
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main style={{ marginLeft: window.innerWidth < 1024 ? 0 : collapsed ? '80px' : '320px' }} className="min-h-screen transition-all duration-500">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">

          {/* PAGE HEADER */}
          <div className="flex flex-col gap-6 mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Overview</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Snapshot performa UMKM dalam {filter.startDate ? 'periode terpilih' : '30 hari terakhir'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilter(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* KPI CARDS */}
          <section className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array(4).fill().map((_, i) => (
                <div key={i} className="p-6 bg-white border rounded-xl dark:bg-gray-800 animate-pulse">
                  <div className="w-24 h-4 mb-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div className="w-32 h-8 bg-gray-300 rounded dark:bg-gray-600"></div>
                </div>
              ))
            ) : (
              <>
                <KPICard title="Total UMKM" value={stats?.total_umkm || 0} icon={Building2} change="+12.5%" positive />
                <KPICard title="UMKM Aktif" value={stats?.active_umkm || 0} icon={Users} change="+8.2%" positive />
                <KPICard title="Total Revenue" value={formatRupiah(stats?.revenue || 0)} icon={DollarSign} change="+24.1%" positive />
                <KPICard title="Pertumbuhan" value="+42%" icon={TrendingUp} change="vs tahun lalu" positive />
              </>
            )}
          </section>

          {/* CHART + SEARCH */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* CHART DENGAN TAB SWITCHER */}
            <div className="p-6 bg-white border lg:col-span-2 rounded-xl dark:bg-gray-800">
                <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-gray-900 dark:text-white">Pertumbuhan UMKM & Revenue</p>

                    {/* TAB BUTTON GROUP */}
                    <div className="inline-flex p-1 border border-gray-300 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    {['line', 'bar', 'pie', 'area'].map((type) => (
                        <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={`px-4 py-2 text-xs font-medium rounded-md transition-all capitalize
                            ${chartType === type
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                        {type === 'pie' ? 'Pie' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={380}>
                    {chartType === 'line' && (
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                        <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Line type="monotone" dataKey="umkm" stroke="#8b5cf6" strokeWidth={3} name="UMKM Baru" dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Revenue (Rp)" dot={{ r: 5 }} />
                    </LineChart>
                    )}

                    {chartType === 'bar' && (
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                        <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="umkm" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="UMKM Baru" />
                        <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} name="Revenue" />
                    </BarChart>
                    )}

                    {chartType === 'pie' && (
                    <PieChart>
                        <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#8b5cf6' : '#10b981'} />
                        ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                    )}

                    {chartType === 'area' && (
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                        <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="umkm" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="UMKM Baru" />
                        <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Revenue" />
                    </AreaChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* SEARCH CARD */}
            <div className="p-6 bg-white border rounded-xl dark:bg-gray-800">
              <p className="mb-4 font-semibold text-gray-900 dark:text-white">Cari UMKM</p>
              <div className="relative" ref={dropdownRef}>
                <div className="relative">
                  <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Nama, subdomain..."
                    className="w-full py-3 pl-10 pr-4 bg-transparent border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <AnimatePresence>
                  {showDropdown && searchResults.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-3 space-y-3 overflow-y-auto max-h-96">
                      {searchResults.map(u => (
                        <div key={u.id} className="flex items-center gap-4 p-3 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{u.subdomain}.bookumkm.id</p>
                          </div>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{formatRupiah(u.revenue)}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* OFFCANVAS FILTER */}
      <AnimatePresence>
        {showFilter && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFilter(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full p-8 overflow-y-auto bg-white border-l border-gray-200 shadow-2xl w-96 dark:bg-gray-900 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Filter</h2>
                <button onClick={() => setShowFilter(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">Rentang Tanggal</label>
                  <input ref={dateInputRef} type="text" readOnly placeholder="Pilih tanggal..." className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-800" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Status</label>
                  <select value={filter.status} onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-6">
                  <button onClick={() => { setFilter({ startDate: null, endDate: null, status: 'all' }); setShowFilter(false); }}
                    className="flex-1 py-3 font-medium border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                    Reset
                  </button>
                  <button onClick={() => setShowFilter(false)}
                    className="flex-1 py-3 font-medium text-white transition bg-gray-900 rounded-lg dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200">
                    Terapkan
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// KPI Card Component
function KPICard({ title, value, icon: Icon, change, positive = true }) {
  return (
    <div className="p-6 bg-white border shadow-sm rounded-xl dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
      <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {change && (
        <p className={`mt-2 text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {positive ? 'Up' : 'Down'} {change}
        </p>
      )}
    </div>
  );
}
