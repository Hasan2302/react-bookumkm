import { Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import {
    MapPin, Star, Home, Calendar as CalendarIcon, Wifi, Car,
    Dumbbell, Droplets, Briefcase, Utensils, Search, X, Clock
} from 'lucide-react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import StepWizard from 'react-step-wizard';

const dummyUmkms = [
    {
        id: 1,
        name: 'Barbershop Fellas',
        subdomain: 'barbershop-fellas',
        location: 'Depok, Indonesia',
        description: 'Barbershop Fellas is a contemporary masterpiece...',
        rating: 4.8,
        totalArea: '350 m²',
        roomService: '24/7',
        pricePerNight: 1250.80,
        spots: 12,
        used: 23,
        amenities: [
            { icon: Dumbbell, label: 'Gym Access' },
            { icon: Wifi, label: 'Outdoor Pool' },
            { icon: Utensils, label: 'BBQ' },
            { icon: Home, label: 'River Access' },
            { icon: Car, label: 'Car Rental' },
            { icon: Droplets, label: 'Laundry' },
            { icon: Briefcase, label: 'Coworking' },
            { icon: Droplets, label: 'Outdoor Shower' },
        ],
        images: [
            'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFyYmVyc2hvcHxlbnwwfHwwfHx8MA%3D%3D',
            'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFyYmVyc2hvcHxlbnwwfHwwfHx8MA%3D%3D'
        ],
        // Booking data
        bookings: [
            { date: '2025-04-05', time: '10:00' },
            { date: '2025-04-05', time: '14:00' },
            { date: '2025-04-06', time: '09:00' },
        ],
        availableHours: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
    },
    {
        id: 2,
        name: 'Laundry Fast',
        subdomain: 'laundry-fast',
        location: 'Jakarta, Indonesia',
        description: 'Laundry Fast menyediakan layanan terbaik untuk Anda.',
        rating: 4.5,
        totalArea: '200 m²',
        roomService: '08:00 - 22:00',
        pricePerNight: 850.00,
        spots: 8,
        used: 15,
        amenities: [
            { icon: Wifi, label: 'WiFi' },
            { icon: Car, label: 'Parkir' },
            { icon: Briefcase, label: 'Ruang Meeting' },
        ],
        images: [
            'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGF1bmRyeXxlbnwwfHwwfHx8MA%3D%3D',
            'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TGF1bmRyeXxlbnwwfHwwfHx8MA%3D%3D'
        ],
        bookings: [
            { date: '2025-04-05', time: '10:00' },
            { date: '2025-04-05', time: '12:00' },
        ],
        availableHours: Array.from({ length: 15 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`),
    },
];

export default function Welcome() {
    const [umkms, setUmkms] = useState([]);
    const [selectedUmkm, setSelectedUmkm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        setUmkms(dummyUmkms);
        setSelectedUmkm(dummyUmkms[0]);
        setLoading(false);

        fetch('/api/umkms')
            .then((res) => {
                if (!res.ok) throw new Error('Gagal mengambil data');
                return res.json();
            })
            .then((data) => {
                if (data && data.length > 0) {
                    setUmkms(data);
                    setSelectedUmkm(data[0]);
                }
            })
            .catch((err) => {
                console.error('Fetch error:', err);
                setError(err.message);
            });
    }, []);

    const filteredUmkms = useMemo(() => {
        if (!searchTerm) return umkms;
        return umkms.filter((umkm) =>
            umkm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            umkm.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [umkms, searchTerm]);

    useEffect(() => {
        if (filteredUmkms.length > 0 && !filteredUmkms.find(u => u.id === selectedUmkm?.id)) {
            setSelectedUmkm(filteredUmkms[0]);
        }
    }, [filteredUmkms, selectedUmkm]);

    // Format date to YYYY-MM-DD
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Cek apakah slot sudah dibooking
    const isTimeBooked = (date, time) => {
        if (!selectedUmkm?.bookings) return false;
        const dateStr = formatDate(date);
        return selectedUmkm.bookings.some(b => b.date === dateStr && b.time === time);
    };

    // Dapatkan jam yang tersedia
    const getAvailableTimes = () => {
        if (!selectedUmkm) return [];
        const dateStr = formatDate(selectedDate);
        return selectedUmkm.availableHours.filter(time => !isTimeBooked(selectedDate, time));
    };

    const handleBooking = () => {
        if (!selectedTime) {
            alert('Pilih jam terlebih dahulu!');
            return;
        }
        alert(`Booking berhasil!\nUMKM: ${selectedUmkm.name}\nTanggal: ${formatDate(selectedDate)}\nJam: ${selectedTime}`);
        setShowModal(false);
        setSelectedTime('');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-lg font-medium text-indigo-600">Memuat UMKM...</div>
            </div>
        );
    }

    if (error && umkms.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-50">
                <div className="p-6 text-red-700 bg-white rounded-lg shadow">
                    <p className="font-semibold">Error: {error}</p>
                    <p className="text-sm">Menggunakan data dummy.</p>
                </div>
            </div>
        );
    }

    if (!selectedUmkm) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Tidak ada UMKM tersedia.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-indigo-600">BookUMKM</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="font-medium text-gray-700 hover:text-indigo-600">
                                Login
                            </Link>
                            <Link href="/register" className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                                Daftar UMKM
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="px-4 py-8 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Daftar UMKM + Search */}
                    <div className="lg:col-span-1">
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">Pilih UMKM</h2>

                        <div className="relative mb-4">
                            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                            <input
                                type="text"
                                placeholder="Cari nama atau lokasi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-3">
                            {filteredUmkms.length > 0 ? (
                                filteredUmkms.map((umkm) => (
                                    <div
                                        key={umkm.id}
                                        onClick={() => setSelectedUmkm(umkm)}
                                        className={`p-4 bg-white rounded-xl shadow-sm cursor-pointer transition-all ${
                                            selectedUmkm.id === umkm.id
                                                ? 'ring-2 ring-indigo-600 shadow-lg'
                                                : 'hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-16 h-16 font-bold text-white bg-gradient-to-br from-indigo-200 to-indigo-400 rounded-xl">
                                                {umkm.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{umkm.name}</h3>
                                                <p className="text-sm text-gray-500">{umkm.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-500 bg-white rounded-xl">
                                    <p>Tidak ditemukan UMKM untuk "<strong>{searchTerm}</strong>"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detail UMKM */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
                            {/* Gambar - 2 Foto dengan Hover Zoom */}
                            <div className="grid h-64 grid-cols-1 gap-1 overflow-hidden md:grid-cols-2 rounded-t-2xl">
                                {/* Gambar Utama (Kiri) */}
                                <div className="relative overflow-hidden group">
                                    <img
                                        src={selectedUmkm.images[0]}
                                        alt={`${selectedUmkm.name} - 1`}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-none"
                                    />
                                    <div className="absolute inset-0 transition-opacity bg-black opacity-0 group-hover:opacity-20"></div>
                                </div>

                                {/* Gambar Kedua (Kanan) - Hanya di desktop */}
                                <div className="relative hidden overflow-hidden group md:block">
                                    <img
                                        src={selectedUmkm.images[1]}
                                        alt={`${selectedUmkm.name} - 2`}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 rounded-tr-2xl"
                                    />
                                    <div className="absolute inset-0 transition-opacity bg-black opacity-0 group-hover:opacity-20"></div>
                                </div>

                                {/* Gambar Kedua di Mobile (muncul di bawah) */}
                                {selectedUmkm.images[1] && (
                                    <div className="relative overflow-hidden group md:hidden">
                                        <img
                                            src={selectedUmkm.images[1]}
                                            alt={`${selectedUmkm.name} - 2`}
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 rounded-b-2xl"
                                        />
                                        <div className="absolute inset-0 transition-opacity bg-black opacity-0 group-hover:opacity-20"></div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{selectedUmkm.name}</h1>
                                        <p className="flex items-center mt-1 text-gray-600">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {selectedUmkm.location}
                                        </p>
                                    </div>
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>

                                <p className="mb-4 text-gray-600">{selectedUmkm.description}</p>

                                <div className="flex flex-wrap gap-6 mb-6 text-sm">
                                    <div className="flex items-center">
                                        <Star className="w-5 h-5 mr-1 text-yellow-500" />
                                        <span className="font-medium">{selectedUmkm.rating}</span>
                                        <span className="ml-1 text-gray-500">Rating</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">{selectedUmkm.totalArea}</span>
                                        <span className="ml-1 text-gray-500">Luas</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">{selectedUmkm.roomService}</span>
                                        <span className="ml-1 text-gray-500">Layanan</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
                                    {selectedUmkm.amenities.map((amenity, i) => {
                                        const Icon = amenity.icon;
                                        return (
                                            <div key={i} className="flex items-center text-sm text-gray-600">
                                                <Icon className="w-4 h-4 mr-2 text-indigo-600" />
                                                <span>{amenity.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-3xl font-bold text-gray-900">
                                            ${selectedUmkm.pricePerNight.toFixed(2)}
                                        </span>
                                        <span className="text-gray-600"> /malam</span>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="flex items-center px-6 py-3 mx-2 font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 float-end"
                                        >
                                            <MapPin className="w-5 h-5 mr-2" />
                                            Map
                                        </button>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="flex items-center px-6 py-3 font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
                                        >
                                            <CalendarIcon className="w-5 h-5 mr-2" />
                                            Cek Ketersediaan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* MODAL KALENDER */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-50">
                    <div className="w-full max-w-4xl max-h-screen overflow-y-auto bg-white shadow-2xl rounded-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b md:p-6">
                            <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                                Booking {selectedUmkm.name}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedTime('');
                                }}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X className="w-5 h-5 text-gray-500 md:w-6 md:h-6" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 md:p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Kalender */}
                                <div>
                                    <h3 className="mb-3 text-lg font-semibold">Pilih Tanggal</h3>
                                    <div className="p-3 bg-gray-50 rounded-xl md:p-4">
                                        <Calendar
                                            onChange={setSelectedDate}
                                            value={selectedDate}
                                            minDate={new Date()}
                                            className="w-full text-sm react-calendar md:text-base"
                                        />
                                    </div>
                                </div>

                                {/* Jam Tersedia */}
                                <div>
                                    <h3 className="mb-3 text-lg font-semibold">
                                        Pilih Jam <span className="text-sm font-normal text-gray-600">({formatDate(selectedDate)})</span>
                                    </h3>
                                    <div className="p-3 overflow-y-auto max-h-64 bg-gray-50 rounded-xl md:p-4 md:max-h-96">
                                        {getAvailableTimes().length > 0 ? (
                                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                                {getAvailableTimes().map((time) => (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all md:px-3 md:py-2 md:text-sm ${
                                                            selectedTime === time
                                                                ? 'bg-indigo-600 text-white'
                                                                : 'bg-white hover:bg-indigo-50 text-gray-700 border'
                                                        }`}
                                                    >
                                                        <Clock className="inline w-3 h-3 mr-1 md:w-4 md:h-4" />
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center text-gray-500">Tidak ada jam tersedia</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer: Info + Tombol */}
                            <div className="flex flex-col gap-3 mt-6 md:flex-row md:items-center md:justify-between">
                                <div className="text-sm text-gray-600">
                                    {selectedTime ? (
                                        <span>
                                            Dipilih: <strong>{formatDate(selectedDate)} {selectedTime}</strong>
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">Pilih jam untuk melanjutkan</span>
                                    )}
                                </div>
                                <button
                                    onClick={handleBooking}
                                    disabled={!selectedTime}
                                    className={`w-full md:w-auto px-6 py-3 font-medium text-white rounded-xl transition-all text-sm md:text-base ${
                                        selectedTime
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                                >
                                    Booking Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="py-8 text-white bg-gray-800">
                <div className="px-4 mx-auto text-center max-w-7xl">
                    <p>© 2025 BookUMKM. Dibuat untuk UMKM Indonesia.</p>
                </div>
            </footer>
        </div>
    );
}
