import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function UmkmDashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">UMKM Dashboard</h2>}
        >
            <Head title="UMKM Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">Statistik</h3>
                            <div>
                                <p>Booking Harian: {stats.dailyBookings}</p>
                                <p>Pendapatan: {stats.revenue}</p>
                            </div>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Buat Form Booking</button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
