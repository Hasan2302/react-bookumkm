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
        // Validasi dasar
        $request->validate([
            'umkm_id'        => 'required|exists:umkms,id',
            'date'           => 'required|date|after_or_equal:today',
            'time'           => 'required|string',
            'payment_method' => 'required|in:offline,qris,transfer',
            'customer_data'  => 'required|array',
            'customer_data.*' => 'nullable|string', // semua field boleh string/kosong
        ]);

        // Ambil data dari customer_data (tanpa peduli label persis apa)
        $customerData = $request->customer_data;

        // Cari nama (fleksibel, tidak peduli labelnya apa)
        $customerName = null;
        foreach ($customerData as $key => $value) {
            if (str_contains(strtolower($key), 'nama')) {
                $customerName = $value;
                break;
            }
        }
        $customerName = $customerName ??= 'Pelanggan';

        // Cari nomor HP/WhatsApp
        $customerPhone = null;
        foreach ($customerData as $key => $value) {
            if (str_contains(strtolower($key), 'wa') || str_contains(strtolower($key), 'hp') || str_contains(strtolower($key), 'phone')) {
                $customerPhone = $value;
                break;
            }
        }

        // Buat booking
        $booking = Booking::create([
            'umkm_id'        => $request->umkm_id,
            'user_id'        => null, // sekarang boleh null!
            'date'           => $request->date,
            'time'           => $request->time . ':00',
            'payment_method' => $request->payment_method,
            'status'         => 'pending',
            'customer_name'  => $customerName,
            'customer_phone' => $customerPhone ?? null,
            'service_name'   => $customerData['Jenis Layanan'] ?? 'Layanan UMKM',
            'total_price'    => 0,
            'customer_data'  => json_encode($customerData),
            'booked_at'      => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil! Kami akan hubungi Anda via WhatsApp dalam 1x24 jam',
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
}