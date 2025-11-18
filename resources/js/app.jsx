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

function App() {
    const user = localStorage.getItem('user');

    // Kalau belum login → paksa ke login
    if (!user) {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      );
    }

    // Kalau sudah login → tampilkan dashboard UMKM
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Navigate to="/umkm/dashboard" replace />} />
          <Route path="/umkm/dashboard" element={<UmkmDashboard />} />
          <Route path="/umkm/formbuilder" element={<FormBuilder />} />
          <Route path="/umkm/settings" element={<div>Settings (nanti)</div>} />
          <Route path="*" element={<Navigate to="/umkm/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  createRoot(document.getElementById('app')).render(<App />);
