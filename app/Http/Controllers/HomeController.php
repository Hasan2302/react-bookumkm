<?php

namespace App\Http\Controllers;

use App\Models\UMKM;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $query = UMKM::where('status', 'active')->with('formFields');

        // Geospatial search jika ada koordinat
        if ($request->has('lat') && $request->has('lng')) {
            $latitude = $request->input('lat');
            $longitude = $request->input('lng');
            $radius = $request->input('radius', 10); // default 10km

            $query->nearby($latitude, $longitude, $radius);
        }

        $umkms = $query->get()->map(function ($umkm) {
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
            'userLocation' => [
                'lat' => $request->input('lat'),
                'lng' => $request->input('lng')
            ]
        ]);
    }
}
