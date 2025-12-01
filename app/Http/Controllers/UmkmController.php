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
        return Inertia::render('Umkm/Dashboard', [
            'stats' => [
                'todayBookings' => 14,
                'monthlyRevenue' => 2125000,
                'newCustomers' => 8,
                'noShowRate' => 5,

                'dailyBookings' => [
                    'labels' => ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                    'data' => [5, 8, 12, 10, 15, 18, 14],
                ],

                'revenue' => [
                    'online' => 1250000,
                    'onSite' => 875000,
                ],

                'status' => [
                    'confirmed' => 45,
                    'pending' => 12,
                    'cancelled' => 3,
                ],
            ],
        ]);
    }


    public function formbuilder()
    {
        return Inertia::render('Umkm/FormBuilder');
    }

    public function reservations()
    {
        return Inertia::render('Umkm/Reservations');
    }

    public function services()
    {
        return Inertia::render('Umkm/Services');
    }

    public function customers()
    {
        return Inertia::render('Umkm/Customers');
    }

    public function finance()
    {
        return Inertia::render('Umkm/Finance');
    }

    public function settings()
    {
        return Inertia::render('Umkm/Settings');
    }
}
