<?php

namespace App\Http\Controllers;

use App\Models\UMKM;
use Inertia\Inertia;

class SuperadminController extends Controller
{
    public function index()
    {
        $umkms = UMKM::all();

        return Inertia::render('SuperadminDashboard', [
            'umkms' => $umkms,
        ]);
    }
}
