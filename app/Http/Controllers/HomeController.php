<?php

namespace App\Http\Controllers;

use App\Models\Umkm;
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
            // Pastikan tetap array, baik yang sudah array maupun yang masih string JSON
            $umkm->services = is_string($umkm->services)
                ? json_decode($umkm->services, true) ?? []
                : ($umkm->services ?? []);

            $umkm->opening_hours = is_string($umkm->opening_hours)
                ? json_decode($umkm->opening_hours, true) ?? []
                : ($umkm->opening_hours ?? []);

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
