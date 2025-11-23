# 📋 BOOKING FLOW DOCUMENTATION

## ✅ COMPLETED - 6 STEP BOOKING SYSTEM

Sistem booking telah diupgrade menjadi **6 langkah lengkap** dengan integrasi pembayaran!

---

## 🎯 BOOKING FLOW OVERVIEW

```
START
  ↓
[Step 1] → Pilih Tanggal
  ↓
[Step 2] → Pilih Jam
  ↓
[Step 3] → Isi Form Custom (dari UMKM)
  ↓
[Step 4] → Pilih Metode Pembayaran
  ↓
[Step 5] → Upload Bukti Pembayaran
  ↓
[Step 6] → Success Screen (Menunggu Konfirmasi)
  ↓
END
```

---

## 📝 DETAIL SETIAP STEP

### **Step 1: Pilih Tanggal** 📅
**UI Components:**
- Calendar icon (16×16, primary-600)
- Date input (HTML5 type="date")
- Preview tanggal terpilih (format Indonesia)
- Min date: Hari ini (tidak bisa booking hari kemarin)

**Validation:**
- Tanggal harus dipilih
- Tidak bisa pilih tanggal yang sudah lewat

**State:**
```javascript
const [selectedDate, setSelectedDate] = useState(new Date());
```

**Visual:**
```
┌────────────────────────────────┐
│    📅 Pilih Tanggal            │
│                                │
│  Kapan Anda ingin booking?     │
│                                │
│  ┌──────────────────────────┐  │
│  │  [Date Picker Input]     │  │
│  └──────────────────────────┘  │
│                                │
│  ✓ Senin, 23 November 2025     │
└────────────────────────────────┘
```

---

### **Step 2: Pilih Jam** ⏰
**UI Components:**
- Clock icon (16×16, primary-600)
- Grid layout (3-4-6 columns responsive)
- 12 time slots (09:00 - 20:00)
- Selected state dengan scale & shadow

**Available Times:**
```javascript
const availableTimes = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00'
];
```

**Validation:**
- Jam harus dipilih
- Jam yang sudah penuh bisa di-disable (future feature)

**State:**
```javascript
const [selectedTime, setSelectedTime] = useState('');
```

**Visual:**
```
┌────────────────────────────────┐
│    ⏰ Pilih Jam                │
│                                │
│  Senin, 23 November 2025       │
│                                │
│  [09:00] [10:00] [11:00]       │
│  [13:00] [14:00] [15:00]       │
│  [17:00] [18:00] [19:00]       │
│                                │
│  💡 Pilih jam yang tersedia    │
└────────────────────────────────┘
```

---

### **Step 3: Isi Form Custom** 📝
**Data Source:**
- Form fields diambil dari API: `/api/umkms/{id}/form-fields`
- Setiap UMKM bisa punya form berbeda
- Form dibuat oleh UMKM via Form Builder

**Field Types Support:**
- `text` - Input text biasa
- `textarea` - Multi-line text
- `select` - Dropdown dengan options

**Field Properties:**
```javascript
{
    label: "Nama Lengkap",
    type: "text",
    required: true,
    placeholder: "Masukkan nama lengkap"
}
```

**Validation:**
- Required fields harus diisi
- Alert muncul jika ada field kosong
- Data disimpan di `customerData` object

**State:**
```javascript
const [formFields, setFormFields] = useState([]);
const [customerData, setCustomerData] = useState({});
const [loadingFields, setLoadingFields] = useState(false);
```

