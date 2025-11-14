import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Bell, Search, ArrowUpRight, ArrowDownRight,
    CreditCard, TrendingUp, Users, Wallet, MoreVertical
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SuperadminDashboard({ auth, umkms }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data grafik
    const chartData = [
        { name: 'Jan', income: 4200, expense: 2800 },
        { name: 'Feb', income: 3800, expense: 3200 },
        { name: 'Mar', income: 5100, expense: 2900 },
        { name: 'Apr', income: 4800, expense: 3100 },
        { name: 'May', income: 5500, expense: 3300 },
        { name: 'Jun', income: 5200, expense: 3500 },
    ];

    const totalBalance = 3200.00;
    const totalIncome = 42738.00;
    const totalExpense = 12738.00;

    const filteredUmkms = umkms.filter(umkm =>
        umkm.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Superadmin Dashboard" />

            {/* Mobile-First Full Dark Background */}
            <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 via-black to-gray-800">

                {/* Header */}
                <header className="px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Hi, {auth.user.name}</p>
                            <h1 className="text-2xl font-bold">Superadmin Dashboard</h1>
                        </div>
                        <button className="p-2 bg-gray-800 rounded-full">
                            <Bell className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Balance Card */}
                <div className="px-4 mb-6">
                    <div className="p-6 shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl">
                        <p className="text-sm opacity-90">My Balance</p>
                        <p className="mt-1 text-3xl font-bold">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>

                        {/* Mock VISA Card */}
                        <div className="flex items-center justify-between p-4 mt-6 text-black bg-white shadow-md rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-green-500"></div>
                                <div>
                                    <p className="text-xs font-medium">VISA •••• 2738</p>
                                    <p className="text-lg font-bold">$13,267.23</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Valid Thru</p>
                                <p className="text-sm font-medium">12/27</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="px-4 mb-6">
                    <div className="flex space-x-3">
                        <button className="flex items-center justify-center flex-1 py-3 space-x-2 bg-gray-800 rounded-xl">
                            <ArrowUpRight className="w-5 h-5 text-green-400" />
                            <span className="text-sm font-medium">Transfer</span>
                        </button>
                        <button className="flex items-center justify-center flex-1 py-3 space-x-2 bg-gray-800 rounded-xl">
                            <ArrowDownRight className="w-5 h-5 text-red-400" />
                            <span className="text-sm font-medium">Request</span>
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="px-4 mb-6">
                    <div className="p-5 bg-gray-800 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Statistics</h3>
                            <select className="px-3 py-1 text-sm bg-gray-700 rounded-lg">
                                <option>Month</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <span className="text-sm">${totalIncome.toLocaleString()} Income</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span className="text-sm">${totalExpense.toLocaleString()} Expenses</span>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                                        labelStyle={{ color: '#F3F4F6' }}
                                    />
                                    <Line type="monotone" dataKey="income" stroke="#FBBF24" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="expense" stroke="#10B981" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* UMKM List (as Transactions) */}
                <div className="px-4">
                    <div className="p-5 bg-gray-800 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Daftar UMKM</h3>
                            {umkms.length} total
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                            <input
                                type="text"
                                placeholder="Cari UMKM..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 text-sm bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>

                        {/* UMKM List */}
                        <div className="space-y-3">
                            {filteredUmkms.length > 0 ? (
                                filteredUmkms.map((umkm) => (
                                    <div key={umkm.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                                                {umkm.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{umkm.name}</p>
                                                <p className="text-xs text-gray-400">{umkm.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="px-3 py-1 text-xs font-medium text-white transition bg-green-600 rounded-lg hover:bg-green-700">
                                                Aktifkan
                                            </button>
                                            <button className="px-3 py-1 text-xs font-medium text-white transition bg-red-600 rounded-lg hover:bg-red-700">
                                                Suspend
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="py-4 text-center text-gray-400">Tidak ditemukan</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
                    <div className="flex justify-around py-3">
                        <button className="p-2">
                            <Wallet className="w-6 h-6 text-yellow-500" />
                        </button>
                        <button className="p-2">
                            <TrendingUp className="w-6 h-6 text-gray-400" />
                        </button>
                        <button className="p-2">
                            <Users className="w-6 h-6 text-gray-400" />
                        </button>
                        <button className="p-2">
                            <MoreVertical className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
