<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SuperadminController extends Controller
{

    /**
     * GET /api/admin/umkms
     * List semua UMKM
     */
    public function index()
    {
        $umkms = Umkm::latest()->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Data UMKM berhasil diambil',
            'data' => $umkms
        ], 200);
    }

    /**
     * POST /api/admin/umkms
     * Tambah UMKM
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'subdomain' => 'required|string|max:100|unique:umkms,subdomain',
            'status' => 'required|in:active,inactive',
            'logo' => 'nullable|image|max:2048',
            'banner' => 'nullable|image|max:4096',
        ]);

        // Handle file upload
        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('umkm/logo', 'public');
        }
        if ($request->hasFile('banner')) {
            $validated['banner'] = $request->file('banner')->store('umkm/banner', 'public');
        }

        $umkm = Umkm::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'UMKM berhasil ditambahkan',
            'data' => $umkm
        ], 201);
    }


    /**
     * GET /api/admin/umkms/{id}
     * Detail UMKM
     */
    public function show($id)
    {
        $umkm = Umkm::find($id);
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
     * PUT/PATCH /api/admin/umkms/{id}
     * Update UMKM
     */
    public function update(Request $request, $id)
    {
        $umkm = Umkm::find($id);
        if (!$umkm) {
            return response()->json([
                'status' => 'error',
                'message' => 'UMKM tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'subdomain' => 'required|string|max:100|unique:umkms,subdomain,' . $umkm->id,
            'status' => 'required|in:active,inactive',
            'logo' => 'nullable|image|max:2048',
            'banner' => 'nullable|image|max:4096',
        ]);

        // Handle file upload
        if ($request->hasFile('logo')) {
            // Hapus file lama jika ada
            if ($umkm->logo && Storage::disk('public')->exists($umkm->logo)) {
                Storage::disk('public')->delete($umkm->logo);
            }
            $validated['logo'] = $request->file('logo')->store('umkm/logo', 'public');
        }
        if ($request->hasFile('banner')) {
            if ($umkm->banner && Storage::disk('public')->exists($umkm->banner)) {
                Storage::disk('public')->delete($umkm->banner);
            }
            $validated['banner'] = $request->file('banner')->store('umkm/banner', 'public');
        }

        $umkm->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'UMKM berhasil diperbarui',
            'data' => $umkm
        ], 200);
    }

    /**
     * DELETE /api/admin/umkms/{id}
     * Hapus UMKM
     */
    public function destroy($id)
    {
        $umkm = Umkm::find($id);
        if (!$umkm) {
            return response()->json([
                'status' => 'error',
                'message' => 'UMKM tidak ditemukan'
            ], 404);
        }
        // Hapus file logo/banner jika ada
        if ($umkm->logo && Storage::disk('public')->exists($umkm->logo)) {
            Storage::disk('public')->delete($umkm->logo);
        }
        if ($umkm->banner && Storage::disk('public')->exists($umkm->banner)) {
            Storage::disk('public')->delete($umkm->banner);
        }
        $umkm->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'UMKM berhasil dihapus'
        ], 200);
    }
}
