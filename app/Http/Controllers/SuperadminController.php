<?php

namespace App\Http\Controllers;

use App\Models\Umkm;
use Inertia\Inertia;

class SuperadminController extends Controller
{
    public function index()
    {
        $umkms = Umkm::all();

        return Inertia::render('Admin/Dashboard', [
            'umkms' => $umkms,
        ]);
    }

    public function umkm()
    {
        return Inertia::render('Admin/Umkm');
    }
}
