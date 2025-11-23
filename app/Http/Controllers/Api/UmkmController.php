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
     * Mengambil daftar UMKM
     */
    public function index()
    {
        $umkms = UMKM::where('status', 'active')->get()->map(function ($umkm) {
            $umkm->services = json_decode($umkm->services, true);
            $umkm->opening_hours = json_decode($umkm->opening_hours, true);
            return $umkm;
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar UMKM berhasil diambil',
            'data' => $umkms
        ], 200);
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
}
