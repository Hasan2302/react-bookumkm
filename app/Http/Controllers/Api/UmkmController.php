<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UMKM;
use Illuminate\Http\Request;

class UmkmController extends Controller
{
    /**
     * GET /api/umkm/{subdomain}
     * Menampilkan detail UMKM berdasarkan subdomain
     */
    public function show($subdomain)
    {
        $umkm = UMKM::where('subdomain', $subdomain)->first();

        if (!$umkm) {
            return response()->json([
                'status' => 'error',
                'message' => 'UMKM tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Detail UMKM berhasil diambil',
            'data' => $umkm
        ], 200);
    }

    /**
     * GET /api/umkm/dashboard
     * Dashboard UMKM Admin (contoh data)
     */
    public function dashboard(Request $request)
    {
        // Bisa diganti dengan query booking & revenue asli
        $stats = [
            'dailyBookings' => 10,
            'monthlyBookings' => 240,
            'revenue' => 500000,
        ];

        return response()->json([
            'status' => 'success',
            'message' => 'Dashboard UMKM berhasil diambil',
            'data' => $stats
        ], 200);
    }

    /**
     * GET /api/umkms
     * Mengambil daftar UMKM dengan optional location filtering
     */
    public function index(Request $request)
    {
        $lat = $request->query('lat');
        $lng = $request->query('lng');
        $radius = $request->query('radius', 10); // Default 10km radius

        $query = UMKM::where('status', 'active');

        // Get all UMKMs
        $umkms = $query->get()->map(function ($umkm) {
            $umkm->services = json_decode($umkm->services, true);
            $umkm->opening_hours = json_decode($umkm->opening_hours, true);
            return $umkm;
        });

        // If location provided, calculate distance and filter
        if ($lat && $lng) {
            $umkms = $umkms->map(function ($umkm) use ($lat, $lng) {
                // Calculate distance using Haversine formula
                $distance = $this->calculateDistance(
                    $lat, 
                    $lng, 
                    $umkm->latitude, 
                    $umkm->longitude
                );
                
                $umkm->distance = round($distance, 2); // Distance in km
                return $umkm;
            })
            ->filter(function ($umkm) use ($radius) {
                // Filter by radius (only show UMKMs within radius)
                return $umkm->distance <= $radius;
            })
            ->sortBy('distance') // Sort by nearest first
            ->values(); // Reset array keys
        }

        return response()->json([
            'status' => 'success',
            'message' => $umkms->isEmpty() 
                ? 'Tidak ada UMKM dalam radius ' . $radius . ' km dari lokasi Anda'
                : 'Daftar UMKM berhasil diambil',
            'data' => $umkms,
            'userLocation' => $lat && $lng ? ['lat' => (float)$lat, 'lng' => (float)$lng] : null,
            'radius' => (int)$radius,
            'total' => $umkms->count()
        ], 200);
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * Returns distance in kilometers
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        // Handle missing coordinates
        if (!$lat2 || !$lon2) {
            return 999999; // Very large distance for UMKMs without coordinates
        }

        $earthRadius = 6371; // Earth's radius in kilometers

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * GET /api/umkms/{id}/form-fields
     * Mengambil form fields untuk UMKM tertentu
     */
    public function getFormFields($id)
    {
        $umkm = UMKM::find($id);

        if (!$umkm) {
            return response()->json([
                'status' => 'error',
                'message' => 'UMKM tidak ditemukan',
                'data' => []
            ], 404);
        }

        $formFields = $umkm->formFields()->orderBy('sort_order')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Form fields berhasil diambil',
            'data' => $formFields
        ], 200);
    }

    /**
     * GET /api/umkms/{id}/booked-times
     * Mengambil daftar jam yang sudah dibooking pada tanggal tertentu
     */
    public function getBookedTimes(Request $request, $id)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $date = $request->date;

        $bookedTimes = \App\Models\Booking::where('umkm_id', $id)
            ->where('date', $date)
            ->whereIn('status', ['pending', 'confirmed']) // Hanya booking aktif
            ->pluck('time')
            ->map(function ($time) {
                return substr($time, 0, 5); // Ambil HH:MM
            })
            ->toArray();

        return response()->json([
            'status' => 'success',
            'booked_times' => $bookedTimes
        ]);
    }
}
