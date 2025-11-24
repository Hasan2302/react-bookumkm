import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    MapPin, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, FileText,
    CreditCard, CheckCircle, QrCode, Building2, Wallet, Upload, Loader2, AlertCircle, User
} from 'lucide-react';
import axios from 'axios';

export default function BookingModal({ umkm, isOpen, onClose }) {
    // State Management
    const [step, setStep] = useState(1); // 1-6 steps
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [formFields, setFormFields] = useState([]);
    const [loadingFields, setLoadingFields] = useState(false);
    const [customerData, setCustomerData] = useState({});
    const [paymentMethod, setPaymentMethod] = useState(''); // qris, bank, ewallet
    const [paymentProof, setPaymentProof] = useState(null);
    const [paymentProofPreview, setPaymentProofPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [bookingId, setBookingId] = useState(null);

    const availableTimes = [
        '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00',
        '17:00', '18:00', '19:00', '20:00'
    ];

    // Payment Methods
    const paymentMethods = [
        {
            id: 'offline' ?? 'bayar di tempat',
            name: 'Bayar di Tempat',
            icon: MapPin,
            description: 'Bayar langsung saat datang',
            details: 'Tidak perlu upload bukti'
        },
        {
            id: 'qris',
            name: 'QRIS',
            icon: QrCode,
            description: 'Scan QR Code dengan aplikasi e-wallet Anda',
            details: 'Pembayaran akan langsung terverifikasi'
        },
        {
            id: 'transfer',
            name: 'Transfer Bank',
            icon: Building2,
            description: 'Transfer ke rekening UMKM',
            details: 'Konfirmasi dalam 1x24 jam'
        },
        {
            id: 'ewallet',
            name: 'E-Wallet (GoPay/OVO/Dana)',
            icon: Wallet,
            description: 'GoPay, OVO, Dana, ShopeePay',
            details: 'Transfer langsung ke nomor'
        }
    ];

    // Fetch form fields from UMKM
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

    // Helper Functions
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPaymentProof(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentProofPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (label, value) => {
        setCustomerData(prev => ({
            ...prev,
            [label]: value
        }));
    };

    // Navigation
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

    const handleSubmit = async () => {
        setSubmitting(true);

        try {
            const formData = new FormData();

            formData.append('umkm_id', umkm.id);
            formData.append('date', formatDate(selectedDate));
            formData.append('time', selectedTime);
            formData.append('payment_method', paymentMethod);

            const nama = customerData['Nama Lengkap'] || customerData['Nama'] || 'Pengunjung';
            const phone = customerData['No. WhatsApp'] || customerData['WhatsApp'] || customerData['Nomor HP'] || '';

            formData.append('customer_name', nama);
            formData.append('customer_phone', phone);

            // KIRIM SEBAGAI OBJECT, BUKAN JSON.STRINGIFY!
            Object.keys(customerData).forEach(key => {
                const value = customerData[key];
                if (Array.isArray(value)) {
                    formData.append(`customer_data[${key}]`, JSON.stringify(value));
                } else {
                    formData.append(`customer_data[${key}]`, value);
                }
            });

            if (paymentMethod !== 'offline' && paymentProof) {
                formData.append('payment_proof', paymentProof);
            }

            const response = await axios.post('/api/bookings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setBookingId(response.data.data.id);
            setStep(6);

        } catch (err) {
            console.error('Booking error:', err.response?.data);
            let msg = err.response?.data?.message || 'Gagal booking';
            if (err.response?.data?.errors) {
                msg += '\n\n' + Object.values(err.response.data.errors).flat().join('\n');
            }
            alert(msg);
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
        setPaymentProofPreview(null);
        setBookingId(null);
        setErrors({});
        onClose();
    };

    if (!isOpen || !umkm) return null;

    // Step indicators
    const steps = [
        { number: 1, icon: CalendarIcon, label: 'Tanggal' },
        { number: 2, icon: Clock, label: 'Jam' },
        { number: 3, icon: FileText, label: 'Data' },
        { number: 4, icon: CreditCard, label: 'Bayar' },
        { number: 5, icon: Upload, label: 'Bukti' },
        { number: 6, icon: CheckCircle, label: 'Selesai' }
    ];

    const parseOptions = (options) => {
        if (!options) return [];
        if (Array.isArray(options)) return options;
        if (typeof options === 'string') {
            try {
                return JSON.parse(options);
            } catch (e) {
                console.error('Gagal parse options:', options);
                return [];
            }
        }
        return [];
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md sm:p-4">
            <div className="relative w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-hidden sm:rounded-3xl shadow-2xl bg-white animate-fade-in">

                {/* Header - Mobile Optimized */}
                <div className="relative flex items-center justify-between p-4 border-b sm:p-6 bg-gradient-to-r from-primary-600 to-primary-700">
                    <div className="flex-1 mr-2">
                        <h2 className="text-lg font-bold leading-tight text-white sm:text-2xl">
                            Booking {umkm.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                            {step < 6 ? 'Lengkapi data booking Anda' : 'Booking Berhasil!'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 transition-all duration-300 rounded-xl hover:bg-white/20 shrink-0"
                    >
                        <X className="w-5 h-5 text-white sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Progress Bar - Mobile Optimized */}
                {step < 6 && (
                    <div className="relative px-3 py-4 overflow-x-auto sm:px-6 sm:py-6 bg-gray-50">
                        <div className="flex items-center justify-between min-w-max sm:min-w-0">
                            {steps.slice(0, 5).map((s, index) => (
                                <div key={s.number} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1 min-w-[60px] sm:min-w-0">
                                        <div
                                            className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full font-bold transition-all duration-300 ${
                                                step >= s.number
                                                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-110'
                                                    : 'bg-gray-200 text-gray-500'
                                            }`}
                                        >
                                            <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <span className={`mt-1.5 text-[10px] sm:text-xs font-medium text-center leading-tight ${step >= s.number ? 'text-primary-600' : 'text-gray-400'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {index < 4 && (
                                        <div className={`h-0.5 sm:h-1 flex-1 mx-1 sm:mx-2 transition ${step > s.number ? 'bg-primary-600' : 'bg-gray-200'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content - Scrollable, Mobile Optimized */}
                <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-220px)] sm:max-h-[calc(90vh-240px)]">

                    {/* Step 1: Pilih Tanggal */}
                    {step === 1 && (
                        <div className="space-y-4 sm:space-y-6">
                            <div className="text-center">
                                <CalendarIcon className="w-12 h-12 mx-auto mb-3 sm:w-16 sm:h-16 sm:mb-4 text-primary-600" />
                                <h3 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
                                    Pilih Tanggal
                                </h3>
                                <p className="text-sm text-gray-600 sm:text-base">
                                    Kapan Anda ingin melakukan booking?
                                </p>
                            </div>
                            <div className="max-w-md mx-auto">
                                <input
                                    type="date"
                                    value={formatDate(selectedDate)}
                                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                    min={formatDate(new Date())}
                                    className="w-full px-3 py-3 text-base font-semibold transition-all duration-300 border-2 border-gray-200 sm:px-4 sm:py-4 sm:text-lg rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500"
                                />
                                {selectedDate && (
                                    <div className="p-3 mt-3 border-2 border-dashed sm:p-4 sm:mt-4 rounded-xl bg-primary-50 border-primary-300">
                                        <p className="text-xs font-semibold text-center sm:text-sm text-primary-700">
                                            ✓ {new Date(selectedDate).toLocaleDateString('id-ID', {
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

                    {/* Step 2: Pilih Jam - Mobile Optimized */}
                    {step === 2 && (
                        <div className="space-y-4 sm:space-y-6">
                            <div className="text-center">
                                <Clock className="w-12 h-12 mx-auto mb-3 sm:w-16 sm:h-16 sm:mb-4 text-primary-600" />
                                <h3 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
                                    Pilih Jam
                                </h3>
                                <p className="text-xs text-gray-600 sm:text-sm">
                                    {new Date(selectedDate).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:grid-cols-4 lg:grid-cols-6">
                                {availableTimes.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`p-3 sm:p-4 rounded-xl font-semibold transition-all duration-300 ${
                                            selectedTime === time
                                                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                                        }`}
                                    >
                                        <Clock className="w-4 h-4 mx-auto mb-1 sm:w-5 sm:h-5" />
                                        <span className="text-sm sm:text-base">{time}</span>
                                    </button>
                                ))}
                            </div>
                            {!selectedTime && (
                                <p className="text-xs text-center text-gray-500 sm:text-sm">
                                    💡 Pilih jam yang tersedia untuk melanjutkan
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 3: Isi Form Data Customer */}
                    {step === 3 && (
                        <div className="space-y-4 sm:space-y-6">
                            <div className="text-center">
                                <FileText className="w-12 h-12 mx-auto mb-3 sm:w-16 sm:h-16 sm:mb-4 text-primary-600" />
                                <h3 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
                                    Lengkapi Data Anda
                                </h3>
                                <p className="text-sm text-gray-600 sm:text-base">
                                    Isi form yang disediakan oleh {umkm.name}
                                </p>
                            </div>

                            {loadingFields ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                                </div>
                            ) : formFields.length > 0 ? (
                                <div className="max-w-2xl mx-auto space-y-6">
                                    {formFields.map((field, index) => (
                                        <div key={index} className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                {field.label}
                                                {field.required && <span className="ml-1 text-red-500">*</span>}
                                            </label>

                                            {/* TEXT, EMAIL, PHONE */}
                                            {(field.type === 'text' || field.type === 'email' || field.type === 'phone') && (
                                                <input
                                                    type={field.type === 'phone' ? 'tel' : field.type}
                                                    value={customerData[field.label] || ''}
                                                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                                                    placeholder={field.placeholder || `Masukkan ${field.label.toLowerCase()}`}
                                                    required={field.required}
                                                    className="w-full px-4 py-3 text-base transition-all border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:outline-none"
                                                />
                                            )}

                                            {/* TEXTAREA */}
                                            {field.type === 'textarea' && (
                                                <textarea
                                                    value={customerData[field.label] || ''}
                                                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                                                    placeholder={field.placeholder || `Tulis ${field.label.toLowerCase()}`}
                                                    required={field.required}
                                                    rows={4}
                                                    className="w-full px-4 py-3 text-base transition-all border-2 border-gray-200 resize-none rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:outline-none"
                                                />
                                            )}

                                            {/* SELECT */}
                                            {field.type === 'select' && (
                                                <select
                                                    value={customerData[field.label] || ''}
                                                    onChange={(e) => handleInputChange(field.label, e.target.value)}
                                                    required={field.required}
                                                    className="w-full px-4 py-3 text-base transition-all border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:outline-none"
                                                >
                                                    <option value="">Pilih {field.label}</option>
                                                    {parseOptions(field.options).map((opt, i) => (
                                                        <option key={i} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            )}

                                            {/* RADIO */}
                                            {field.type === 'radio' && (
                                                <div className="space-y-3">
                                                    {parseOptions(field.options).map((opt, i) => (
                                                        <label key={i} className="flex items-center gap-3 cursor-pointer select-none">
                                                            <input
                                                                type="radio"
                                                                name={`radio-${field.label}-${field.id}`} // unik per field
                                                                value={opt}
                                                                checked={customerData[field.label] === opt}
                                                                onChange={(e) => handleInputChange(field.label, e.target.value)}
                                                                required={field.required}
                                                                className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                                                            />
                                                            <span className="text-base text-gray-700">{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}

                                            {/* CHECKBOX */}
                                            {field.type === 'checkbox' && (
                                                <div className="space-y-3">
                                                    {parseOptions(field.options).map((opt, i) => (
                                                        <label key={i} className="flex items-center gap-3 cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={customerData[field.label]?.includes(opt) || false}
                                                                onChange={(e) => {
                                                                    const current = customerData[field.label] || [];
                                                                    const updated = e.target.checked
                                                                        ? [...current, opt]
                                                                        : current.filter(item => item !== opt);
                                                                    handleInputChange(field.label, updated);
                                                                }}
                                                                className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                                                            />
                                                            <span className="text-base text-gray-700">{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-gray-500">Tidak ada form khusus dari UMKM</p>
                                    <p className="mt-2 text-sm text-gray-400">Lanjut ke pembayaran</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Pilih Metode Pembayaran - Mobile Optimized */}
                    {step === 4 && (
                        <div className="space-y-4 sm:space-y-6">
                            <div className="text-center">
                                <CreditCard className="w-12 h-12 mx-auto mb-3 sm:w-16 sm:h-16 sm:mb-4 text-primary-600" />
                                <h3 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
                                    Pilih Metode Pembayaran
                                </h3>
                                <p className="text-sm text-gray-600 sm:text-base">
                                    Bagaimana Anda ingin membayar?
                                </p>
                            </div>

                            <div className="grid max-w-3xl gap-3 mx-auto sm:gap-4 md:grid-cols-3">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 text-left active:scale-95 ${
                                            paymentMethod === method.id
                                                ? 'border-primary-600 bg-primary-50 shadow-lg scale-105'
                                                : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                                        }`}
                                    >
                                        <method.icon className={`w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 ${
                                            paymentMethod === method.id ? 'text-primary-600' : 'text-gray-400'
                                        }`} />
                                        <h4 className="mb-1 text-base font-bold text-gray-900 sm:mb-2 sm:text-lg">{method.name}</h4>
                                        <p className="mb-1 text-xs leading-snug text-gray-600 sm:mb-2 sm:text-sm">{method.description}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-500">{method.details}</p>

                                        {paymentMethod === method.id && (
                                            <div className="flex items-center gap-2 mt-2 text-xs font-semibold sm:mt-3 sm:text-sm text-primary-600">
                                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                Dipilih
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Payment Details */}
                            {paymentMethod && (
                                <div className="max-w-2xl p-6 mx-auto border-2 border-gray-300 border-dashed rounded-2xl bg-gray-50">
                                    <h4 className="mb-3 font-bold text-gray-900">Detail Pembayaran</h4>

                                    {paymentMethod === 'offline' ? 'Bayar di Tempat' && (
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <p>• Scan QR Code yang akan muncul di step berikutnya</p>
                                            <p>• Pembayaran dapat dilakukan melalui aplikasi e-wallet apapun</p>
                                            <p>• Setelah berhasil, upload screenshot bukti pembayaran</p>
                                        </div>
                                    ) : null}

                                    {paymentMethod === 'qris' && (
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <p>• Scan QR Code yang akan muncul di step berikutnya</p>
                                            <p>• Pembayaran dapat dilakukan melalui aplikasi e-wallet apapun</p>
                                            <p>• Setelah berhasil, upload screenshot bukti pembayaran</p>
                                        </div>
                                    )}

                                    {paymentMethod === 'bank' && (
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <p>• Transfer ke rekening bank yang tertera</p>
                                            <p>• Jumlah: <span className="font-bold">Rp 100.000</span> (contoh)</p>
                                            <p>• Upload bukti transfer di step berikutnya</p>
                                        </div>
                                    )}

                                    {paymentMethod === 'ewallet' && (
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <p>• Transfer ke nomor e-wallet yang tertera</p>
                                            <p>• Support: GoPay, OVO, Dana, ShopeePay</p>
                                            <p>• Upload bukti transfer di step berikutnya</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 5: Upload Bukti Pembayaran - Mobile Optimized */}
                    {step === 5 && (
                        <div className="space-y-4 sm:space-y-6">
                            <div className="text-center">
                                <Upload className="w-12 h-12 mx-auto mb-3 sm:w-16 sm:h-16 sm:mb-4 text-primary-600" />
                                <h3 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
                                    Upload Bukti Pembayaran
                                </h3>
                                <p className="text-sm text-gray-600 sm:text-base">
                                    Lakukan pembayaran dan upload bukti transfer
                                </p>
                            </div>

                            {/* Payment Info */}
                            <div className="max-w-2xl p-4 mx-auto border-2 sm:p-6 rounded-2xl bg-primary-50 border-primary-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 rounded-full bg-primary-600">
                                        {paymentMethod === 'qris' && <QrCode className="w-6 h-6 text-white" />}
                                        {paymentMethod === 'bank' && <Building2 className="w-6 h-6 text-white" />}
                                        {paymentMethod === 'ewallet' && <Wallet className="w-6 h-6 text-white" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">
                                            {paymentMethods.find(m => m.id === paymentMethod)?.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">Silakan lakukan pembayaran</p>
                                    </div>
                                </div>

                                {paymentMethod === 'qris' && (
                                    <div className="p-3 bg-white sm:p-4 rounded-xl">
                                        <p className="mb-2 text-xs font-semibold text-center text-gray-700 sm:text-sm">Scan QR Code</p>
                                        <div className="flex items-center justify-center p-6 bg-gray-100 rounded-lg sm:p-8">
                                            <QrCode className="w-24 h-24 text-gray-400 sm:w-32 sm:h-32" />
                                        </div>
                                        <p className="mt-2 text-[10px] sm:text-xs text-center text-gray-500">
                                            *QR Code ini hanya contoh, akan diganti dengan QR asli dari UMKM
                                        </p>
                                    </div>
                                )}

                                {paymentMethod === 'bank' && (
                                    <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 bg-white rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600 sm:text-sm">Bank:</span>
                                            <span className="text-sm font-semibold text-gray-900 sm:text-base">BCA</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600 sm:text-sm">Nomor Rekening:</span>
                                            <span className="text-sm font-semibold text-gray-900 sm:text-base">1234567890</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600 sm:text-sm">Atas Nama:</span>
                                            <span className="text-sm font-semibold text-right text-gray-900 sm:text-base">{umkm.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <span className="text-xs text-gray-600 sm:text-sm">Jumlah:</span>
                                            <span className="text-base font-bold sm:text-lg text-primary-600">Rp 100.000</span>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'ewallet' && (
                                    <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 bg-white rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600 sm:text-sm">E-Wallet:</span>
                                            <span className="text-sm font-semibold text-right text-gray-900 sm:text-base">GoPay / OVO / Dana</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600 sm:text-sm">Nomor:</span>
                                            <span className="text-sm font-semibold text-gray-900 sm:text-base">08123456789</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600 sm:text-sm">Atas Nama:</span>
                                            <span className="text-sm font-semibold text-right text-gray-900 sm:text-base">{umkm.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <span className="text-xs text-gray-600 sm:text-sm">Jumlah:</span>
                                            <span className="text-base font-bold sm:text-lg text-primary-600">Rp 100.000</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Upload Section - Mobile Optimized */}
                            <div className="max-w-2xl mx-auto">
                                <label className="block mb-2 text-xs font-semibold text-gray-700 sm:mb-3 sm:text-sm">
                                    Upload Bukti Pembayaran <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="payment-proof"
                                    />
                                    <label
                                        htmlFor="payment-proof"
                                        className="flex flex-col items-center justify-center p-6 transition-all border-2 border-gray-300 border-dashed cursor-pointer sm:p-8 rounded-2xl hover:border-primary-400 hover:bg-primary-50 active:scale-95"
                                    >
                                        {paymentProofPreview ? (
                                            <div className="space-y-2 text-center sm:space-y-3">
                                                <img
                                                    src={paymentProofPreview}
                                                    alt="Preview"
                                                    className="mx-auto rounded-lg max-h-48 sm:max-h-64"
                                                />
                                                <p className="text-xs font-medium text-green-600 sm:text-sm">
                                                    ✓ File berhasil dipilih
                                                </p>
                                                <p className="text-[10px] sm:text-xs text-gray-500">
                                                    Klik untuk mengganti file
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-10 h-10 mb-2 text-gray-400 sm:w-12 sm:h-12 sm:mb-3" />
                                                <p className="mb-1 text-sm font-semibold text-gray-700 sm:text-base">
                                                    Klik untuk upload
                                                </p>
                                                <p className="text-xs text-gray-500 sm:text-sm">
                                                    PNG, JPG atau JPEG (Max 5MB)
                                                </p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Success */}
                    {step === 6 && (
                        <div className="py-12 space-y-6 text-center">
                            <div className="flex items-center justify-center w-24 h-24 mx-auto bg-green-100 rounded-full">
                                <CheckCircle className="w-16 h-16 text-green-600" />
                            </div>

                            <div>
                                <h3 className="mb-3 text-3xl font-bold text-gray-900">
                                    Booking Berhasil! 🎉
                                </h3>
                                <p className="text-lg text-gray-600">
                                    Terima kasih telah melakukan booking
                                </p>
                            </div>

                            {bookingId && (
                                <div className="inline-block px-6 py-3 rounded-full bg-primary-50">
                                    <p className="text-sm text-gray-600">ID Booking</p>
                                    <p className="text-xl font-bold text-primary-600">#{bookingId}</p>
                                </div>
                            )}

                            <div className="max-w-2xl p-6 mx-auto space-y-4 text-left border-2 border-blue-200 border-dashed rounded-2xl bg-blue-50">
                                <h4 className="font-bold text-gray-900">📋 Ringkasan Booking:</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">UMKM:</span>
                                        <span className="font-semibold text-gray-900">{umkm.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tanggal:</span>
                                        <span className="font-semibold text-gray-900">
                                            {new Date(selectedDate).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Jam:</span>
                                        <span className="font-semibold text-gray-900">{selectedTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Metode Bayar:</span>
                                        <span className="font-semibold text-gray-900">
                                            {paymentMethods.find(m => m.id === paymentMethod)?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-2xl p-6 mx-auto space-y-3 border border-yellow-200 rounded-2xl bg-yellow-50">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                                    <div className="text-left">
                                        <h4 className="mb-2 font-bold text-gray-900">⏳ Menunggu Konfirmasi UMKM</h4>
                                        <p className="mb-2 text-sm text-gray-700">
                                            Booking Anda sedang diproses. {umkm.name} akan mengonfirmasi booking dan
                                            pembayaran Anda dalam waktu 1x24 jam.
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            Anda akan mendapat notifikasi via WhatsApp setelah booking dikonfirmasi.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleClose}
                                className="px-8 py-4 text-lg font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl hover:shadow-xl hover:scale-105"
                            >
                                Tutup
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer with navigation buttons - Mobile Optimized */}
                {step < 6 && (
                    <div className="flex items-center justify-between gap-2 p-3 border-t sm:p-4 lg:p-6 bg-gray-50 sm:gap-3">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 text-sm sm:text-base font-semibold transition-all duration-300 rounded-xl active:scale-95 ${
                                step === 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                            }`}
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Kembali</span>
                        </button>

                        <div className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-600 px-1">
                            Step {step}/5
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={submitting}
                            className="flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 text-sm sm:text-base font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                    <span className="hidden sm:inline">Memproses...</span>
                                    <span className="sm:hidden">...</span>
                                </>
                            ) : step === 5 ? (
                                <>
                                    <span className="hidden sm:inline">Kirim Booking</span>
                                    <span className="sm:hidden">Kirim</span>
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                </>
                            ) : (
                                <>
                                    <span className="hidden sm:inline">Lanjut</span>
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
