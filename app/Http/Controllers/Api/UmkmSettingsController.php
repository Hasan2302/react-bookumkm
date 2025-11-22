<?php
// app/Http/Controllers/Api/UmkmSettingsController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UmkmSettingsController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user();
        $umkm = $user->umkm;

        if (!$umkm) {
            return response()->json(['message' => 'UMKM tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $umkm
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $umkm = $user->umkm;

        if (!$umkm) {
            return response()->json(['message' => 'UMKM tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'category' => 'nullable|string',
            'description' => 'nullable|string',
            'services' => 'nullable|json',
            'opening_hours' => 'nullable|json',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Upload logo
        if ($request->hasFile('logo')) {
            if ($umkm->logo) Storage::delete('public/' . $umkm->logo);
            $validated['logo'] = $request->file('logo')->store('umkm/logo', 'public');
        }

        // Upload banner
        if ($request->hasFile('banner')) {
            if ($umkm->banner) Storage::delete('public/' . $umkm->banner);
            $validated['banner'] = $request->file('banner')->store('umkm/banner', 'public');
        }

        // Parse JSON
        if ($request->filled('services')) {
            $validated['services'] = json_decode($request->services, true);
        }
        if ($request->filled('opening_hours')) {
            $validated['opening_hours'] = json_decode($request->opening_hours, true);
        }

        $umkm->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui!',
            'data' => $umkm->fresh()
        ]);
    }
}