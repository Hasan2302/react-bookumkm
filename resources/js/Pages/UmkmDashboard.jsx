// resources/js/Pages/Umkm/UmkmDashboard.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Home, FileText, Settings, Menu } from 'lucide-react';

// Register ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export default function UmkmDashboard({ auth, stats }) {
    const [activeTab, setActiveTab] = useState('this_week');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Nav Items
    const currentRoute = route().current();

    const navItems = [
        { name: 'Dashboard', href: route('umkm.dashboard'), icon: Home, current: currentRoute === 'umkm.dashboard' },
        { name: 'Form Booking', href: route('umkm.formbooking'), icon: FileText, current: currentRoute === 'umkm.formbooking' },
        { name: 'Pengaturan', href: route('umkm.settings'), icon: Settings, current: currentRoute === 'umkm.settings' },
    ];

    // Chart Data (dummy)
    // Dummy Data (PASTI ADA datasets!)
    const lineData = {
        labels: ['Jul 21', 'Jul 22', 'Jul 23', 'Jul 24', 'Jul 25'],
        datasets: [
            {
                label: 'Total Views',
                data: [65, 120, 180, 150, 220],
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const barData = {
        labels: ['Billable', 'Non-Billable'],
        datasets: [
            {
                label: 'Total Views',
                data: [1075, 1125],
                backgroundColor: ['#10B981', '#3B82F6'],
            },
        ],
    };

    const doughnutData = {
        labels: ['Product Sold', 'Overtime'],
        datasets: [
            {
                data: [871, 31],
                backgroundColor: ['#8B5CF6', '#10B981'],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="UMKM Dashboard" />

            {/* === DESKTOP NAVBAR (ATAS) === */}
            <div className="hidden bg-white border-b md:block">
                <div className="px-4 mx-auto max-w-7xl">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        item.current
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-2" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-gray-400 rounded-md hover:text-gray-500"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* === CONTENT === */}
            <div className="min-h-screen pb-20 bg-gray-50 md:pb-6">
                <div className="px-4 py-6 mx-auto space-y-6 max-w-7xl">
                    {/* Line Chart */}
                    <div className="p-4 bg-white shadow-sm rounded-xl">
                        <h3 className="mb-3 text-sm font-medium text-gray-600">Total Views</h3>
                        <div className="h-48">
                            <Line data={lineData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Total Views', value: '1,075', color: 'bg-purple-500' },
                            { label: 'Product Sold', value: '871', color: 'bg-green-500' },
                            { label: 'Overtime', value: '31', color: 'bg-blue-500' },
                        ].map((stat, i) => (
                            <div key={i} className="p-3 text-center bg-white shadow-sm rounded-xl">
                                <div className={`w-10 h-10 ${stat.color} rounded-full mx-auto mb-2`}></div>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Bar & Donut Charts */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="p-4 bg-white shadow-sm rounded-xl">
                            <h3 className="mb-3 text-sm font-medium text-gray-600">Billable vs Non-Billable</h3>
                            <div className="h-40">
                                <Bar data={barData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                            </div>
                        </div>
                        <div className="p-4 bg-white shadow-sm rounded-xl">
                            <h3 className="mb-3 text-sm font-medium text-gray-600">Product & Overtime</h3>
                            <div className="flex items-center justify-center h-48">
                                <div className="w-40 h-40">
                                    <Doughnut data={doughnutData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                                </div>
                                <div className="ml-6 space-y-2">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 mr-2 bg-purple-500 rounded-full"></div>
                                        <span className="text-sm">Product Sold: 871</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm">Overtime: 31</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === MOBILE BOTTOM NAVBAR === */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
                    <div className="grid grid-cols-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center py-3 text-xs font-medium ${
                                    item.current
                                        ? 'text-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <item.icon className="w-6 h-6 mb-1" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
