<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UMKM;
use Illuminate\Http\Request;

class SuperadminController extends Controller
{
    /**
     * GET /api/superadmin/umkm
     * List semua UMKM
     */
    public function index()
    {
        $umkms = UMKM::latest()->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Data UMKM berhasil diambil',
            'data' => $umkms
        ], 200);
    }

    /**
     * GET /api/superadmin/umkm/{id}
     * Detail UMKM
     */
    public function show($id)
    {
        $umkm = UMKM::find($id);

        if (!$umkm) {
            return response()->json([
                'status' => 'error',
                'message' => 'UMKM tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Detail UMKM',
            'data'    => $umkm
        ], 200);
    }

    /**
     * DELETE /api/superadmin/umkm/{id}
     * Hapus UMKM
     */
    public function destroy($id)
    {
        $umkm = UMKM::find($id);

        if (!$umkm) {
            return response()->json([
                'status' => 'error',
                'message' => 'UMKM tidak ditemukan'
            ], 404);
        }

        $umkm->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'UMKM berhasil dihapus'
        ], 200);
    }
}
