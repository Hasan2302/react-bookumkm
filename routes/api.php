<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\FormFieldController;
use App\Http\Controllers\Api\FormBuilderController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UmkmSettingsController;

/*
|--------------------------------------------------------------------------
| API Routes — BookUMKM (React/Vite SPA)
|--------------------------------------------------------------------------
*/

// ==================== GUEST / PUBLIC ROUTES ====================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register-umkm', [AuthController::class, 'registerUmkm']);

// Daftar UMKM untuk landing page (hanya yang aktif)
Route::get('/umkms', [UmkmController::class, 'index']);

// Detail UMKM publik berdasarkan subdomain (contoh: api/umkm/barbershop-fellas)
Route::get('/umkm/{subdomain}', [UmkmController::class, 'showBySubdomain']);


// ==================== AUTHENTICATED ROUTES (semua role) ====================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', fn(Request $request) => response()->json($request->user()));

    // Dashboard stats (untuk UMKM Admin & Superadmin)
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/bookings/recent', [DashboardController::class, 'recentBookings']);

    // Booking management (UMKM Admin)
    Route::post('/bookings/confirm-all', [BookingController::class, 'confirmAll']);
    Route::post('/bookings/{id}/confirm', [BookingController::class, 'confirm']);
    Route::post('/bookings/{id}/reject', [BookingController::class, 'reject']);
    Route::post('/bookings/{id}/served', [BookingController::class, 'markAsServed']);

    // UMKM Settings (UMKM Admin only — nanti bisa ditambah middleware role)
    Route::get('/umkm/me', [UmkmSettingsController::class, 'me']);
    Route::post('/umkm/settings', [UmkmSettingsController::class, 'update']);

    // Form Builder (UMKM Admin)
    Route::get('/formbuilder', [FormBuilderController::class, 'index']);
    Route::post('/formbuilder', [FormBuilderController::class, 'store']);
    Route::apiResource('/form-fields', FormFieldController::class);
});


// ==================== SUPERADMIN ONLY — CRUD UMKM ====================
Route::middleware(['auth:sanctum', 'role:superadmin'])->group(function () {
    // Full CRUD UMKM untuk Superadmin
    Route::get('/admin/umkms', [UmkmController::class, 'index']);           // semua UMKM (termasuk suspended)
    Route::post('/admin/umkms', [UmkmController::class, 'store']);
    Route::get('/admin/umkms/{id}', [UmkmController::class, 'show']);
    Route::post('/admin/umkms/{id}', [UmkmController::class, 'update']);    // POST karena React pakai FormData
    Route::delete('/admin/umkms/{id}', [UmkmController::class, 'destroy']);

    // Kalau mau pakai route standar Laravel (PUT/PATCH), bisa diganti jadi:
    // Route::apiResource('/admin/umkms', UmkmController::class)->except(['index']);
});