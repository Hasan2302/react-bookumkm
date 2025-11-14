<?php

namespace App\Http\Controllers;

use App\Models\UMKM;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UmkmController extends Controller
{
    public function show($subdomain)
    {
        $umkm = UMKM::where('subdomain', $subdomain)->firstOrFail();

        return Inertia::render('UmkmDetail', [
            'umkm' => $umkm,
        ]);
    }

    public function dashboard()
    {
        $stats = [
            'dailyBookings' => 10, // Contoh data
            'revenue' => 500000, // Contoh data
        ];

        return Inertia::render('UmkmDashboard', [
            'stats' => $stats,
        ]);
    }
}
