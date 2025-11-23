# 📘 Guide Halaman Utama BookUMKM

## ✅ Yang Sudah Dibuat

### 1. **Design System Baru**
- **Warna Utama**: Biru Dongker Soft (#1e3a8a - #2563eb)
- **Accent**: Sky Blue (#0ea5e9)
- **Font**: Inter (modern & profesional)
- **Gradient**: Custom gradient untuk hero & CTA
- **NO PURPLE**: Tidak ada warna ungu sama sekali

### 2. **File Yang Dibuat/Diupdate**

#### Backend (Laravel)
- ✅ `app/Http/Controllers/HomeController.php` - Controller baru untuk halaman utama
- ✅ `routes/web.php` - Update route `/` menggunakan HomeController
- ✅ `database/seeders/UmkmSeeder.php` - Seeder untuk data dummy UMKM

#### Frontend (React + Inertia.js)
- ✅ `tailwind.config.js` - Custom color scheme biru dongker
- ✅ `resources/js/Layouts/PublicLayout.jsx` - Layout untuk halaman publik dengan navbar & footer
- ✅ `resources/js/Components/UmkmCard.jsx` - Komponen card UMKM reusable
- ✅ `resources/js/Components/BookingModal.jsx` - Modal booking wizard 3 steps
- ✅ `resources/js/Pages/Welcome.jsx` - Halaman utama (full rewrite)

---

## 🎨 Fitur Halaman Utama

### 1. **Hero Section**
- Full-screen viewport dengan gradient background biru
- Animated decorative elements (blur circles)
- Headline dengan gradient text
- 2 CTA buttons: "Jelajahi UMKM" & "Daftarkan Usaha"
- Stats showcase (500+ UMKM, 10K+ Booking, 4.9★ Rating)
- Scroll indicator animation

### 2. **Features Section**
- 3 kartu fitur dengan icon:
  - 🕐 Booking 24/7
  - 🛡️ Aman & Terpercaya  
  - 📈 Mudah Digunakan
- Gradient background per card (biru, hijau, orange)
- Hover effects dengan shadow

### 3. **Featured UMKM**
- Card horizontal besar (mobile: vertical)
- Badge "Unggulan" kuning
- Rating bintang + jumlah reviews
- Quick info: lokasi, jam buka
- Button "Book Sekarang" dengan gradient primary

### 4. **Search & UMKM Grid**
- Search bar sticky dengan real-time filter
- Filter berdasarkan: nama, lokasi, kategori
- Grid responsive: 1→2→3→4 kolom
- Card hover effect: scale + shadow
- Empty state jika tidak ada hasil

### 5. **Booking Modal (Wizard 3 Steps)**

**Step 1: Pilih Tanggal**
- React Calendar dengan styling custom
- Disable tanggal lampau
- Highlight tanggal dipilih

**Step 2: Pilih Jam**
- Grid waktu tersedia (09:00 - 20:00)
- Toggle button: gray → primary gradient
- Responsive 3-4 kolom

**Step 3: Isi Data Diri**
- Dynamic form dari database (`form_fields`)
- Support: text, email, tel, select, textarea
- Validasi required fields
- Layout 2 kolom (mobile: 1 kolom)

**Progress Indicator**
- 3 dot dengan icon: Calendar → Clock → User
- Checkmark saat step selesai
- Smooth transition animation

### 6. **CTA Section**
- Gradient background sama dengan hero
- Ajakan untuk UMKM mendaftar
- Button gradient kuning yang eye-catching

### 7. **Navbar & Footer (PublicLayout)**

**Navbar:**
- Sticky on scroll dengan backdrop blur
- Logo + "BookUMKM"
- Menu: Home | Tentang | Login | Daftar
- Mobile hamburger menu
- Smooth color transition saat scroll

**Footer:**
- 3 kolom: Info | Quick Links | Kontak
- Social media icons
- Copyright text
- Gradient background biru

---

## 🚀 Cara Menggunakan

### 1. **Build Frontend**
```bash
cd "/Applications/XAMPP/xamppfiles/htdocs/nfa/final project/react-bookumkm"
npm run build
```

### 2. **Seed Database (Optional)**
```bash
php artisan db:seed --class=UmkmSeeder
```

### 3. **Jalankan Server**
```bash
php artisan serve
```

### 4. **Akses Halaman**
Buka browser: `http://127.0.0.1:8000/`

---

## 📱 Mobile Optimization

✅ Touch-friendly button sizes (min 44px)  
✅ Responsive grid layouts  
✅ Mobile-first approach  
✅ Bottom modal style untuk mobile  
✅ Hamburger menu untuk navigasi  
✅ Optimized images dengan lazy load  

---

## 🎯 Key Features

✅ **Server-Side Rendering** via Inertia.js  
✅ **Real-time Search** dengan useMemo  
✅ **Dynamic Form Fields** dari database  
✅ **Smooth Animations** dengan Tailwind transitions  
✅ **Gradient Effects** profesional  
✅ **Sticky Elements** (navbar, search)  
✅ **Loading States** untuk UX yang baik  
✅ **Error Handling** dengan validasi form  

---

## 🛠️ Customization

### Ubah Warna Primary
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    900: '#1e3a8a', // ubah di sini
    // ... dst
  }
}
```

### Ubah Teks Hero
Edit `resources/js/Pages/Welcome.jsx` bagian Hero Section

### Tambah/Ubah Featured UMKM
Di database, set UMKM pertama sebagai featured atau edit logic di `HomeController.php`

---

## 📞 Troubleshooting

**Build Error:**
```bash
npm install
npm run build
```

**Data UMKM Kosong:**
```bash
php artisan db:seed --class=UmkmSeeder
```

**Storage Images Tidak Muncul:**
```bash
php artisan storage:link
```

**Error Inertia.js:**
- Pastikan `@inertiajs/react` terinstall
- Check versi di `package.json`

---

## 🎨 Color Palette

| Warna | Hex | Usage |
|-------|-----|-------|
| Primary 900 | #1e3a8a | Dark Blue (Hero, Footer) |
| Primary 600 | #2563eb | Medium Blue (Buttons, Links) |
| Sky 500 | #0ea5e9 | Light Blue (Accents) |
| Yellow 400 | #fbbf24 | CTA Buttons |
| Green 600 | #10b981 | Success States |
| Gray 50-900 | - | Neutral Colors |

---

## ✨ Next Steps (Optional)

- [ ] Implementasi actual booking API
- [ ] Integrasi WhatsApp notification
- [ ] Upload images untuk seeder UMKM
- [ ] Add more animations (framer-motion)
- [ ] Implement reviews & ratings system
- [ ] SEO optimization
- [ ] PWA support

---

**Dibuat dengan ❤️ menggunakan Laravel + Inertia.js + React + Tailwind CSS**
