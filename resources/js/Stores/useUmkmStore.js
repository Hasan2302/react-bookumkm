// resources/js/Stores/useUmkmStore.js
import { create } from 'zustand';
import api from '@/Services/Api';

const useUmkmStore = create((set, get) => ({
  umkm: null,
  services: [],
  loading: true,        // ← Mulai dari true, biar tidak stuck!
  error: null,

  fetchUmkm: async () => {
    const state = get(); // ← get() adalah fungsi dari Zustand

    // Cegah double fetch
    if (state.loading || state.umkm) return;

    set({ loading: true, error: null });

    try {
      const res = await api.get('/umkm/me');
      const data = res.data.data;

      let services = [];
      if (data.services) {
        services = typeof data.services === 'string'
          ? JSON.parse(data.services)
          : data.services;
      }

      set({
        umkm: data,
        services: services || [],
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Gagal load UMKM:', err);
      set({
        error: err.response?.data?.message || 'Gagal memuat data UMKM',
        loading: false
      });
    }
  },
}));

export default useUmkmStore;
