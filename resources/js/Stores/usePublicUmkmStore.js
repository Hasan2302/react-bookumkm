// resources/js/Stores/usePublicUmkmStore.js
import { create } from 'zustand';
import api from '@/Services/Api';

const usePublicUmkmStore = create((set, get) => ({
  umkms: [],           // ← semua UMKM publik
  featured: null,      // ← UMKM unggulan (opsional)
  loading: false,
  error: null,

  // Fetch semua UMKM publik
  fetchUmkms: async (filters = {}) => {
    const { umkms, loading } = get();
    if (loading) return;

    set({ loading: true, error: null });

    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);

      const res = await api.get(`/umkms?${params.toString()}`);
      const data = res.data.data || [];

      // Optional: ambil satu sebagai featured
      const featured = data.find(u => u.is_featured) || data[0] || null;

      set({
        umkms: data,
        featured,
        loading: false,
      });
    } catch (err) {
      console.error('Gagal fetch UMKM publik:', err);
      set({
        error: err.response?.data?.message || 'Gagal memuat daftar UMKM',
        loading: false,
      });
    }
  },

  // Refresh manual
  refetch: () => get().fetchUmkms(),
}));

export default usePublicUmkmStore;
