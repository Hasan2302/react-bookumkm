import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { 
    X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, 
    Loader2, CheckCircle, FileText, CreditCard, Upload, QrCode, Building2, Wallet,
    Check, AlertCircle
} from 'lucide-react';
import axios from 'axios';

export default function BookingModal({ umkm, isOpen, onClose }) {
    const [step, setStep] = useState(1); // 1-6 steps
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [formFields, setFormFields] = useState([]);
    const [loadingFields, setLoadingFields] = useState(false);
    const [customerData, setCustomerData] = useState({});
    const [paymentMethod, setPaymentMethod] = useState(''); // qris, bank, ewallet
    const [paymentProof, setPaymentProof] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [bookingId, setBookingId] = useState(null);

    const availableTimes = [
        '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00',
        '17:00', '18:00', '19:00', '20:00'
    ];

    useEffect(() => {
        if (isOpen && umkm) {
            setLoadingFields(true);
            axios
                .get(`http://127.0.0.1:8000/api/umkms/${umkm.id}/form-fields`)
                .then((res) => {
                    const fields = res.data.data || [];
                    setFormFields(fields);
                })
                .catch((err) => {
                    console.error('Gagal fetch form fields:', err);
                    setFormFields([]);
                })
                .finally(() => setLoadingFields(false));
        }
    }, [isOpen, umkm]);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleNext = () => {
        // Step 1: Pilih Tanggal
        if (step === 1 && !selectedDate) {
            alert('Pilih tanggal terlebih dahulu!');
            return;
        }
        
        // Step 2: Pilih Jam
        if (step === 2 && !selectedTime) {
            alert('Pilih jam terlebih dahulu!');
            return;
        }
        
        // Step 3: Validasi Form Customer
        if (step === 3) {
            const requiredFields = formFields.filter(f => f.required);
            const emptyFields = requiredFields.filter(f => !customerData[f.label]);
            if (emptyFields.length > 0) {
                alert(`Mohon lengkapi: ${emptyFields.map(f => f.label).join(', ')}`);
                return;
            }
        }
        
        // Step 4: Pilih Metode Pembayaran
        if (step === 4 && !paymentMethod) {
            alert('Pilih metode pembayaran terlebih dahulu!');
            return;
        }
        
        // Step 5: Upload Bukti Pembayaran & Submit
        if (step === 5) {
            if (!paymentProof) {
                alert('Upload bukti pembayaran terlebih dahulu!');
                return;
            }
            handleSubmit();
            return;
        }
        
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => Math.max(1, prev - 1));
    };

    const handleInputChange = (label, value) => {
        setCustomerData(prev => ({
            ...prev,
            [label]: value
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setErrors({});

        try {
            const formData = new FormData();
            formData.append('umkm_id', umkm.id);
            formData.append('date', formatDate(selectedDate));
            formData.append('time', selectedTime);
            formData.append('customer_data', JSON.stringify(customerData));
            formData.append('payment_method', paymentMethod);
            
            if (paymentProof) {
                formData.append('payment_proof', paymentProof);
            }

            const response = await axios.post('http://127.0.0.1:8000/api/bookings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === 'success') {
                setBookingId(response.data.data?.id || null);
                setStep(6); // Go to success screen
            }
        } catch (err) {
            console.error('Booking error:', err);
            const errorMsg = err.response?.data?.message || 'Gagal melakukan booking. Silakan coba lagi.';
            alert('❌ ' + errorMsg);
            setErrors(err.response?.data?.errors || {});
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setSelectedDate(new Date());
        setSelectedTime('');
        setCustomerData({});
        setPaymentMethod('');
        setPaymentProof(null);
        setBookingId(null);
        setErrors({});
        onClose();
    };

    if (!isOpen || !umkm) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <div className="relative w-full max-w-4xl overflow-hidden shadow-glass-xl rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/20 animate-fade-in">
                <div className="absolute inset-0 bg-gradient-glass opacity-30" />
                {/* Header */}
                <div className="relative flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-50/80 to-blue-50/80 backdrop-blur-xl border-white/20">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Booking {umkm.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Isi form untuk membuat reservasi
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 transition-all duration-300 rounded-xl hover:bg-white/50 hover:rotate-90 backdrop-blur-sm"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="relative flex items-center justify-center gap-3 px-6 py-8 bg-gradient-to-r from-gray-50/50 to-blue-50/50 backdrop-blur-sm">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center">
                            <div
                                className={`relative flex items-center justify-center w-12 h-12 rounded-full font-bold text-white transition-all duration-300 ${
                                    step >= i
                                        ? 'bg-gradient-primary shadow-glass-lg scale-110 animate-glow'
                                        : 'bg-gray-300/50 backdrop-blur-sm'
                                }`}
                            >
                                {i === 1 && <CalendarIcon className="w-5 h-5" />}
                                {i === 2 && <Clock className="w-5 h-5" />}
                                {i === 3 && <User className="w-5 h-5" />}
                                
                                {step > i && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {i < 3 && (
                                <div
                                    className={`w-16 h-1 mx-2 transition ${
                                        step > i ? 'bg-primary-600' : 'bg-gray-300'
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8 min-h-96">
                    {/* Step 1: Pilih Tanggal */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                                    Pilih Tanggal
                                </h3>
                                <p className="text-gray-600">
                                    Kapan Anda ingin melakukan booking?
                                </p>
                            </div>
                            <div className="max-w-md mx-auto">
                                <label className="block mb-3 text-sm font-semibold text-gray-700">
                                    <CalendarIcon className="inline w-4 h-4 mr-2" />
                                    Tanggal Booking
                                </label>
                                <input
                                    type="date"
                                    value={formatDate(selectedDate)}
                                    onChange={(e) => {
                                        const newDate = new Date(e.target.value);
                                        console.log('Date selected:', newDate);
                                        setSelectedDate(newDate);
                                    }}
                                    min={formatDate(new Date())}
                                    className="w-full px-4 py-4 text-lg font-semibold transition-all duration-300 border-2 shadow-glass bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 focus:bg-white focus:shadow-glass-lg hover:bg-white hover:border-primary-300"
                                />
                                {selectedDate && (
                                    <div className="p-4 mt-4 border-2 border-dashed rounded-xl bg-primary-50/50 border-primary-300">
                                        <p className="text-sm font-semibold text-center text-primary-700">
                                            ✓ Tanggal dipilih: {new Date(selectedDate).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Pilih Jam */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                                    Pilih Jam
                                </h3>
                                <p className="text-gray-600">
                                    {new Date(selectedDate).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className="mt-2 text-sm font-semibold text-primary-600">
                                    {selectedTime ? `✓ Jam dipilih: ${selectedTime}` : 'Silakan pilih jam booking'}
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
                                {availableTimes.map((time) => (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => {
                                            console.log('Time clicked:', time);
                                            setSelectedTime(time);
                                        }}
                                        className={`py-4 px-4 rounded-xl font-semibold transition-all duration-300 text-center ${
                                            selectedTime === time
                                                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-glass-lg scale-105 ring-4 ring-primary-200'
                                                : 'bg-white/80 backdrop-blur-sm hover:bg-primary-50 text-gray-700 hover:text-primary-700 shadow-glass hover:shadow-glass-lg hover:scale-105 border-2 border-gray-200 hover:border-primary-300'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm">{time}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            {/* Helpful message */}
                            {!selectedTime && (
                                <div className="p-4 text-center border-2 border-dashed rounded-xl bg-blue-50/50 border-blue-300">
                                    <p className="text-sm text-blue-700">
                                        💡 <strong>Tip:</strong> Klik salah satu jam di atas untuk melanjutkan
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Form Data */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                                    Data Diri
                                </h3>
                                <p className="text-gray-600">
                                    Lengkapi informasi Anda untuk booking
                                </p>
                            </div>

                            {loadingFields ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    {formFields.map((field) => (
                                        <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <label className="block mb-2 font-medium text-gray-700">
                                                {field.label}
                                                {field.required && (
                                                    <span className="ml-1 text-red-500">*</span>
                                                )}
                                            </label>
                                            {field.type === 'select' ? (
                                                <select
                                                    required={field.required}
                                                    onChange={(e) =>
                                                        handleInputChange(field.label, e.target.value)
                                                    }
                                                    className="w-full px-4 py-3 transition border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                >
                                                    <option value="">Pilih {field.label}</option>
                                                    {(JSON.parse(field.options || '[]')).map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : field.type === 'textarea' ? (
                                                <textarea
                                                    required={field.required}
                                                    placeholder={`Masukkan ${field.label}`}
                                                    onChange={(e) =>
                                                        handleInputChange(field.label, e.target.value)
                                                    }
                                                    rows={4}
                                                    className="w-full px-4 py-3 transition border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                />
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    required={field.required}
                                                    placeholder={`Masukkan ${field.label}`}
                                                    onChange={(e) =>
                                                        handleInputChange(field.label, e.target.value)
                                                    }
                                                    className="w-full px-4 py-3 transition border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                />
                                            )}
                                            {errors[`customer_data.${field.label}`] && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors[`customer_data.${field.label}`]}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="relative flex justify-between p-6 border-t bg-gradient-to-r from-gray-50/50 to-blue-50/50 backdrop-blur-sm border-white/20">
                    <button
                        onClick={handleBack}
                        disabled={step === 1 || submitting}
                        className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                            step === 1
                                ? 'invisible'
                                : 'bg-white/70 hover:bg-white text-gray-700 shadow-glass hover:shadow-glass-lg'
                        }`}
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Kembali
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={submitting || (step === 1 && !selectedDate) || (step === 2 && !selectedTime)}
                        className="flex items-center px-8 py-3 font-bold text-white transition-all duration-300 shadow-glass bg-gradient-primary rounded-xl hover:scale-105 hover:shadow-glass-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                {step === 3 ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Kirim Booking
                                    </>
                                ) : (
                                    <>
                                        Lanjut
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
