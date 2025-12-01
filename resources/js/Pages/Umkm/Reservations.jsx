import { useState, useEffect } from 'react';
import {
    CheckCircle2,
    XCircle,
    MessageCircle,
    Pencil,
    Search,
    Filter,
    MoreVertical
} from 'lucide-react';
import api from '@/Services/Api';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import MetronicLayout from '@/Layouts/MetronicLayout';
import Dropdown from '@/Components/Dropdown';

dayjs.locale('id');

export default function Reservations() {
    const [bookings, setBookings] = useState({ diterima: [], pending: [], cancelled: [] });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, confirmed, pending, cancelled

    const loadData = async () => {
        try {
            const bookingsRes = await api.get('/bookings/recent');
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

    useEffect(() => {
        loadData();
    }, []);

    const handleConfirm = async (bookingId) => {
        if (confirm('Apakah Anda yakin ingin menerima booking ini?')) {
            try {
                await api.post(`/bookings/${bookingId}/confirm`);
                loadData();
            } catch (error) {
                alert('Gagal mengonfirmasi booking');
            }
        }
    };

    const handleReject = async (bookingId) => {
        if (confirm('Apakah Anda yakin ingin menolak booking ini?')) {
            try {
                await api.post(`/bookings/${bookingId}/reject`);
                loadData();
            } catch (error) {
                alert('Gagal menolak booking');
            }
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

    // Combine and Filter Bookings
    const allRecentBookings = [
        ...bookings.pending.map(b => ({ ...b, status: 'pending' })),
        ...bookings.diterima.map(b => ({ ...b, status: 'confirmed' })),
        ...bookings.cancelled.map(b => ({ ...b, status: 'cancelled' }))
    ]
    .filter(booking => {
        // Filter by Status
        if (filterStatus !== 'all' && booking.status !== filterStatus) return false;

        // Filter by Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                booking.customer_name.toLowerCase().includes(query) ||
                booking.service_name.toLowerCase().includes(query) ||
                booking.id.toString().includes(query)
            );
        }
        return true;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (loading) {
        return (
            <MetronicLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </MetronicLayout>
        );
    }

    return (
        <MetronicLayout title="Reservations" breadcrumbs={['Reservations']}>
            <div className="space-y-8">
                {/* Bookings Table (Table Widget) */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-gray-100 gap-4">
                        <h3 className="text-lg font-bold text-gray-900">All Reservations</h3>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search booking..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-3 pr-8 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto pb-32">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Customer</th>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Service</th>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Date & Time</th>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-right text-gray-400 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allRecentBookings.length > 0 ? (
                                    allRecentBookings.map((booking) => (
                                        <tr key={booking.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-10 h-10 font-bold text-primary bg-primary/10 rounded-lg">
                                                        {booking.customer_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-800 hover:text-primary cursor-pointer transition-colors">{booking.customer_name}</div>
                                                        <div className="text-xs text-gray-400">Customer</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-600 whitespace-nowrap">{booking.service_name}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-600 whitespace-nowrap">{booking.waktu}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">
                                                Rp {Number(booking.total_price).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold ${
                                                    booking.status === 'confirmed' ? 'bg-success/10 text-success' :
                                                    booking.status === 'pending' ? 'bg-warning/10 text-warning' :
                                                    'bg-danger/10 text-danger'
                                                }`}>
                                                    {booking.status === 'confirmed' ? 'Confirmed' :
                                                     booking.status === 'pending' ? 'Pending' : 'Cancelled'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </Dropdown.Trigger>
                                                    <Dropdown.Content width="48" align="right">
                                                        <Dropdown.Link onClick={() => alert(`Detail Booking #${booking.id}\nPelanggan: ${booking.customer_name}\nLayanan: ${booking.service_name}`)}>
                                                            Lihat Detail
                                                        </Dropdown.Link>
                                                        
                                                        {booking.status === 'confirmed' && (
                                                            <Dropdown.Link onClick={() => openWhatsApp(booking)}>
                                                                Hubungi via WhatsApp
                                                            </Dropdown.Link>
                                                        )}

                                                        {booking.payment_proof && (
                                                            <Dropdown.Link onClick={() => window.open(`/storage/${booking.payment_proof}`, '_blank')}>
                                                                Lihat Bukti Pembayaran
                                                            </Dropdown.Link>
                                                        )}

                                                        {booking.status === 'pending' && (
                                                            <>
                                                                <Dropdown.Link onClick={() => handleConfirm(booking.id)}>
                                                                    Terima Booking
                                                                </Dropdown.Link>
                                                                <Dropdown.Link onClick={() => handleReject(booking.id)} className="text-red-600 hover:bg-red-50">
                                                                    Tolak Booking
                                                                </Dropdown.Link>
                                                            </>
                                                        )}

                                                        <Dropdown.Link onClick={() => alert('Fitur edit booking akan segera hadir')}>
                                                            Edit Booking
                                                        </Dropdown.Link>
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500">
                                            Tidak ada data booking yang sesuai.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MetronicLayout>
    );
}