**Visual:**
```
┌────────────────────────────────┐
│    📝 Lengkapi Data Anda       │
│                                │
│  Isi form dari Salon Cantik    │
│                                │
│  Nama Lengkap *                │
│  ┌──────────────────────────┐  │
│  │  [Input]                 │  │
│  └──────────────────────────┘  │
│                                │
│  Nomor HP *                    │
│  ┌──────────────────────────┐  │
│  │  [Input]                 │  │
│  └──────────────────────────┘  │
│                                │
│  Jenis Layanan                 │
│  ┌──────────────────────────┐  │
│  │  [Dropdown]              │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

**API Call:**
```javascript
useEffect(() => {
    if (isOpen && umkm) {
        setLoadingFields(true);
        axios.get(`http://127.0.0.1:8000/api/umkms/${umkm.id}/form-fields`)
            .then((res) => {
                setFormFields(res.data.data || []);
            })
            .finally(() => setLoadingFields(false));
    }
}, [isOpen, umkm]);
```

---

### **Step 4: Pilih Metode Pembayaran** 💳
**Payment Methods:**

#### 1. **QRIS** 📱
- **Icon:** QrCode
- **Description:** Scan QR Code dengan aplikasi e-wallet
- **Details:** Pembayaran langsung terverifikasi
- **Support:** Semua e-wallet (GoPay, OVO, Dana, ShopeePay, LinkAja, dll)

#### 2. **Transfer Bank** 🏦
- **Icon:** Building2
- **Description:** Transfer ke rekening UMKM
- **Details:** Konfirmasi dalam 1x24 jam
- **Info:** Nomor rekening ditampilkan di Step 5

#### 3. **E-Wallet** 💰
- **Icon:** Wallet
- **Description:** GoPay, OVO, Dana, ShopeePay
- **Details:** Transfer langsung ke nomor
- **Info:** Nomor e-wallet ditampilkan di Step 5

**Validation:**
- Metode pembayaran harus dipilih

**State:**
```javascript
const [paymentMethod, setPaymentMethod] = useState(''); // qris, bank, ewallet
```

**Visual:**
```
┌────────────────────────────────┐
│    💳 Pilih Metode Pembayaran  │
│                                │
│  Bagaimana Anda ingin bayar?   │
│                                │
│  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │ 📱   │  │ 🏦   │  │ 💰   │  │
│  │ QRIS │  │ Bank │  │E-Wallet│  │
│  │      │  │      │  │      │  │
│  │ ✓    │  │      │  │      │  │
│  └──────┘  └──────┘  └──────┘  │
│                                │
│  📋 Detail Pembayaran:         │
│  • Scan QR Code berikutnya     │
│  • Support semua e-wallet      │
└────────────────────────────────┘
```

---

### **Step 5: Upload Bukti Pembayaran** 📤
**Payment Info Display:**

#### QRIS Selected:
```
┌────────────────────────────────┐
│  📱 QRIS                       │
│  Silakan lakukan pembayaran    │
│                                │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │      [QR CODE IMAGE]     │  │
│  │                          │  │
│  └──────────────────────────┘  │
│  *QR dari UMKM                 │
└────────────────────────────────┘
```

#### Bank Transfer Selected:
```
┌────────────────────────────────┐
│  🏦 Transfer Bank              │
│  Silakan lakukan pembayaran    │
│                                │
│  Bank:      BCA                │
│  Rekening:  1234567890         │
│  Atas Nama: Salon Cantik       │
│  ─────────────────────────     │
│  Jumlah:    Rp 100.000         │
└────────────────────────────────┘
```

#### E-Wallet Selected:
```
┌────────────────────────────────┐
│  💰 E-Wallet                   │
│  Silakan lakukan pembayaran    │
│                                │
│  E-Wallet:  GoPay/OVO/Dana     │
│  Nomor:     08123456789        │
│  Atas Nama: Salon Cantik       │
│  ─────────────────────────     │
│  Jumlah:    Rp 100.000         │
└────────────────────────────────┘
```

**Upload Section:**
- Drag & drop area (atau click)
- Accept: `image/*` (PNG, JPG, JPEG)
- Max size: 5MB (should be validated)
- Preview image after upload
- Can replace uploaded image

**Validation:**
- Bukti pembayaran wajib diupload
- File harus format image

**State:**
```javascript
const [paymentProof, setPaymentProof] = useState(null); // File object
const [paymentProofPreview, setPaymentProofPreview] = useState(null); // Base64 string
```

**File Handler:**
```javascript
const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setPaymentProof(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPaymentProofPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
};
```

**Visual:**
```
┌────────────────────────────────┐
│    📤 Upload Bukti Pembayaran  │
│                                │
│  [Payment Info Card]           │
│                                │
│  Upload Bukti Pembayaran *     │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │   📤 Klik untuk upload   │  │
│  │   PNG, JPG (Max 5MB)     │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  [Preview Image if uploaded]   │
└────────────────────────────────┘
```

**Submit Action:**
When user clicks "Kirim Booking" button:
```javascript
const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('umkm_id', umkm.id);
    formData.append('date', formatDate(selectedDate));
    formData.append('time', selectedTime);
    formData.append('customer_data', JSON.stringify(customerData));
    formData.append('payment_method', paymentMethod);
    formData.append('payment_proof', paymentProof);

    const response = await axios.post('/api/bookings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.status === 'success') {
        setBookingId(response.data.data?.id);
        setStep(6); // Success screen
    }
};
```

---

### **Step 6: Success Screen** ✅
**Display:**
- Large green checkmark icon (CheckCircle, 16×16)
- Success message "Booking Berhasil! 🎉"
- Booking ID badge
- Summary card dengan semua info booking
- Warning card tentang menunggu konfirmasi

**Booking Summary:**
```
📋 Ringkasan Booking:
────────────────────────
UMKM:        Salon Cantik
Tanggal:     23/11/2025
Jam:         10:00
Metode Bayar: QRIS
```

**Status Info:**
```
⏳ Menunggu Konfirmasi UMKM

Booking Anda sedang diproses.
Salon Cantik akan mengonfirmasi 
booking dan pembayaran Anda 
dalam waktu 1x24 jam.

Anda akan mendapat notifikasi 
via WhatsApp setelah dikonfirmasi.
```

**Actions:**
- Button "Tutup" untuk close modal
- Clicking "Tutup" akan reset semua state

**State:**
```javascript
const [bookingId, setBookingId] = useState(null);
```

**Visual:**
```
┌────────────────────────────────┐
│                                │
│        ✅ (Big Icon)           │
│                                │
│    Booking Berhasil! 🎉        │
│                                │
│  Terima kasih telah booking    │
│                                │
│  ┌──────────────────────────┐  │
│  │   ID Booking              │  │
│  │      #12345               │  │
│  └──────────────────────────┘  │
│                                │
│  [Ringkasan Booking Card]      │
│                                │
│  [Status Menunggu Card]        │
│                                │
│       [Button: Tutup]          │
│                                │
└────────────────────────────────┘
```

---

## 🎨 UI/UX FEATURES

### **Progress Indicator**
- 5 steps ditampilkan (step 6 hidden karena success)
- Icon untuk setiap step
- Active step: Blue gradient dengan scale 110%
- Completed steps: Blue gradient
- Pending steps: Gray
- Line connector antar steps

```
[📅] ──── [⏰] ──── [📝] ──── [💳] ──── [📤]
 AKTIF   PENDING  PENDING  PENDING  PENDING
```

### **Navigation Buttons**
```
[← Kembali]     Step 1 of 5     [Lanjut →]
                                [Kirim Booking ✓]
```

- **Kembali:** Disabled di step 1
- **Lanjut:** Validate dulu sebelum next
- **Step 5:** Button text berubah "Kirim Booking"
- **Submitting:** Show loader "Memproses..."

### **Responsive Design**
- Modal width: max-w-4xl
- Max height: 90vh dengan scroll
- Grid columns: 3-4-6 (mobile-tablet-desktop)
- Touch-friendly button sizes (min 48px)

### **Animations**
- Modal: `animate-fade-in`
- Active step: `scale-110`
- Buttons: `hover:scale-105`
- Transitions: 300ms duration

---

## 💾 DATA STRUCTURE

### **Booking Submission Payload:**
```javascript
{
    umkm_id: 123,
    date: "2025-11-23",
    time: "10:00",
    customer_data: {
        "Nama Lengkap": "John Doe",
        "Nomor HP": "08123456789",
        "Jenis Layanan": "Potong Rambut"
    },
    payment_method: "qris",
    payment_proof: File // Image file
}
```

### **Expected API Response:**
```javascript
{
    status: "success",
    message: "Booking berhasil dibuat",
    data: {
        id: 12345,
        umkm_id: 123,
        date: "2025-11-23",
        time: "10:00",
        status: "pending", // pending, confirmed, cancelled
        created_at: "2025-11-23T10:00:00Z"
    }
}
```

---

## 🔌 API ENDPOINTS NEEDED

### 1. **Get Form Fields**
```
GET /api/umkms/{id}/form-fields

Response:
{
    "status": "success",
    "data": [
        {
            "label": "Nama Lengkap",
            "type": "text",
            "required": true,
            "placeholder": "Masukkan nama lengkap"
        },
        {
            "label": "Jenis Layanan",
            "type": "select",
            "required": true,
            "options": ["Potong Rambut", "Cuci Blow", "Smoothing"]
        }
    ]
}
```

### 2. **Create Booking**
```
POST /api/bookings
Content-Type: multipart/form-data

Body:
- umkm_id: integer
- date: string (YYYY-MM-DD)
- time: string (HH:mm)
- customer_data: string (JSON stringified)
- payment_method: string (qris|bank|ewallet)
- payment_proof: file (image)

Response:
{
    "status": "success",
    "message": "Booking berhasil dibuat",
    "data": {
        "id": 12345,
        "status": "pending"
    }
}
```

---

## 🎯 BACKEND TODOS

### **Database Schema Updates:**

#### **bookings table:**
```sql
ALTER TABLE bookings ADD COLUMN payment_method VARCHAR(50);
ALTER TABLE bookings ADD COLUMN payment_proof VARCHAR(255);
ALTER TABLE bookings ADD COLUMN customer_data TEXT; -- JSON
```

#### **umkm_form_fields table (if not exists):**
```sql
CREATE TABLE umkm_form_fields (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    umkm_id BIGINT,
    label VARCHAR(255),
    type VARCHAR(50), -- text, textarea, select
    required BOOLEAN DEFAULT FALSE,
    placeholder VARCHAR(255),
    options TEXT, -- JSON array untuk select
    order INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (umkm_id) REFERENCES umkms(id)
);
```

### **Controller Updates:**

#### **UmkmController:**
```php
// GET /api/umkms/{id}/form-fields
public function getFormFields($id)
{
    $umkm = Umkm::findOrFail($id);
    $fields = $umkm->formFields()
        ->orderBy('order')
        ->get(['label', 'type', 'required', 'placeholder', 'options']);
    
    return response()->json([
        'status' => 'success',
        'data' => $fields
    ]);
}
```

#### **BookingController:**
```php
// POST /api/bookings
public function store(Request $request)
{
    $validated = $request->validate([
        'umkm_id' => 'required|exists:umkms,id',
        'date' => 'required|date',
        'time' => 'required',
        'customer_data' => 'required|string',
        'payment_method' => 'required|in:qris,bank,ewallet',
        'payment_proof' => 'required|image|max:5120' // 5MB
    ]);

    // Store payment proof
    if ($request->hasFile('payment_proof')) {
        $path = $request->file('payment_proof')->store('payment_proofs', 'public');
        $validated['payment_proof'] = $path;
    }

    $booking = Booking::create($validated);

    // Send WhatsApp notification (future)
    // $this->sendWhatsAppNotification($booking);

    return response()->json([
        'status' => 'success',
        'message' => 'Booking berhasil dibuat',
        'data' => $booking
    ]);
}
```

### **Routes Update:**
```php
// routes/api.php
Route::get('umkms/{id}/form-fields', [UmkmController::class, 'getFormFields']);
Route::post('bookings', [BookingController::class, 'store']);
```

---

## 🚀 FUTURE ENHANCEMENTS

### **Priority 1 (Short Term):**
- [ ] Real payment gateway integration (Midtrans, Xendit)
- [ ] WhatsApp notification automation
- [ ] Email confirmation
- [ ] SMS notification
- [ ] Real-time slot availability check

### **Priority 2 (Medium Term):**
- [ ] Customer booking history
- [ ] Reschedule booking feature
- [ ] Cancel booking feature
- [ ] Rating & review after booking
- [ ] Booking reminder (1 day before, 1 hour before)

### **Priority 3 (Long Term):**
- [ ] Multi-language support
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Recurring bookings
- [ ] Group bookings
- [ ] Waiting list for fully booked slots
- [ ] Dynamic pricing based on time/day
- [ ] Loyalty points system

---

## 🎨 DESIGN PATTERNS USED

### **Component Architecture:**
```
BookingModal (Main Container)
├── Header (Title + Close)
├── Progress Bar (5 steps)
├── Content Area (Scrollable)
│   ├── Step 1: DatePicker
│   ├── Step 2: TimeSlots
│   ├── Step 3: DynamicForm
│   ├── Step 4: PaymentMethods
│   ├── Step 5: FileUpload + PaymentInfo
│   └── Step 6: SuccessScreen
└── Footer (Navigation Buttons)
```

### **State Management:**
- React Hooks (useState, useEffect)
- Single source of truth for each data
- State reset on modal close
- Form validation before navigation

### **API Integration:**
- Axios for HTTP requests
- FormData for file uploads
- Error handling dengan try-catch
- Loading states untuk UX

### **Responsive Design:**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Grid system untuk layout
- Touch-friendly elements

---

## 🐛 KNOWN ISSUES & LIMITATIONS

### **Current Limitations:**
1. **Payment amount** is hardcoded (Rp 100.000)
   - Should come from UMKM pricing
   
2. **QR Code** is placeholder icon
   - Need real QR generation from payment gateway
   
3. **Bank details** are static
   - Should come from UMKM settings
   
4. **No slot availability check**
   - All time slots always available
   
5. **No real-time updates**
   - Need WebSocket for live updates

### **Validation Issues:**
- File size not validated (only accepted types)
- No duplicate booking prevention
- No business hours check
- No holiday/off-day check

---

## 📱 TESTING CHECKLIST

### **Functional Testing:**
- [ ] Can select date (today and future)
- [ ] Can select time slot
- [ ] Form fields load from API
- [ ] Can fill form with validation
- [ ] Can select payment method
- [ ] Can upload payment proof
- [ ] Can preview uploaded image
- [ ] Booking submission works
- [ ] Success screen shows correct data
- [ ] Can close modal and reset state

### **UI/UX Testing:**
- [ ] Modal centers on screen
- [ ] Progress bar updates correctly
- [ ] Back button works (except step 1)
- [ ] Next button validation works
- [ ] Mobile responsive (320px+)
- [ ] Tablet responsive (768px+)
- [ ] Desktop responsive (1024px+)
- [ ] Animations smooth
- [ ] Loading states show properly

### **Integration Testing:**
- [ ] API endpoints work
- [ ] File upload works
- [ ] Error handling works
- [ ] Empty states display correctly
- [ ] No form fields scenario
- [ ] Network error scenario

---

## 📚 RELATED FILES

### **Frontend:**
- `resources/js/Components/BookingModal.jsx` - Main modal component
- `resources/js/Pages/Welcome.jsx` - Trigger booking modal
- `resources/js/Components/UmkmCard.jsx` - Trigger booking modal

### **Backend (To Be Created):**
- `app/Http/Controllers/Api/BookingController.php`
- `app/Http/Controllers/Api/UmkmController.php` (update)
- `app/Models/Booking.php`
- `app/Models/UmkmFormField.php` (new)
- `database/migrations/xxxx_add_payment_to_bookings.php`
- `database/migrations/xxxx_create_umkm_form_fields.php`

---

## 🎉 CONCLUSION

Sistem booking 6-step telah **berhasil diimplementasikan** dengan fitur lengkap:

✅ **Frontend Complete:**
- 6-step wizard dengan validasi
- Payment method selection
- File upload dengan preview
- Success screen dengan summary
- Responsive & mobile-friendly
- Smooth animations & transitions

🔄 **Backend Required:**
- API endpoints untuk form fields
- API endpoints untuk create booking
- Database schema updates
- File storage configuration
- Payment gateway integration (future)

📈 **Next Steps:**
1. Implement backend APIs
2. Test end-to-end flow
3. Add real payment gateway
4. Setup WhatsApp notifications
5. Deploy to production

---

**Created:** November 2025  
**Version:** 1.0  
**Status:** ✅ Frontend Complete, ⏳ Backend Pending
