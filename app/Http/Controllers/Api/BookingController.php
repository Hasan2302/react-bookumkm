<?php
// app/Http/Controllers/Api/BookingController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Support\Str;

class BookingController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'umkm_id'        => 'required|exists:umkms,id',
            'date'           => 'required|date|after_or_equal:today',
            'time'           => 'required',
            'payment_method' => 'required|in:offline,qris,transfer,ewallet',
            'customer_name'  => 'required|string',
            'customer_phone' => 'nullable|string',
            'service_name'   => 'nullable|string',
            'total_price'    => 'required|numeric|min:0',
            'customer_data'  => 'required|array',
            'payment_proof'  => 'nullable|image|mimes:jpeg,png,jpg|max:5120|required_if:payment_method,qris,transfer,ewallet',
        ]);

        $paymentProofPath = null;

        // Upload bukti pembayaran kalau bukan offline
        if ($request->payment_method !== 'offline' && $request->hasFile('payment_proof')) {
            $paymentProofPath = $request->file('payment_proof')->store('bookings/proof', 'public');
        }

        $booking = Booking::create([
            'umkm_id'        => $request->umkm_id,
            'user_id'        => null,
            'date'           => $request->date,
            'time'           => $request->time . ':00',
            'payment_method' => $request->payment_method,
            'status'         => $request->payment_method === 'offline' ? 'confirmed' : 'pending',
            'customer_name'  => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'service_name'   => $request->service_name ?? 'Layanan Booking',
            'total_price'    => $request->total_price,
            'customer_data'  => json_encode($request->customer_data),
            'payment_proof'  => $paymentProofPath,
        ]);

        return response()->json([
            'success' => true,
            'message' => $request->payment_method === 'offline'
                ? 'Booking berhasil! Silakan datang sesuai jadwal'
                : 'Booking berhasil! Kami akan verifikasi pembayaran Anda secepatnya',
            'data' => $booking
        ], 201);
    }

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

    // BookingController.php
    public function getBookedTimes(Request $request, $umkmId)
    {
        $date = $request->query('date');

        $bookedTimes = Booking::where('umkm_id', $umkmId)
            ->where('date', $date)
            ->whereIn('status', ['pending', 'confirmed']) // Hanya yang aktif!
            ->pluck('time')
            ->toArray();

        return response()->json([
            'booked_times' => array_values(array_unique($bookedTimes)) // hilangkan duplikat
        ]);
    }
}
