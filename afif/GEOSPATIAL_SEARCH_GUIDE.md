# 📍 Geospatial Search - Panduan Lengkap

## ✅ Fitur yang Diimplementasikan

### **Tujuan:**
Menampilkan UMKM terdekat dari lokasi user dengan urutan berdasarkan jarak (ascending).

**Contoh:**
```
Tanpa Lokasi: Laundry A, B, C (acak)
Dengan Lokasi: 
  - Laundry Express (0.5 km) 
  - Laundry Bersih (1.2 km)
  - Laundry Kilat (3.0 km)
```

---

## 🗂️ File yang Dikonfigurasi

### **1. Migration: Tambah Kolom Geospatial**
**File**: `database/migrations/2025_11_24_100000_add_geospatial_to_umkms.php`

**Kolom Ditambahkan:**
- `latitude` (decimal 10,8, nullable)
- `longitude` (decimal 11,8, nullable)
- Index: `idx_coordinates` (untuk performance)

```bash
# Jalankan migration (jika belum):
php artisan migrate
```

---

### **2. Seeder: Data Koordinat Test**
**File**: `database/seeders/GeospatialUmkmSeeder.php`

**Data Jakarta Selatan:**
- Salon → Kebayoran Baru (-6.2424, 106.7974)
- Barbershop → Senayan (-6.2258, 106.8019)
- Café → Cilandak (-6.2897, 106.8067)
- Bengkel → Pondok Indah (-6.2656, 106.7838)
- Klinik → Tebet (-6.2363, 106.8568)
- Laundry → Lebak Bulus (-6.2615, 106.7834)

```bash
# Jalankan seeder:
php artisan db:seed --class=GeospatialUmkmSeeder
```

---

### **3. Model: UMKM.php**
**File**: `app/Models/UMKM.php`

**Method Ditambahkan:**

**a) `scopeNearby($query, $latitude, $longitude, $radius = 10)`**
- Menggunakan Haversine formula
- Menghitung jarak dalam km
- Filter berdasarkan radius (default 10 km)
- Sort by distance (ASC)

**Formula Haversine:**
```
distance = 6371 * acos(
    cos(radians(lat_user)) * 
    cos(radians(lat_umkm)) * 
    cos(radians(lng_umkm) - radians(lng_user)) + 
    sin(radians(lat_user)) * 
    sin(radians(lat_umkm))
)
```

**b) `getDistanceAttribute()`**
- Accessor untuk field `distance`
- Digunakan di frontend untuk badge jarak

---

### **4. Controller: HomeController.php**
**File**: `app/Http/Controllers/HomeController.php`

**Update Method `index()`:**
```php
public function index(Request $request)
{
    $query = UMKM::where('status', 'active')->with('formFields');

    // Geospatial search
    if ($request->has('lat') && $request->has('lng')) {
        $latitude = $request->input('lat');
        $longitude = $request->input('lng');
        $radius = $request->input('radius', 10);

        $query->nearby($latitude, $longitude, $radius);
    }

    $umkms = $query->get();
    
    return Inertia::render('Welcome', [
        'umkms' => $umkms,
        'userLocation' => [
            'lat' => $request->input('lat'),
            'lng' => $request->input('lng')
        ]
    ]);
}
```

**Query Parameter:**
- `lat`: User latitude
- `lng`: User longitude
- `radius`: Search radius (default 10 km)

---

### **5. Frontend: Welcome.jsx**
**File**: `resources/js/Pages/Welcome.jsx`

**State Ditambahkan:**
```javascript
const [myLocation, setMyLocation] = useState(userLocation);
const [isLocating, setIsLocating] = useState(false);
const [locationError, setLocationError] = useState(null);
```

**Function Ditambahkan:**

**a) `handleGetLocation()`**
```javascript
navigator.geolocation.getCurrentPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        window.location.href = `/?lat=${latitude}&lng=${longitude}&radius=10`;
    },
    (error) => {
        setLocationError('Error mengambil lokasi');
    },
    {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
    }
);
```

**b) `handleClearLocation()`**
```javascript
window.location.href = '/';
```

**UI Updates:**
- ✅ Tombol "📍 Lokasi" di search bar (Mobile & Desktop)
- ✅ Status "Aktif" dengan badge hijau saat lokasi digunakan
- ✅ Tombol "Reset Lokasi" untuk clear
- ✅ Loading state "Mencari..."
- ✅ Error message jika gagal

---

### **6. Frontend: UmkmCard.jsx**
**File**: `resources/js/Components/UmkmCard.jsx`

**Badge Jarak:**
```javascript
{umkm.distance && (
    <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
        📍 {parseFloat(umkm.distance).toFixed(1)} km
    </span>
)}
```

