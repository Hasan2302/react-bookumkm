<?php
// app/Http/Controllers/Api/BookingController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function confirm(Request $request, $id)
    {
        $booking = Booking::where('id', $id)
            ->where('umkm_id', $request->user()->umkm->id)
            ->where('status', 'pending')
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'Booking tidak ditemukan atau sudah dikonfirmasi'], 404);
        }

        $booking->update([
            'status' => 'confirmed',
            'confirmed_at' => Carbon::now()
        ]);

        // NANTI BISA TAMBAH KIRIM WA OTOMATIS DI SINI

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil diterima!',
            'booking' => $booking
        ]);
    }

    public function reject(Request $request, $id)
    {
        $booking = Booking::where('id', $id)
            ->where('umkm_id', $request->user()->umkm->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        $booking->update([
            'status' => 'rejected'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking telah ditolak',
            'booking' => $booking
        ]);
    }

    public function confirmAll(Request $request)
    {
        $user = $request->user();
        if (!$user || !$user->umkm_id) {
            return response()->json(['message' => 'UMKM tidak ditemukan'], 403);
        }

        $updated = \DB::table('bookings')
            ->where('umkm_id', $user->umkm_id)
            ->where('status', 'pending')
            ->update([
                'status' => 'confirmed',
                'confirmed_at' => now(),
                'updated_at' => now()
            ]);

        $count = \DB::table('bookings')
            ->where('umkm_id', $user->umkm_id)
            ->where('status', 'pending')
            ->count();

        return response()->json([
            'success' => true,
            'message' => $updated > 0 ? "Berhasil menerima {$updated} booking!" : 'Tidak ada booking pending',
            'count' => $updated
        ]);
    }

    public function markAsServed(Request $request, $id)
    {
        $booking = Booking::where('id', $id)
            ->where('umkm_id', $request->user()->umkm_id)
            ->where('status', 'confirmed')
            ->firstOrFail();

        $booking->update([
            'status' => 'served',
            'served_at' => now()
        ]);

        return response()->json(['success' => true, 'message' => 'Pelanggan telah dilayani']);
    }
}