import MetronicLayout from '@/Layouts/MetronicLayout';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

export default function Services() {
    const services = [
        { id: 1, name: 'Cukur Rambut', price: 50000, duration: '30 min', category: 'Haircut' },
        { id: 2, name: 'Cukur Jenggot', price: 25000, duration: '15 min', category: 'Shaving' },
        { id: 3, name: 'Hair Spa', price: 100000, duration: '60 min', category: 'Treatment' },
    ];

    return (
        <MetronicLayout title="Services" breadcrumbs={['Services']}>
            <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Service List</h3>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-active transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Service
                    </button>
                </div>
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search services..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Service Name</th>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Category</th>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Duration</th>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Price</th>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-right text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {services.map((service) => (
                                <tr key={service.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{service.name}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{service.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500">{service.duration}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-800">Rp {service.price.toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
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