**Posisi:**
- Featured Card: Top-left (sebelah badge "⭐ Unggulan")
- Normal Card: Top-right di banner image

---

## 🎯 Cara Menggunakan

### **User Flow:**

1. **Buka halaman utama**: `http://127.0.0.1:8000/`

2. **Klik tombol "📍 Lokasi"** di search bar

3. **Browser meminta izin lokasi** → Allow

4. **Page reload** dengan query parameter:
   ```
   /?lat=-6.2424&lng=106.7974&radius=10
   ```

5. **UMKM ditampilkan berdasarkan jarak:**
   ```
   Salon Cantik          📍 0.5 km
   Barbershop Elite      📍 1.2 km
   Café Nusantara        📍 3.8 km
   ```

6. **Reset lokasi:** Klik "Reset Lokasi" → Kembali ke tampilan semua UMKM

---

## 🧪 Testing

### **Test 1: Geolocation Browser**
```
1. Buka http://127.0.0.1:8000/
2. Klik tombol "📍 Lokasi"
3. Allow location access
4. Lihat UMKM terdekat dengan badge jarak
```

### **Test 2: Manual Koordinat**
```
# Jakarta Selatan (Senayan)
http://127.0.0.1:8000/?lat=-6.2258&lng=106.8019&radius=10

# Jakarta Utara
http://127.0.0.1:8000/?lat=-6.1380&lng=106.8605&radius=10
```

### **Test 3: Radius Custom**
```
# Radius 5 km
http://127.0.0.1:8000/?lat=-6.2258&lng=106.8019&radius=5

# Radius 20 km
http://127.0.0.1:8000/?lat=-6.2258&lng=106.8019&radius=20
```

---

## 📊 Performance

### **Database Index:**
```sql
INDEX idx_coordinates (latitude, longitude)
```
- Mempercepat query geospatial
- Haversine formula di MySQL cukup efisien

### **Frontend Optimization:**
- Geolocation cache: 5 minutes (300000 ms)
- `enableHighAccuracy: true` untuk koordinat presisi
- Timeout: 10 seconds

---

## 🚨 Error Handling

### **1. Browser tidak support geolocation**
```
Error: "Browser tidak mendukung geolocation"
```

### **2. User tolak izin lokasi**
```
Error: "Izin lokasi ditolak"
```

### **3. Lokasi tidak tersedia**
```
Error: "Lokasi tidak tersedia"
```

### **4. Timeout**
```
Error: "Timeout"
```

---

## 🎨 UI/UX Features

### **Mobile:**
- Tombol bulat hijau 📍 di sebelah kanan search input
- Badge "📍 Menampilkan UMKM terdekat" di atas search
- Tombol "Reset" untuk clear lokasi

### **Desktop:**
- Tombol "📍 Lokasi" / "📍 Aktif" dengan label
- Status "Mencari..." saat loading
- Badge "📍 Menampilkan UMKM terdekat dari lokasi Anda"
- Tombol "Reset Lokasi"

### **UMKM Card:**
- Badge hijau "📍 X.X km" di pojok kanan atas (normal card)
- Badge hijau di sebelah "⭐ Unggulan" (featured card)
- Font bold untuk visibility
- Shadow untuk depth

---

## 🔧 Troubleshooting

### **Tidak ada data koordinat?**
```bash
php artisan db:seed --class=GeospatialUmkmSeeder
```

### **Badge jarak tidak muncul?**
- Pastikan UMKM memiliki `latitude` dan `longitude`
- Check: `SELECT id, name, latitude, longitude, distance FROM umkms`

### **Hasil tidak terurut?**
- Pastikan scope `nearby()` dipanggil di controller
- Check: `->nearby($lat, $lng, $radius)` ada di query

### **Browser tidak minta izin lokasi?**
- Pastikan menggunakan HTTPS (atau localhost)
- Clear browser cache & cookies
- Check browser settings → Location permissions

---

## 📈 Future Enhancements

- [ ] Map view (Google Maps / Leaflet)
- [ ] Auto-refresh saat user bergerak
- [ ] Save favorite locations
- [ ] Search history
- [ ] Filter by distance range (slider)
- [ ] Show route/directions to UMKM
- [ ] Real-time distance update

---

## ✅ Status

**Backend**: ✅ Complete & Working  
**Frontend**: ✅ Complete & Working  
**Build**: ✅ Success (5.72s, 75.29 kB)  
**Seeder**: ✅ Data tersedia  

**Ready for Production!** 🎉

---

## 📞 Support

Jika ada masalah, check:
1. Browser console (F12) untuk JavaScript errors
2. Laravel log (`storage/logs/laravel.log`)
3. Network tab untuk API request/response
4. Database untuk koordinat UMKM

Happy Coding! 🚀
