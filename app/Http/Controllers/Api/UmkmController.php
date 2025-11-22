<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Umkm;
use Illuminate\Http\Request;

class UmkmController extends Controller
{
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
        $umkms = Umkm::where('status', 'active')
            ->select('id', 'name', 'category', 'address', 'phone', 'logo', 'banner', 'subdomain', 'slug', 'services', 'opening_hours')
            ->get()
            ->map(function ($umkm) {
                return [
                    'id'            => $umkm->id,
                    'name'          => $umkm->name,
                    'category'      => $umkm->category,
                    'address'       => $umkm->address,
                    'phone'         => $umkm->phone,
                    'logo'          => $umkm->logo ? asset('storage/' . $umkm->logo) : null,
                    'banner'        => $umkm->banner ? asset('storage/' . $umkm->banner) : null,
                    'subdomain'     => $umkm->subdomain,
                    'slug'          => $umkm->slug,
                    'services'      => $umkm->services ?? [],        // sudah array otomatis!
                    'opening_hours' => $umkm->opening_hours ?? [],   // sudah array otomatis!
                ];
            });
    
        return response()->json([
            'status'  => 'success',
            'message' => 'Daftar UMKM berhasil diambil',
            'data'    => $umkms
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'       => 'required|string|max:255',
            'phone'      => 'nullable|string|max:20',
            'address'    => 'nullable|string',
            'category'   => 'nullable|string|max:100',
            'description'=> 'nullable|string',
            'subdomain'  => 'required|string|unique:umkms,subdomain|max:50',
            'status'     => 'required|in:active,suspended',
            'logo'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'banner'     => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $data = $request->only(['name', 'phone', 'address', 'category', 'description', 'subdomain', 'status']);

        // Upload Logo
        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('umkm/logo', 'public');
        }

        // Upload Banner
        if ($request->hasFile('banner')) {
            $data['banner'] = $request->file('banner')->store('umkm/banner', 'public');
        }

        // Auto-generate slug
        $data['slug'] = Str::slug($request->name);

        $umkm = Umkm::create($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'UMKM berhasil ditambahkan',
            'data'    => $umkm
        ], 201);
    }

    // GET /api/umkms/{id} → Detail UMKM (untuk edit)
    public function show($id)
    {
        $umkm = Umkm::find($id);

        if (!$umkm) {
            return response()->json(['message' => 'UMKM tidak ditemukan'], 404);
        }

        return response()->json([
            'status'  => 'success',
            'data'    => $umkm
        ], 200);
    }

    // POST /api/umkms/{id} → Update UMKM (method override karena React pakai POST)
    // atau bisa pakai PUT/PATCH kalau mau
    public function update(Request $request, $id)
    {
        $umkm = Umkm::find($id);
        if (!$umkm) {
            return response()->json(['message' => 'UMKM tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'       => 'required|string|max:255',
            'phone'      => 'nullable|string|max:20',
            'address'    => 'nullable|string',
            'category'   => 'nullable|string|max:100',
            'description'=> 'nullable|string',
            'subdomain'  => 'required|string|max:50|unique:umkms,subdomain,' . $id,
            'status'     => 'required|in:active,suspended',
            'logo'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'banner'     => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $data = $request->only(['name', 'phone', 'address', 'category', 'description', 'subdomain', 'status']);

        // Upload logo baru (hapus yang lama)
        if ($request->hasFile('logo')) {
            if ($umkm->logo) Storage::disk('public')->delete($umkm->logo);
            $data['logo'] = $request->file('logo')->store('umkm/logo', 'public');
        }

        // Upload banner baru
        if ($request->hasFile('banner')) {
            if ($umkm->banner) Storage::disk('public')->delete($umkm->banner);
            $data['banner'] = $request->file('banner')->store('umkm/banner', 'public');
        }

        $data['slug'] = Str::slug($request->name);

        $umkm->update($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'UMKM berhasil diperbarui',
            'data'    => $umkm->fresh()
        ], 200);
    }

    // DELETE /api/umkms/{id}
    public function destroy($id)
    {
        $umkm = Umkm::find($id);
        if (!$umkm) {
            return response()->json(['message' => 'UMKM tidak ditemukan'], 404);
        }

        // Hapus file logo & banner
        if ($umkm->logo) Storage::disk('public')->delete($umkm->logo);
        if ($umkm->banner) Storage::disk('public')->delete($umkm->banner);

        $umkm->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'UMKM berhasil dihapus'
        ], 200);
    }

    // Tetap ada untuk publik (frontend)
    public function showBySubdomain($subdomain)
    {
        $umkm = Umkm::where('subdomain', $subdomain)->where('status', 'active')->firstOrFail();

        $umkm->services = $umkm->services ? json_decode($umkm->services, true) : [];
        $umkm->opening_hours = $umkm->opening_hours ? json_decode($umkm->opening_hours, true) : [];

        return response()->json([
            'status'  => 'success',
            'data'    => $umkm
        ]);
    }
}