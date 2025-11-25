// resources/js/Stores/usePublicUmkmStore.js
import { create } from 'zustand';
import api from '@/Services/Api';

const usePublicUmkmStore = create((set, get) => ({
  umkms: [],
  featured: null,
  userLocation: { lat: null, lng: null },  // BARU: Simpan lokasi user
  loading: false,
  error: null,

  // FETCH UMKM + SUPPORT LOKASI (INI YANG KEREN!)
  fetchUmkms: async (options = {}) => {
    const { loading } = get();
    if (loading) return;

    set({ loading: true, error: null });

    try {
      // Bangun query parameter dengan benar
      const params = new URLSearchParams();

      // Dari options (bisa dari URL atau dari tombol lokasi)
      if (options.lat) params.append('lat', options.lat);
      if (options.lng) params.append('lng', options.lng);
      if (options.radius) params.append('radius', options.radius);

      // Filter biasa (search, category)
      if (options.search) params.append('search', options.search);
      if (options.category) params.append('category', options.category);

      const queryString = params.toString();
      const url = queryString ? `/umkms?${queryString}` : '/umkms';

      const res = await api.get(url);

      const data = res.data.data || [];
      const newUserLocation = res.data.userLocation || { lat: null, lng: null };

      // Featured: ambil yang punya rating tinggi atau random
      const featured = data.length > 0 ? data[0] : null;

      set({
        umkms: data,
        featured,
        userLocation: newUserLocation,   // UPDATE LOKASI USER DI STORE!
        loading: false,
      });
    } catch (err) {
      console.error('Gagal fetch UMKM:', err);
      set({
        error: err.response?.data?.message || 'Gagal memuat daftar UMKM',
        loading: false,
      });
    }
  },

  // Manual refresh (tetap bisa dipake)
  refetch: (options = {}) => get().fetchUmkms(options),

  // Helper: set lokasi user tanpa fetch ulang (opsional)
  setUserLocation: (lat, lng) => {
    set({ userLocation: { lat, lng } });
  },

  // Clear lokasi (reset ke semua UMKM)
  clearLocation: () => {
    set({ userLocation: { lat: null, lng: null } });
    get().fetchUmkms(); // reload tanpa filter lokasi
  },
}));

export default usePublicUmkmStore;
