// resources/js/Pages/Welcome.jsx → VERSI FINAL TERAKHIR (100% SESUAI PERMINTAANMU)
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Heart, Sparkles, X, Clock, Check, ChevronRight, CreditCard } from 'lucide-react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

const CATEGORIES = ['Semua', 'Tukang Cukur', 'Salon', 'Bengkel', 'Klinik Kecantikan', 'Laundry', 'Spa & Massage', 'Cuci Motor', 'Lainnya'];

export default function Welcome() {
  const [umkms, setUmkms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [selectedUmkm, setSelectedUmkm] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({});
  const [formFields, setFormFields] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('offline');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/umkms')
      .then(res => { setUmkms(res.data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return umkms.filter(u => {
      const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'Semua' || u.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [umkms, search, selectedCategory]);

  const openBookingModal = async (umkm) => {
    setSelectedUmkm(umkm);
    setShowModal(true);
    setStep(1);
    setSelectedDate(new Date());
    setSelectedTime('');
    setFormData({});
    setPaymentMethod('offline');

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/umkms/${umkm.id}/form-fields`);
      setFormFields(res.data.data.sort((a, b) => a.sort_order - b.sort_order));
    } catch (err) { console.error(err); }
  };

  const handleNext = () => {
    if (step === 1 && !selectedTime) return alert('Pilih jam dulu ya!');
    if (step === 3) return handleSubmit();
    setStep(step + 1);
  };

  const handleSubmit = () => {
    // Ambil data dari formFields (yang pasti ada label-nya)
    const customerDataRaw = {};
    formFields.forEach(field => {
        const value = formData[field.label] || '';
        customerDataRaw[field.label] = value;
    });

    // Ekstrak data penting secara akurat
    let customerName = 'Pelanggan';
    let customerPhone = '';
    let serviceName = 'Layanan UMKM';

    formFields.forEach(field => {
        const labelLower = field.label.toLowerCase();
        const value = formData[field.label] || '';

        if (labelLower.includes('nama')) {
            customerName = value || customerName;
        }
        if (labelLower.includes('wa') || labelLower.includes('hp') || labelLower.includes('telepon') || labelLower.includes('phone')) {
            customerPhone = value;
        }
        if (labelLower.includes('layanan') || labelLower.includes('service') || labelLower.includes('jenis')) {
            serviceName = value || serviceName;
        }
    });

    const payload = {
        umkm_id: selectedUmkm.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        payment_method: paymentMethod,
        customer_name: customerName,
        customer_phone: customerPhone,
        service_name: serviceName,
        total_price: 0, // nanti bisa dihitung otomatis
        customer_data: customerDataRaw // tetap simpan semua data asli
    };

    console.log('Payload dikirim:', payload); // DEBUG — bisa dihapus nanti

    axios.post('http://127.0.0.1:8000/api/bookings', payload)
        .then(res => {
            alert('Booking berhasil! Kami akan hubungi via WhatsApp');
            setShowModal(false);
        })
        .catch(err => {
            console.error(err.response?.data);
            alert('Gagal booking: ' + (err.response?.data?.message || 'Coba lagi'));
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-2xl font-bold text-emerald-600">Memuat UMKM...</div>
        </div>
  );

  return (
    <>
      {/* NAVBAR SUPER CLEAN — HANYA LOGO, DAFTAR UMKM, SEARCH, LOGIN */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between gap-8 px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center text-2xl font-black text-white w-11 h-11 bg-emerald-600 rounded-xl">B</div>
              <span className="text-2xl font-black text-gray-800">BookUMKM</span>
            </Link>

            <Link to="/register-umkm" className="hidden font-semibold text-gray-700 transition md:block hover:text-emerald-600">
              Daftar UMKM
            </Link>
          </div>

          {/* SEARCH BESAR DI TENGAH */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-5 top-1/2" />
              <input
                type="text"
                placeholder="Cari salon, barbershop, bengkel terdekat..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full py-4 pr-6 text-base transition bg-gray-100 rounded-full shadow-sm pl-14 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:bg-white"
              />
            </div>
          </div>

          <Link to="/login" className="px-8 py-3 font-bold text-white transition rounded-full shadow-md bg-emerald-600 hover:bg-emerald-700">
            Masuk
          </Link>
        </div>
      </header>

      {/* CONTENT LANGSUNG DI BAWAH NAVBAR */}
      <main className="min-h-screen pt-24 bg-gray-50">
        {/* Jumlah UMKM + Tombol AI */}
        <div className="px-6 py-8 mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 mb-8 md:flex-row md:items-center">
            <div>
              <h1 className="text-4xl font-black text-gray-800">
                {filtered.length.toLocaleString()} UMKM Tersedia
              </h1>
              <p className="mt-1 text-lg text-gray-600">Pilih layanan terbaik di sekitarmu</p>
            </div>
            <button className="flex items-center gap-3 px-8 py-4 font-bold text-white transition rounded-full shadow-lg bg-emerald-600 hover:shadow-xl">
              <Sparkles className="w-5 h-5" />
              Cari dengan AI
            </button>
          </div>

          {/* PILIHAN KATEGORI — HORIZONTAL SCROLL (seperti Dreamhome + Tokopedia) */}
          <div className="flex gap-3 pb-4 mb-10 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all shadow-sm ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GRID CARD — MIRIP DREAMHOME 100% */}
          <div className="grid grid-cols-1 gap-8 pb-24 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(umkm => (
              <div
                key={umkm.id}
                onClick={() => openBookingModal(umkm)}
                className="overflow-hidden transition-all duration-300 bg-white shadow-lg cursor-pointer rounded-3xl hover:shadow-2xl group"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={umkm.banner}
                    alt={umkm.name}
                    className="object-cover w-full h-full transition duration-500 group-hover:scale-110"
                  />
                  <button className="absolute p-3 rounded-full shadow-lg top-4 right-4 bg-white/90 backdrop-blur">
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  </button>
                  <div className="absolute px-5 py-2 text-sm font-bold text-white rounded-full shadow-lg bottom-4 left-4 bg-emerald-600">
                    Rp25rb - Rp200rb
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-xl font-black text-gray-800 line-clamp-1">{umkm.name}</h3>
                  <p className="mb-3 text-sm font-semibold text-emerald-600">{umkm.category}</p>
                  <p className="flex items-center gap-2 mb-5 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {umkm.address?.split(',')[0] || 'Lokasi'}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" /> 09:00 - 21:00
                    </span>
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">BUKA</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL BOOKING WIZARD TETAP LENGKAP */}
      {showModal && selectedUmkm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            
            {/* Progress */}
            <div className="flex justify-center gap-8 py-6">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${step >= i ? 'bg-green-600' : 'bg-gray-300'}`}>
                    {i}
                  </div>
                  {i < 3 && <div className={`w-32 h-1 ${step > i ? 'bg-green-600' : 'bg-gray-300'}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Tanggal & Jam */}
            {step === 1 && (
              <div className="p-8">
                <h3 className="mb-8 text-2xl font-bold text-center">Pilih Tanggal & Jam</h3>
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <Calendar
                      onChange={setSelectedDate}
                      value={selectedDate}
                      minDate={new Date()}
                      className="mx-auto border-2 rounded-2xl"
                    />
                  </div>
                  <div>
                    <h4 className="mb-4 text-lg font-bold">Jam Tersedia Hari Ini</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {["09:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00"].map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-4 rounded-xl font-medium transition ${
                            selectedTime === time 
                              ? 'bg-green-600 text-white shadow-lg' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Form */}
            {step === 2 && (
              <div className="p-8">
                <h3 className="mb-8 text-2xl font-bold text-center">Isi Data Diri</h3>
                <div className="grid max-w-2xl gap-6 mx-auto">
                  {formFields.map(field => (
                    <div key={field.id}>
                      <label className="block mb-2 text-lg font-semibold">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          required={field.required}
                          onChange={e => setFormData({...formData, [field.label]: e.target.value})}
                          className="w-full px-6 py-4 border-2 rounded-xl focus:border-green-500"
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
                          onChange={e => setFormData({...formData, [field.label]: e.target.value})}
                          className="w-full px-6 py-4 border-2 rounded-xl focus:border-green-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Pembayaran */}
            {step === 3 && (
              <div className="p-8">
                <h3 className="mb-8 text-2xl font-bold text-center">Pilih Metode Pembayaran</h3>
                <div className="max-w-2xl mx-auto space-y-4">
                  {['offline', 'qris', 'transfer'].map(method => (
                    <label key={method} className="flex items-center gap-6 p-6 transition cursor-pointer bg-gray-50 rounded-2xl hover:bg-gray-100">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="w-6 h-6 text-green-600"
                      />
                      <div className="flex-1">
                        <p className="text-lg font-bold">
                          {method === 'offline' ? 'Bayar di Tempat' : method === 'qris' ? 'QRIS' : 'Transfer Bank'}
                        </p>
                        <p className="text-gray-600">
                          {method === 'offline' ? 'Bayar langsung saat datang' : method === 'qris' ? 'Scan QRIS di tempat' : 'Transfer ke rekening resmi'}
                        </p>
                      </div>
                      {method === 'qris' && <CreditCard className="w-10 h-10 text-green-600" />}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between p-8 border-t">
              <button onClick={() => step===1?setShowModal(false):setStep(step-1)} className="px-10 py-4 font-bold text-gray-600">
                {step===1?'Batal':'Kembali'}
              </button>
              <button onClick={handleNext} className="flex items-center gap-3 px-16 py-4 font-bold text-white shadow-lg bg-emerald-600 rounded-xl">
                {step===3?'Selesai Booking':'Lanjut'} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}