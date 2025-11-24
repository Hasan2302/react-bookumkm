// resources/js/app.jsx
import './bootstrap';
import '../css/app.css';
import React from 'react';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from '@/Pages/Auth/Login';
import UmkmDashboard from '@/Pages/Umkm/Dashboard';
import FormBuilder from '@/Pages/Umkm/FormBuilder';
import AdminDashboard from '@/Pages/Admin/Dashboard';
import Welcome from '@/Pages/Welcome';
import Register from '@/Pages/Auth/Register';
import RegisterUmkm from '@/Pages/Auth/RegisterUmkm';
import UmkmSettings from '@/Pages/Umkm/Settings';
import useUmkmStore from '@/Stores/useUmkmStore';

function App() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;

    const { fetchUmkm } = useUmkmStore();

    useEffect(() => {
        fetchUmkm(); // ← INI YANG MEMICU AUTO LOAD SEKALI SAJA!
    }, [fetchUmkm]);

    // Kalau belum login
    if (!token || !parsedUser) {
        return (
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Welcome />} />           {/* ← Landing Page */}
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register-umkm" element={<RegisterUmkm />} />
            </Routes>
          </BrowserRouter>
        );
      }

    // Kalau sudah login → arahkan sesuai role
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-umkm" element={<RegisterUmkm />} />

          {/* UMKM USER */}
          {['umkm_admin', 'user'].includes(parsedUser.role) && (
            <>
              <Route path="/umkm/dashboard" element={<UmkmDashboard />} />
              <Route path="/umkm/formbuilder" element={<FormBuilder />} />
              <Route path="/umkm/settings" element={<UmkmSettings />} />
              <Route path="*" element={<Navigate to="/umkm/dashboard" replace />} />
            </>
          )}

          {/* SUPERADMIN */}
          {parsedUser.role === 'superadmin' && (
            <>
              <Route path="/superadmin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/superadmin/dashboard" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    );
  }

  createRoot(document.getElementById('app')).render(<App />);
