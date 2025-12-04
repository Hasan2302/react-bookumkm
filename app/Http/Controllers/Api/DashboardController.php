<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user || !$user->umkm) {
                return response()->json(['message' => 'UMKM tidak ditemukan'], 404);
            }

            $umkmId = $user->umkm->id;
            $today = Carbon::today();
            $startOfMonth = Carbon::now()->startOfMonth();

            // Langsung query dari database, tanpa relasi kalau error
            $bookings = DB::table('bookings')->where('umkm_id', $umkmId);

            $todayBookings = $bookings->clone()->whereDate('created_at', $today)->count();

            $monthlyRevenue = $bookings->clone()
                ->where('status', 'confirmed')
                ->where('created_at', '>=', $startOfMonth)
                ->sum('total_price') ?? 0;

            $newCustomers = $bookings->clone()
                ->where('created_at', '>=', $startOfMonth)
                ->whereNotNull('customer_phone')
                ->distinct('customer_phone')
                ->count('customer_phone');

            $status = [
                'confirmed' => $bookings->clone()->where('status', 'confirmed')->count(),
                'pending'   => $bookings->clone()->where('status', 'pending')->count(),
                'cancelled' => $bookings->clone()->whereIn('status', ['cancelled', 'rejected', 'no_show'])->count(),
            ];

            // Chart 7 hari
            $dailyData = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i)->toDateString();
                $count = $bookings->clone()->whereDate('created_at', $date)->count();
                $dailyData[] = $count;
            }

            // Pendapatan
            $online = $bookings->clone()
                ->where('payment_method', 'online')
                ->where('status', 'confirmed')
                ->where('created_at', '>=', $startOfMonth)
                ->sum('total_price') ?? 0;

            $onSite = $bookings->clone()
                ->where('payment_method', 'on_site')
                ->where('status', 'confirmed')
                ->where('created_at', '>=', $startOfMonth)
                ->sum('total_price') ?? 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'todayBookings'  => $todayBookings,
                    'monthlyRevenue' => (int)$monthlyRevenue,
                    'newCustomers'   => $newCustomers,
                    'noShowRate'     => 0,
                    'status'         => $status,
                    'dailyBookings'  => [
                        'labels' => ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
                        'data'   => $dailyData
                    ],
                    'revenue' => [
                        'online' => (int)$online,
                        'onSite' => (int)$onSite
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Dashboard stats error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json([
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function recentBookings(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user || !$user->umkm) {
                return response()->json(['message' => 'UMKM tidak ditemukan'], 404);
            }

            $umkmId = $user->umkm->id;

            $query = DB::table('bookings')
                ->where('umkm_id', $umkmId)
                ->select('id', 'customer_name', 'customer_phone', 'customer_data', 'service_name', 'date', 'time', 'status', 'total_price', 'payment_method', 'payment_proof')
                ->latest('created_at');

            $diterima = $query->clone()->where('status', 'confirmed')->take(10)->get();
            $pending = $query->clone()->where('status', 'pending')->take(10)->get();
            $cancelled = $query->clone()->whereIn('status', ['cancelled', 'rejected', 'no_show'])->take(10)->get();

            // Helper function untuk extract phone number dengan fallback ke customer_data
            $getPhoneNumber = function($booking) {
                // Prioritas: gunakan customer_phone jika ada
                if (!empty($booking->customer_phone)) {
                    return $booking->customer_phone;
                }
                
                // Fallback: cari di customer_data JSON
                if (!empty($booking->customer_data)) {
                    $customerData = is_string($booking->customer_data) 
                        ? json_decode($booking->customer_data, true) 
                        : $booking->customer_data;
                        
                    if (is_array($customerData)) {
                        // Coba beberapa kemungkinan key
                        $possibleKeys = ['No. WhatsApp', 'WhatsApp', 'Nomor HP', 'No HP', 'Phone', 'Telepon'];
                        foreach ($possibleKeys as $key) {
                            if (!empty($customerData[$key])) {
                                return $customerData[$key];
                            }
                        }
                    }
                }
                
                return null; // Return null jika tidak ada nomor
            };

            $format = function($b) use ($getPhoneNumber) {
                return [
                    'id' => $b->id,
                    'customer_name' => $b->customer_name ?? 'Pelanggan',
                    'customer_phone' => $getPhoneNumber($b),
                    'service_name' => $b->service_name ?? 'Layanan Booking',
                    'total_price' => $b->total_price ?? 0,
                    'payment_method' => $b->payment_method ?? 'offline',
                    'payment_proof' => $b->payment_proof,
                    'status' => $b->status,
                    'waktu' => Carbon::parse($b->date)->format('d M Y') . ', ' . $b->time,
                ];
            };

            return response()->json([
                'diterima' => $diterima->map($format),
                'pending' => $pending->map($format),
                'cancelled' => $cancelled->map($format),
            ]);

        } catch (\Exception $e) {
            Log::error('Recent bookings error: ' . $e->getMessage());
            return response()->json(['message' => 'Server error'], 500);
        }
    }
    public function queue(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user || !$user->umkm) {
                return response()->json(['message' => 'UMKM tidak ditemukan'], 404);
            }

            $date = $request->query('date', Carbon::today()->toDateString());
            $umkmId = $user->umkm->id;

            $bookings = DB::table('bookings')
                ->where('umkm_id', $umkmId)
                ->whereDate('date', $date)
                ->whereIn('status', ['confirmed', 'served']) // Tampilkan yang confirmed & served
                ->orderBy('time', 'asc')
                ->get()
                ->map(function ($b) {
                    return [
                        'id'            => $b->id,
                        'customer_name' => $b->customer_name,
                        'service_name'  => $b->service_name,
                        'waktu'         => Carbon::parse($b->date)->format('d M Y') . ', ' . substr($b->time, 0, 5),
                        'status'        => $b->status,
                        'time_only'     => substr($b->time, 0, 5)
                    ];
                });

            return response()->json([
                'success' => true,
                'data'    => $bookings
            ]);

        } catch (\Exception $e) {
            Log::error('Queue error: ' . $e->getMessage());
            return response()->json(['message' => 'Server error'], 500);
        }
    }
}
