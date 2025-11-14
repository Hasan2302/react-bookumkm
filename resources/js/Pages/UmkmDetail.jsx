import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const dummyUmkmDetail = {
    id: 1,
    name: 'UMKM A',
    description: 'Deskripsi lengkap UMKM A',
    bookings: [
        { id: 1, title: 'Booking 1', start: '2025-11-15T10:00:00', end: '2025-11-15T11:00:00' },
        { id: 2, title: 'Booking 2', start: '2025-11-16T14:00:00', end: '2025-11-16T15:00:00' },
    ],
};

export default function UmkmDetail() {
    const [umkm, setUmkm] = useState(dummyUmkmDetail);

    useEffect(() => {
        fetch(`/api/umkm/${umkm.id}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to fetch UMKM detail');
            })
            .then((data) => setUmkm(data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-indigo-600 mb-4">{umkm.name}</h1>
                <p className="text-gray-700 mb-6">{umkm.description}</p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Kalender Booking</h2>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={umkm.bookings}
                    selectable={true}
                    dateClick={(info) => {
                        const time = prompt(`Pilih waktu untuk tanggal ${info.dateStr} (HH:MM):`);
                        if (time) {
                            alert(`Anda memilih tanggal ${info.dateStr} dan waktu ${time}`);
                            // Tambahkan logika untuk menyimpan booking di sini
                        }
                    }}
                />
            </div>
        </div>
    );
}
