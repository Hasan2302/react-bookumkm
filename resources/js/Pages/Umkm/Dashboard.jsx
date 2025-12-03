import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import {
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    Calendar as CalendarIcon,
    Clock,
    MoreVertical,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Eye,
    Pencil,
    X,
    MessageCircle,
    ArrowUpRight,
    ArrowDownRight,
    ChevronLeft,
    ChevronRight,
    Filter,
    Search
} from 'lucide-react';
import api from '@/Services/Api';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import MetronicLayout from '@/Layouts/MetronicLayout';
import Dropdown from '@/Components/Dropdown';

dayjs.locale('id');

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function UmkmDashboard() {
    const [stats, setStats] = useState({
        todayBookings: 0,
        monthlyRevenue: 0,
        newCustomers: 0,
        noShowRate: 0,
        todayServed: 0,
        status: { confirmed: 0, pending: 0, cancelled: 0 },
        dailyBookings: { labels: [], data: [] },
        revenue: { online: 0, onSite: 0 }
    });

    const [bookings, setBookings] = useState({ diterima: [], pending: [], cancelled: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('diterima');
    
    // Calendar State
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const [queue, setQueue] = useState([]);
    const [loadingQueue, setLoadingQueue] = useState(false);
    
    // Payment Proof Modal State
    const [showPaymentProofModal, setShowPaymentProofModal] = useState(false);
    const [selectedPaymentProof, setSelectedPaymentProof] = useState(null);
    const [selectedBookingInfo, setSelectedBookingInfo] = useState(null);

    const loadData = async () => {
        try {
            const [statsRes, bookingsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/bookings/recent')
            ]);

            setStats(prev => ({
                ...statsRes.data.data || statsRes.data,
                todayServed: statsRes.data.todayServed || 0
            }));
            setBookings({
                diterima: bookingsRes.data.diterima || [],
                pending: bookingsRes.data.pending || [],
                cancelled: bookingsRes.data.cancelled || []
            });
        } catch (err) {
            console.log('API gagal');
        } finally {
            setLoading(false);
        }
    };

    const fetchQueue = async (date) => {
        setLoadingQueue(true);
        try {
            const formattedDate = date.format('YYYY-MM-DD');
            const res = await api.get(`/dashboard/queue?date=${formattedDate}`);
            setQueue(res.data.data || []);
        } catch (error) {
            console.error('Gagal memuat antrian:', error);
        } finally {
            setLoadingQueue(false);
        }
    };

    useEffect(() => {
        loadData();
        fetchQueue(dayjs()); // Load queue hari ini
    }, []);

    // Fetch queue saat tanggal dipilih
    useEffect(() => {
        fetchQueue(selectedDate);
    }, [selectedDate]);

    const handleConfirm = async (bookingId) => {
        if (confirm('Apakah Anda yakin ingin menerima booking ini?')) {
            try {
                await api.post(`/bookings/${bookingId}/confirm`);
                // Only reload if modal is not open
                if (!showPaymentProofModal) {
                    loadData();
                    fetchQueue(selectedDate);
                }
            } catch (error) {
                alert('Gagal mengonfirmasi booking');
            }
        }
    };

    const handleReject = async (bookingId) => {
        if (confirm('Apakah Anda yakin ingin menolak booking ini?')) {
            try {
                await api.post(`/bookings/${bookingId}/reject`);
                // Only reload if modal is not open
                if (!showPaymentProofModal) {
                    loadData();
                    fetchQueue(selectedDate);
                }
            } catch (error) {
                alert(error.response?.data?.message || 'Gagal menolak booking');
            }
        }
    };

    const handleServed = async (bookingId) => {
        if (confirm('Tandai pelanggan ini sudah selesai dilayani?')) {
            try {
                await api.post(`/bookings/${bookingId}/served`);
                fetchQueue(selectedDate); // Refresh queue
                loadData(); // Refresh stats
            } catch (error) {
                alert('Gagal update status');
            }
        }
    };

    const handleAcceptAll = async () => {
        if (bookings.pending.length === 0) return alert('Tidak ada booking yang perlu dikonfirmasi.');
        
        if (confirm(`Apakah Anda yakin ingin menerima semua (${bookings.pending.length}) booking yang pending?`)) {
            try {
                // Iterate and confirm all pending bookings
                // Note: Ideally this should be a bulk API endpoint, but for now we iterate
                await Promise.all(bookings.pending.map(b => api.post(`/bookings/${b.id}/confirm`)));
                
                loadData();
                fetchQueue(selectedDate);
                alert('Semua booking berhasil dikonfirmasi!');
            } catch (error) {
                console.error(error);
                alert('Gagal mengonfirmasi beberapa booking');
                loadData(); // Reload to see partial success
            }
        }
    };

    const scrollToBookings = () => {
        setActiveTab('pending');
        const element = document.getElementById('recent-bookings-table');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const openWhatsApp = (booking) => {
        const phone = booking.customer_phone;
        if (!phone) return alert('Nomor telepon tidak tersedia');
        
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '62' + formattedPhone.slice(1);
        }
        
        const message = `Halo ${booking.customer_name}, kami dari BarberShop ingin mengonfirmasi booking Anda untuk layanan ${booking.service_name} pada ${booking.waktu}.`;
        window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // Calendar Logic
    const generateCalendarDays = () => {
        const startOfMonth = currentDate.startOf('month');
        const endOfMonth = currentDate.endOf('month');
        const startDay = startOfMonth.day(); // 0 (Sunday) to 6 (Saturday)
        const daysInMonth = currentDate.daysInMonth();

        const days = [];
        
        // Add empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Add days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(startOfMonth.date(i));
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    // Metronic Style Chart Data
    const revenueData = {
        labels: stats.dailyBookings?.labels?.length > 0 ? stats.dailyBookings.labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Revenue',
                data: stats.dailyBookings?.data?.length > 0 ? stats.dailyBookings.data : [1200000, 1900000, 1500000, 2200000, 1800000, 2800000, 2500000],
                borderColor: '#009EF7', // Metronic Primary Blue
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(0, 158, 247, 0.3)');
                    gradient.addColorStop(1, 'rgba(0, 158, 247, 0.05)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#009EF7',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
                borderWidth: 3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1E1E2D',
                padding: 12,
                titleFont: { size: 13, family: 'Inter' },
                bodyFont: { size: 13, family: 'Inter' },
                displayColors: false,
                cornerRadius: 6,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { 
                    color: '#EFF2F5', 
                    borderDash: [4, 4],
                    drawBorder: false,
                },
                ticks: { 
                    font: { size: 11, family: 'Inter' }, 
                    color: '#B5B5C3',
                    padding: 10,
                    callback: function(value) {
                        if (value >= 1000000) {
                            return (value / 1000000) + 'jt';
                        } else if (value >= 1000) {
                            return (value / 1000) + 'rb';
                        }
                        return value;
                    }
                },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11, family: 'Inter' }, color: '#B5B5C3' },
                border: { display: false }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    // Get current tab data
    const currentTabBookings = bookings[activeTab] || [];

    if (loading) {
        return (
            <MetronicLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </MetronicLayout>
        );
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <MetronicLayout title="Dashboard" breadcrumbs={['Overview']}>
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Halo, {user.umkm_name || user.name || 'UMKM'}!</h1>
                        <p className="text-xs sm:text-sm text-gray-500">Pantau bisnis kamu hari ini</p>
                    </div>
                    <Link to="/umkm/formbuilder" className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white transition-all rounded-lg bg-primary hover:bg-primary-active shadow-lg shadow-primary/30">
                        <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="hidden sm:inline">Edit Form Booking</span>
                        <span className="sm:hidden">Edit Form</span>
                    </Link>
                </div>

                {/* Hero Stats Card - Compact Dark */}
                <div className="relative overflow-hidden bg-[#1e1e2d] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm">
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-1.5 sm:gap-2">
                                    <span className="text-2xl sm:text-3xl font-bold text-white">{stats.status.pending}</span>
                                    <span className="text-xs sm:text-sm font-medium text-white/80">Menunggu Konfirmasi</span>
                                </div>
                                <p className="text-[10px] sm:text-xs text-white/50">Segera konfirmasi pesanan masuk.</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleAcceptAll}
                                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold text-gray-900 bg-white rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                                <span className="hidden sm:inline">Terima Semua</span>
                                <span className="sm:hidden">Terima</span>
                            </button>
                            <button 
                                onClick={scrollToBookings}
                                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm flex items-center justify-center gap-1.5"
                            >
                                <span className="hidden sm:inline">Lihat Detail</span>
                                <span className="sm:hidden">Detail</span>
                                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
                    {[
                        { label: 'Booking Hari Ini', value: stats.todayBookings, icon: CalendarIcon, color: 'text-primary', bg: 'bg-primary/10' },
                        { label: 'Total Diterima', value: stats.status.confirmed, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
                        { label: 'Pending', value: stats.status.pending, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
                        { label: 'Dibatalkan', value: stats.status.cancelled, icon: XCircle, color: 'text-danger', bg: 'bg-danger/10' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1">{stat.label}</p>
                                <h3 className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
                            </div>
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {/* Left Column: Chart & Recent Bookings */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
                        {/* Revenue Chart - Hidden on Mobile */}
                        <div className="hidden md:block bg-white border border-gray-100 shadow-sm rounded-xl p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">Trend Booking 7 Hari</h3>
                            </div>
                            <div className="h-64 sm:h-72">
                                <Line data={revenueData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Recent Bookings Table */}
                        <div id="recent-bookings-table" className="bg-white border border-gray-100 shadow-sm rounded-lg sm:rounded-xl">
                            <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                <h3 className="text-sm sm:text-base font-bold text-gray-900">Booking Terbaru</h3>
                                <div className="flex p-1 bg-gray-100 rounded-lg overflow-x-auto">
                                    {['diterima', 'pending', 'cancelled'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`relative px-4 py-2 text-xs font-bold rounded-md capitalize transition-all ${
                                                activeTab === tab 
                                                ? 'bg-white text-gray-900 shadow-sm' 
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            {tab === 'diterima' ? 'Diterima' : tab === 'cancelled' ? 'Dibatalkan' : tab} 
                                            <span className="ml-1 opacity-60">({bookings[tab]?.length || 0})</span>
                                            
                                            {/* Pending Indicator */}
                                            {tab === 'pending' && bookings.pending.length > 0 && (
                                                <span className="absolute top-1 right-1 flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="overflow-x-auto pb-32"> {/* Added padding bottom to prevent dropdown clipping */}
                                <table className="w-full">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="hidden sm:table-cell px-3 sm:px-5 py-2 sm:py-3 text-xs font-bold text-left text-gray-400 uppercase">ID</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-xs font-bold text-left text-gray-400 uppercase">Pelanggan</th>
                                            <th className="hidden md:table-cell px-3 sm:px-5 py-2 sm:py-3 text-xs font-bold text-left text-gray-400 uppercase">Layanan</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-xs font-bold text-left text-gray-400 uppercase">Harga</th>
                                            <th className="hidden lg:table-cell px-3 sm:px-5 py-2 sm:py-3 text-xs font-bold text-left text-gray-400 uppercase">Waktu</th>
                                            <th className="hidden sm:table-cell px-3 sm:px-5 py-2 sm:py-3 text-xs font-bold text-left text-gray-400 uppercase">Status</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-xs font-bold text-right text-gray-400 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {currentTabBookings.length > 0 ? (
                                            currentTabBookings.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="hidden sm:table-cell px-3 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-xs font-bold text-gray-500">#{booking.id}</td>
                                                    <td className="px-3 sm:px-5 py-2 sm:py-3">
                                                        <div className="text-xs sm:text-sm font-bold text-gray-900">{booking.customer_name}</div>
                                                        <div className="sm:hidden text-[10px] text-gray-500 mt-0.5">#{booking.id}</div>
                                                    </td>
                                                    <td className="hidden md:table-cell px-3 sm:px-5 py-2 sm:py-3 text-xs text-gray-600">{booking.service_name}</td>
                                                    <td className="px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-bold text-success">
                                                        <div className="md:hidden text-[10px] text-gray-500 mb-0.5">{booking.service_name}</div>
                                                        Rp {Number(booking.total_price).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="hidden lg:table-cell px-3 sm:px-5 py-2 sm:py-3 text-xs text-gray-600">{booking.waktu}</td>
                                                    <td className="hidden sm:table-cell px-3 sm:px-5 py-2 sm:py-3">
                                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                                            <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                                                                activeTab === 'diterima' ? 'bg-success text-white' :
                                                                activeTab === 'pending' ? 'bg-warning text-white' :
                                                                'bg-danger text-white'
                                                            }`}>
                                                                {activeTab === 'diterima' ? 'Diterima' :
                                                                 activeTab === 'pending' ? 'Pending' : 'Dibatalkan'}
                                                            </span>
                                                            {(booking.payment_method === 'cash' || booking.payment_method === 'offline') && (
                                                                <span className="hidden lg:inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-blue-500 text-white">
                                                                    Cash
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 sm:px-6 py-2 sm:py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                            {activeTab === 'pending' && (
                                                                <>
                                                                    <button 
                                                                        onClick={() => handleConfirm(booking.id)}
                                                                        className="p-1.5 sm:p-2 text-success bg-success/10 rounded hover:bg-success hover:text-white transition-colors"
                                                                        title="Terima"
                                                                    >
                                                                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleReject(booking.id)}
                                                                        className="p-1.5 sm:p-2 text-danger bg-danger/10 rounded hover:bg-danger hover:text-white transition-colors"
                                                                        title="Tolak"
                                                                    >
                                                                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                                    </button>
                                                                </>
                                                            )}
                                                            {activeTab === 'diterima' && (
                                                                <button 
                                                                    onClick={() => openWhatsApp(booking)}
                                                                    className="p-1.5 sm:p-2 text-success bg-success/10 rounded hover:bg-success hover:text-white transition-colors"
                                                                    title="WhatsApp"
                                                                >
                                                                    <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                                </button>
                                                            )}
                                                            <Dropdown>
                                                                <Dropdown.Trigger>
                                                                    <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600">
                                                                        <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                                    </button>
                                                                </Dropdown.Trigger>
                                                                <Dropdown.Content width="48" align="right">
                                                                    <Dropdown.Button onClick={() => alert(`Detail Booking #${booking.id}\nPelanggan: ${booking.customer_name}\nLayanan: ${booking.service_name}`)}>
                                                                        Lihat Detail
                                                                    </Dropdown.Button>
                                                                    
                                                                    <Dropdown.Button onClick={() => {
                                                                        if (booking.payment_method === 'cash' || booking.payment_method === 'offline') {
                                                                            alert('Pembayaran Cash tidak memerlukan bukti transfer');
                                                                        } else if (booking.payment_proof) {
                                                                            setSelectedPaymentProof(booking.payment_proof);
                                                                            setSelectedBookingInfo({
                                                                                id: booking.id,
                                                                                customer_name: booking.customer_name,
                                                                                service_name: booking.service_name,
                                                                                total_price: booking.total_price,
                                                                                date: booking.tanggal,
                                                                                time: booking.waktu
                                                                            });
                                                                            setShowPaymentProofModal(true);
                                                                        } else {
                                                                            alert('Belum ada bukti pembayaran yang diunggah pelanggan');
                                                                        }
                                                                    }}>
                                                                        Lihat Bukti Pembayaran
                                                                    </Dropdown.Button>

                                                                    <Dropdown.Button onClick={() => alert('Fitur edit booking akan segera hadir')}>
                                                                        Edit Booking
                                                                    </Dropdown.Button>
                                                                </Dropdown.Content>
                                                            </Dropdown>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                                    Tidak ada data booking {activeTab === 'diterima' ? 'diterima' : activeTab === 'pending' ? 'pending' : 'dibatalkan'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Calendar & Queue */}
                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                        {/* Calendar Widget */}
                        <div className="bg-primary rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-lg shadow-primary/20">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold">Antrian</h3>
                                    <p className="text-[10px] sm:text-xs text-white/70">{selectedDate.format('dddd, D MMM YYYY')}</p>
                                </div>
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center text-xs sm:text-sm font-bold">
                                    {queue.length}
                                </div>
                            </div>

                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-3 sm:mb-4 bg-white/10 rounded-lg p-1.5 sm:p-2">
                                <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))} className="p-1 hover:bg-white/10 rounded">
                                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                                <span className="text-xs sm:text-sm font-bold">{currentDate.format('MMMM YYYY')}</span>
                                <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))} className="p-1 hover:bg-white/10 rounded">
                                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center mb-2">
                                {weekDays.map(d => (
                                    <div key={d} className="text-[9px] sm:text-[10px] font-medium text-white/60 uppercase">{d}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center">
                                {calendarDays.map((date, i) => (
                                    <div key={i} className="aspect-square flex items-center justify-center">
                                        {date && (
                                            <button
                                                onClick={() => setSelectedDate(date)}
                                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                                                    date.isSame(selectedDate, 'day')
                                                        ? 'bg-white text-primary font-bold shadow-md'
                                                        : 'hover:bg-white/10 text-white'
                                                }`}
                                            >
                                                {date.date()}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Queue List */}
                        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5">
                            {loadingQueue ? (
                                <div className="py-8 text-center text-gray-500">Memuat antrian...</div>
                            ) : queue.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                                                1
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{queue[0].customer_name}</h3>
                                                <p className="text-xs text-gray-500">{queue[0].service_name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-primary">{queue[0].time_only}</div>
                                            {queue[0].status !== 'served' ? (
                                                <button 
                                                    onClick={() => handleServed(queue[0].id)}
                                                    className="text-xs font-bold text-white bg-success px-3 py-1 rounded-full mt-1 hover:bg-success-active transition-colors"
                                                >
                                                    Selesai
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-1">
                                                    Dilayani
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Next Queue */}
                                    <div className="border-t border-gray-100 pt-4 mt-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Berikutnya</h4>
                                        <div className="space-y-3">
                                            {queue.slice(1).map((booking, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                                            {i + 2}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">{booking.customer_name}</div>
                                                            <div className="text-xs text-gray-500">{booking.service_name}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs font-bold text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                                                        {booking.time_only}
                                                    </div>
                                                </div>
                                            ))}
                                            {queue.length <= 1 && (
                                                <div className="text-center text-sm text-gray-400 py-2">
                                                    Tidak ada antrian berikutnya
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="py-8 text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gray-100 rounded-full">
                                        <CalendarIcon className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">Tidak ada antrian pada tanggal ini</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Payment Proof Modal */}
            {showPaymentProofModal && selectedPaymentProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowPaymentProofModal(false)}>
                <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Bukti Pembayaran</h3>
                            {selectedBookingInfo && (
                                <p className="mt-1 text-sm text-gray-600">
                                    Booking #{selectedBookingInfo.id} - {selectedBookingInfo.customer_name}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setShowPaymentProofModal(false)}
                            className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-gray-100 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Booking Info */}
                    {selectedBookingInfo && (
                        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-b border-gray-200">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                                <div>
                                    <p className="text-xs text-gray-500">Layanan</p>
                                    <p className="font-semibold text-gray-900 text-sm">{selectedBookingInfo.service_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Total</p>
                                    <p className="font-semibold text-success text-sm">Rp {Number(selectedBookingInfo.total_price).toLocaleString('id-ID')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Tanggal</p>
                                    <p className="font-semibold text-gray-900 text-sm">{selectedBookingInfo.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Waktu</p>
                                    <p className="font-semibold text-gray-900 text-sm">{selectedBookingInfo.time}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Image Preview */}
                    <div className="p-4 sm:p-6 max-h-[60vh] overflow-auto">
                        <div className="flex items-center justify-center bg-gray-100 rounded-lg">
                            <img
                                src={`/storage/${selectedPaymentProof}`}
                                alt="Bukti Pembayaran"
                                className="object-contain w-full max-h-[50vh] rounded-lg"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="18"%3EGambar tidak dapat dimuat%3C/text%3E%3C/svg%3E';
                                }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                        <a
                            href={`/storage/${selectedPaymentProof}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                        </a>
                        <a
                            href={`/storage/${selectedPaymentProof}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary-active"
                        >
                            <Eye className="w-4 h-4" />
                            Buka di Tab Baru
                        </a>
                        <button
                            onClick={() => setShowPaymentProofModal(false)}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        )}
        </MetronicLayout>
    );
}
