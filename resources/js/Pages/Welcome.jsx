import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
  MapPin, Star, Clock, Calendar as CalendarIcon, Search, X, ChevronLeft, ChevronRight, User, Mail, Phone, Scissors
} from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

export default function Welcome() {
  const [umkms, setUmkms] = useState([]);
  const [selectedUmkm, setSelectedUmkm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Wizard State
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({});
  const [formFields, setFormFields] = useState([]);

  const availableTimes = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/umkms')
      .then(res => {
        const list = res.data.data || [];
        setUmkms(list);
        if (list.length > 0) setSelectedUmkm(list[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Fetch form_fields saat UMKM dipilih & modal dibuka
  useEffect(() => {
    if (showModal && selectedUmkm) {
      axios.get(`http://127.0.0.1:8000/api/umkms/${selectedUmkm.id}/form-fields`)
        .then(res => {
          const fields = res.data.data || [];
          setFormFields(fields.sort((a, b) => a.sort_order - b.sort_order));
        })
        .catch(err => console.error("Gagal ambil form fields:", err));
    }
  }, [showModal, selectedUmkm]);

  const filteredUmkms = useMemo(() => {
    if (!searchTerm) return umkms;
    return umkms.filter(u =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [umkms, searchTerm]);

  const parseJson = (str) => {
    if (!str) return [];
    try { return JSON.parse(str); } catch { return []; }
  };

  const openingHours = selectedUmkm ? parseJson(selectedUmkm.opening_hours) : {};
  const services = selectedUmkm ? parseJson(selectedUmkm.services) : [];

  const formatDate = (d) => d.toISOString().split('T')[0];

  const handleNext = () => {
    if (step === 1 && !selectedDate) return alert("Pilih tanggal dulu!");
    if (step === 2 && !selectedTime) return alert("Pilih jam dulu!");
    if (step === 3) return handleSubmit();
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => Math.max(1, prev - 1));

  const handleSubmit = () => {
    const data = {
      umkm_id: selectedUmkm.id,
      date: formatDate(selectedDate),
      time: selectedTime,
      customer_data: formData
    };

    // Ganti endpoint ini sesuai kebutuhan
    axios.post('http://127.0.0.1:8000/api/bookings', data)
      .then(() => {
        alert("Booking berhasil! Kami akan hubungi via WhatsApp.");
        setShowModal(false);
        resetWizard();
      })
      .catch(err => {
        console.error(err);
        alert("Gagal booking: " + (err.response?.data?.message || err.message));
      });
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedDate(new Date());
    setSelectedTime('');
    setFormData({});
  };

  const handleInputChange = (label, value) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-xl text-teal-600">Loading UMKM...</div>;

  return (
    <>
      {/* HERO SECTION */}
      {selectedUmkm && (
        <div className="relative h-screen bg-black">
          <img
            src={`http://127.0.0.1:8000/storage/${selectedUmkm.banner}`}
            alt={selectedUmkm.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
          <div className="absolute left-6 top-6 md:left-12 md:top-12">
            <div className="w-24 h-24 overflow-hidden border-4 border-white shadow-2xl md:w-32 md:h-32 rounded-3xl bg-white/90">
              <img src={`http://127.0.0.1:8000/storage/${selectedUmkm.logo}`} alt="logo" className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 p-8 text-white md:p-12">
            <h1 className="mb-3 text-4xl font-extrabold md:text-6xl drop-shadow-lg">{selectedUmkm.name}</h1>
            <p className="flex items-center mb-4 text-lg"><MapPin className="w-6 h-6 mr-2" /> {selectedUmkm.address}</p>
            <button
              onClick={() => { setShowModal(true); resetWizard(); }}
              className="px-10 py-5 text-xl font-bold text-white transition rounded-full shadow-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:scale-105"
            >
              Booking Sekarang
            </button>
          </div>
        </div>
      )}

      {/* LIST UMKM */}
      <div className="px-4 py-16 bg-gray-50 md:px-8 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="relative mb-10">
            <Search className="absolute w-6 h-6 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
            <input
              type="text"
              placeholder="Cari UMKM atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 pl-12 pr-6 text-lg border-0 shadow-lg rounded-2xl focus:ring-4 focus:ring-teal-300"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUmkms.map((umkm) => (
              <div
                key={umkm.id}
                onClick={() => setSelectedUmkm(umkm)}
                className={`group cursor-pointer transition-all ${selectedUmkm?.id === umkm.id ? 'ring-4 ring-teal-500 scale-105' : 'hover:scale-105'} bg-white rounded-3xl overflow-hidden shadow-lg`}
              >
                <div className="relative h-48">
                  <img src={`http://127.0.0.1:8000/storage/${umkm.banner}`} alt={umkm.name} className="object-cover w-full h-full transition group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60" />
                  <div className="absolute bottom-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{umkm.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-bold">4.9</span>
                    </div>
                    <Scissors className="w-5 h-5 text-teal-600" />
                  </div>
                  <button className="w-full py-3 font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl">
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL WIZARD BOOKING */}
      {showModal && selectedUmkm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Booking {selectedUmkm.name}</h2>
              <button onClick={() => { setShowModal(false); resetWizard(); }}>
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-center gap-4 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${step >= i ? 'bg-teal-600' : 'bg-gray-300'}`}>
                    {i}
                  </div>
                  {i < 3 && <div className={`w-24 h-1 ${step > i ? 'bg-teal-600' : 'bg-gray-300'}`} />}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="p-6 min-h-96">
              {step === 1 && (
                <div className="text-center">
                  <h3 className="mb-6 text-xl font-bold">Pilih Tanggal</h3>
                  <CalendarIcon
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDate={new Date()}
                    className="mx-auto rounded-xl"
                  />
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="mb-6 text-xl font-bold text-center">
                    Pilih Jam ({formatDate(selectedDate)})
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    {availableTimes.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-4 rounded-xl font-medium transition ${selectedTime === time ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="mb-6 text-xl font-bold">Isi Data Diri</h3>
                  <div className="space-y-5">
                    {formFields.map(field => (
                      <div key={field.id}>
                        <label className="block mb-2 font-medium">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            required={field.required}
                            onChange={(e) => handleInputChange(field.label, e.target.value)}
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="">Pilih {field.label}</option>
                            {JSON.parse(field.options || '[]').map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            required={field.required}
                            placeholder={field.label}
                            onChange={(e) => handleInputChange(field.label, e.target.value)}
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between p-6 border-t">
              <button
                onClick={handleBack}
                className={`px-8 py-3 rounded-xl font-medium ${step === 1 ? 'invisible' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                <ChevronLeft className="inline w-5 h-5" /> Kembali
              </button>
              <button
                onClick={handleNext}
                className="px-10 py-3 font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl hover:shadow-lg"
              >
                {step === 3 ? 'Kirim Booking' : 'Lanjut'} <ChevronRight className="inline w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}