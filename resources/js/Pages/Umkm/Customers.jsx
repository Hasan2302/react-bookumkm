import MetronicLayout from '@/Layouts/MetronicLayout';
import { Search, Mail, Phone, Calendar } from 'lucide-react';

export default function Customers() {
    const customers = [
        { id: 1, name: 'Budi Santoso', email: 'budi@example.com', phone: '081234567890', lastVisit: '2023-11-28', totalVisits: 5 },
        { id: 2, name: 'Siti Aminah', email: 'siti@example.com', phone: '081298765432', lastVisit: '2023-11-25', totalVisits: 3 },
        { id: 3, name: 'Ahmad Rizky', email: 'ahmad@example.com', phone: '081345678901', lastVisit: '2023-11-20', totalVisits: 8 },
    ];

    return (
        <MetronicLayout title="Customers" breadcrumbs={['Customers']}>
            <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Customer List</h3>
                    <div className="relative max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search customers..." 
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Customer Name</th>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Contact Info</th>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Last Visit</th>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-center text-gray-400 uppercase">Total Visits</th>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-right text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-800">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Mail className="w-3 h-3" /> {customer.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Phone className="w-3 h-3" /> {customer.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {customer.lastVisit}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-center text-gray-800">
                                        <span className="px-2 py-1 bg-gray-100 rounded-full">{customer.totalVisits}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-medium text-primary hover:underline">View History</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MetronicLayout>
    );
}
