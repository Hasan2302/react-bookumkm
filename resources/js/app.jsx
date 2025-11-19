// resources/js/app.jsx
import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from '@/Pages/Auth/Login';
import UmkmDashboard from '@/Pages/Umkm/Dashboard';
import FormBuilder from '@/Pages/Umkm/FormBuilder';
import AdminDashboard from '@/Pages/Admin/Dashboard';
import Welcome from '@/Pages/Welcome';

function App() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;

    // Kalau belum login
    if (!token || !parsedUser) {
        return (
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Welcome />} />           {/* ← Landing Page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        );
      }

    // Kalau sudah login → arahkan sesuai role
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* UMKM USER */}
          {['umkm_admin', 'user'].includes(parsedUser.role) && (
            <>
              <Route path="/umkm/dashboard" element={<UmkmDashboard />} />
              <Route path="/umkm/formbuilder" element={<FormBuilder />} />
              <Route path="*" element={<Navigate to="/umkm/dashboard" replace />} />
            </>
          )}

          {/* SUPERADMIN */}
          {parsedUser.role === 'superadmin' && (
            <>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    );
  }

  createRoot(document.getElementById('app')).render(<App />);
