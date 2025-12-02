import MetronicLayout from '@/Layouts/MetronicLayout';
import { DollarSign, TrendingUp, Download } from 'lucide-react';

export default function Finance() {
    return (
        <MetronicLayout title="Finance" breadcrumbs={['Finance']}>
            <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-success/10 rounded-lg text-success">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded">+12.5%</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Rp 12.500.000</h3>
                        <p className="text-sm text-gray-400">Total Revenue (This Month)</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">+5.2%</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Rp 450.000</h3>
                        <p className="text-sm text-gray-400">Average Daily Revenue</p>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
                        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            <Download className="w-4 h-4" />
                            Export Report
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Description</th>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Payment Method</th>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-right text-gray-400 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-center text-gray-400 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">Nov {30 - i}, 2023</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-800">Haircut Service - Budi</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">Cash</td>
                                        <td className="px-6 py-4 text-sm font-bold text-right text-gray-800">Rp 50.000</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2 py-1 text-xs font-bold text-success bg-success/10 rounded">Paid</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MetronicLayout>
    );
}
