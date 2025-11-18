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
}
