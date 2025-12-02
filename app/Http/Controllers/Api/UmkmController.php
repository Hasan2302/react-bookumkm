<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Umkm;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

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
    public function index(Request $request)
    {
        $query = Umkm::where('status', 'active');

        // Geo search
        if ($request->filled('lat') && $request->filled('lng')) {
            $lat = $request->input('lat');
            $lng = $request->input('lng');
            $radius = $request->input('radius', 10); // km

            $query = $query->selectRaw("
                *,
                (6371 * acos(
                    cos(radians(?)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(?)) +
                    sin(radians(?)) * sin(radians(latitude))
                )) AS distance
            ", [$lat, $lng, $lat])
            ->having('distance', '<=', $radius)
            ->orderBy('distance', 'asc');
        } else {
            // Kalau tidak ada lokasi, ambil kolom biasa
            $query = $query->select([
                'id', 'name', 'category', 'address', 'phone',
                'logo', 'banner', 'qris_image',
                'subdomain', 'slug', 'services', 'opening_hours',
                'latitude', 'longitude'
            ]);
        }

        $umkms = $query->get()->map(function ($umkm) {
            $services = $umkm->services;
            $openingHours = $umkm->opening_hours;

            if (is_string($services)) {
                $services = json_decode($services, true) ?? [];
            }
            if (is_string($openingHours)) {
                $openingHours = json_decode($openingHours, true) ?? [];
            }

            return [
                'id'            => $umkm->id,
                'name'          => $umkm->name,
                'category'      => $umkm->category,
                'address'       => $umkm->address,
                'phone'         => $umkm->phone,
                'distance'      => $umkm->distance ?? null, // ini baru muncul kalau ada lokasi
                'logo'          => $umkm->logo ? asset('storage/' . $umkm->logo) : null,
                'banner'        => $umkm->banner ? asset('storage/' . $umkm->banner) : null,
                'qris_image'    => $umkm->qris_image ? $umkm->qris_image : null,
                'subdomain'     => $umkm->subdomain,
                'slug'          => $umkm->slug,
                'services'      => $services ?? [],
                'opening_hours' => $openingHours ?? [],
            ];
        });

        return response()->json([
            'status'       => 'success',
            'message'      => 'Daftar UMKM berhasil diambil',
            'data'         => $umkms,
            'userLocation' => [
                'lat' => $request->input('lat'),
                'lng' => $request->input('lng')
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subdomain' => 'required|string|unique:umkms,subdomain',
            'status' => 'required|in:active,suspended',
            'logo' => 'nullable|image|max:2048',
        ]);

        $umkm = Umkm::create([
            'user_id'     => Auth::id(),
            'name'        => $request->name,
            'subdomain'   => $request->subdomain,
            'slug'        => Str::slug($request->name),
            'phone'       => $request->phone,
            'address'     => $request->address,
            'category'    => $request->category,
            'description' => $request->description,
            'latitude'    => $request->latitude,
            'longitude'   => $request->longitude,
            'status'      => $request->status,
            'logo'        => $request->hasFile('logo')
                ? $request->file('logo')->store('umkm/logo', 'public')
                : null,
        ]);

        return response()->json(['success' => true, 'data' => $umkm], 201);
    }

    public function show($id)
    {
        $umkm = Umkm::with('formFields')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => [
                'id'            => $umkm->id,
                'name'          => $umkm->name,
                'phone'         => $umkm->phone,
                'address'       => $umkm->address,
                'category'      => $umkm->category,
                'description'   => $umkm->description,
                'logo'          => $umkm->logo,
                'banner'        => $umkm->banner,
                'qris_image'    => $umkm->qris_image,
                'subdomain'     => $umkm->subdomain,
                'slug'          => $umkm->slug,
                'opening_hours' => $umkm->opening_hours,
                'form_fields'   => $umkm->formFields,
            ]
        ]);
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
            'description' => 'nullable|string',
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
        $umkm = Umkm::with('formFields')
            ->where('subdomain', $subdomain)
            ->where('status', 'active')
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data'   => [
                'id'            => $umkm->id,
                'name'          => $umkm->name,
                'phone'         => $umkm->phone,
                'address'       => $umkm->address,
                'category'      => $umkm->category,
                'description'   => $umkm->description,
                'logo'          => $umkm->logo,
                'banner'        => $umkm->banner,
                'qris_image'    => $umkm->qris_image,
                'subdomain'     => $umkm->subdomain,
                'slug'          => $umkm->slug,
                'opening_hours' => $umkm->opening_hours ? json_decode($umkm->opening_hours, true) : [],
                'services'      => $umkm->services ? json_decode($umkm->services, true) : [],
                'form_fields'   => $umkm->formFields,
            ]
        ]);
    }

    public function getFormFields($id)
    {
        $umkm = Umkm::find($id);

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

    public function dashboardStats()
    {
        $totalUmkm        = Umkm::count();
        $activeUmkm       = Umkm::where('status', 'active')->count();
        $suspendedUmkm    = Umkm::where('status', 'suspended')->count();
        $newThisMonth     = Umkm::whereMonth('created_at', now()->month)
                                ->whereYear('created_at', now()->year)
                                ->count();

        $revenueThisMonth = 12500000;

        $monthlyData = Umkm::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->where('created_at', '>=', now()->subMonths(5))
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month')
            ->toArray();

        $chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $chartData = [];
        for ($i = 1; $i <= 12; $i++) {
            $chartData[] = $monthlyData[$i] ?? 0;
        }
        $last6Months = array_slice($chartData, now()->month - 6 < 0 ? 12 + now()->month - 6 : now()->month - 6, 6);

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_umkm'        => $totalUmkm,
                'active_umkm'       => $activeUmkm,
                'suspended_umkm'    => $suspendedUmkm,
                'new_this_month'    => $newThisMonth,
                'revenue_this_month' => $revenueThisMonth,
                'chart' => [
                    'labels' => ['6 bln lalu', '5 bln lalu', '4 bln lalu', '3 bln lalu', '2 bln lalu', 'Bulan ini'],
                    'data'   => $last6Months
                ]
            ]
        ]);
    }

    public function dashboardData(Request $request)
    {
        $query = Umkm::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('subdomain', 'LIKE', "%{$search}%");
            });
        }

        $umkms = $query->orderBy('created_at', 'desc')->get();

        // QUERY REVENUE YANG BENAR-BENAR JALAN (TESTED!)
        $revenuePerUmkm = Booking::whereIn('status', ['confirmed', 'served'])
            ->whereIn('umkm_id', $umkms->pluck('id')->toArray()) // pastikan array
            ->select('umkm_id', DB::raw('SUM(total_price) as revenue'))
            ->groupBy('umkm_id')
            ->pluck('revenue', 'umkm_id'); // → Collection dengan key = umkm_id

        $totalRevenue = $revenuePerUmkm->sum();

        return response()->json([
            'status' => 'success',
            'summary' => [
                'total_umkm' => $umkms->count(),
                'active_umkm' => $umkms->where('status', 'active')->count(),
                'revenue' => (int) $totalRevenue,
                'period' => 'All Time (real data)'
            ],
            'umkms' => $umkms->map(function ($u) use ($revenuePerUmkm) {
                return [
                    'id'          => $u->id,
                    'name'        => $u->name,
                    'subdomain'   => $u->subdomain,
                    'phone'       => $u->phone,
                    'address'     => $u->address,
                    'category'    => $u->category,
                    'description' => $u->description,
                    'latitude'    => $u->latitude,
                    'longitude'   => $u->longitude,
                    'status'      => $u->status,
                    'logo'        => $u->logo ? asset('storage/' . $u->logo) : null,
                    'banner'      => $u->banner ? asset('storage/' . $u->banner) : null,
                    'created_at'  => $u->created_at->format('d M Y'),
                    'revenue'     => (int) ($revenuePerUmkm[$u->id] ?? 0), // INI YANG BIKIN JALAN!
                ];
            })
        ]);
    }
}
