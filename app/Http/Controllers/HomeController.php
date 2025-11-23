<?php

namespace App\Http\Controllers;

use App\Models\UMKM;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $umkms = UMKM::where('status', 'active')
            ->with('formFields')
            ->get()
            ->map(function ($umkm) {
                $umkm->services = json_decode($umkm->services, true) ?? [];
                $umkm->opening_hours = json_decode($umkm->opening_hours, true) ?? [];
                return $umkm;
            });

        $featured = $umkms->first();

        return Inertia::render('Welcome', [
            'umkms' => $umkms,
            'featured' => $featured,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}
