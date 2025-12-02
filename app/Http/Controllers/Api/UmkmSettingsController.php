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
            'name'          => 'required|string|max:255',
            'phone'         => 'nullable|string|max:20',
            'address'       => 'nullable|string',
            'category'      => 'nullable|string|max:100',
            'description'   => 'nullable|string',
            'opening_hours' => 'nullable|json',
            'logo'          => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'banner'        => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:3072',
            'qris_image'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($umkm->logo && Storage::exists('public/' . $umkm->logo)) {
                Storage::delete('public/' . $umkm->logo);
            }
            $validated['logo'] = $request->file('logo')->store('umkm/logo', 'public');
        }

        if ($request->hasFile('banner')) {
            if ($umkm->banner && Storage::exists('public/' . $umkm->banner)) {
                Storage::delete('public/' . $umkm->banner);
            }
            $validated['banner'] = $request->file('banner')->store('umkm/banner', 'public');
        }

        if ($request->hasFile('qris_image')) {
            if ($umkm->qris_image && Storage::exists('public/' . $umkm->qris_image)) {
                Storage::delete('public/' . $umkm->qris_image);
            }
            $validated['qris_image'] = $request->file('qris_image')->store('umkm/qris', 'public');
        }

        if ($request->filled('opening_hours')) {
            $validated['opening_hours'] = json_decode($request->opening_hours, true);
        }

        $validated['services'] = null;

        $umkm->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil & QRIS berhasil diperbarui!',
            'data' => $umkm->fresh()
        ]);
    }

    public function deleteImage(Request $request)
    {
        $user = $request->user();
        $umkm = $user->umkm;

        if (!$umkm) {
            return response()->json(['message' => 'UMKM not found'], 404);
        }

        $type = $request->input('type'); // logo, banner, qris_image

        if (!in_array($type, ['logo', 'banner', 'qris_image'])) {
            return response()->json(['message' => 'Invalid image type'], 400);
        }

        if ($umkm->$type) {
            if (Storage::exists('public/' . $umkm->$type)) {
                Storage::delete('public/' . $umkm->$type);
            }

            $umkm->$type = null;
            $umkm->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully',
            'data' => $umkm->fresh()
        ]);
    }
}
