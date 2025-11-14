import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function UserBooking({ umkm, bookings }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);
        const time = prompt('Pilih waktu (HH:MM):');
        if (time) {
            setSelectedTime(time);
            alert(`Anda memilih tanggal ${info.dateStr} dan waktu ${time}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-indigo-600 mb-4">Booking untuk {umkm.name}</h1>
                <p className="text-gray-700 mb-6">{umkm.description}</p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Kalender Booking</h2>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={bookings}
                    dateClick={handleDateClick}
                />
            </div>
        </div>
    );
}
