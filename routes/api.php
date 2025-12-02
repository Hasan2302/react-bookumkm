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
use App\Http\Controllers\Api\RegisterUmkmController;

/*
|--------------------------------------------------------------------------
| API Routes — BookUMKM (React/Vite SPA)
|--------------------------------------------------------------------------
*/

// ==================== GUEST / PUBLIC ROUTES (HARUS DI ATAS auth!) ====================

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // optional
Route::post('/register-umkm', [AuthController::class, 'registerUmkm']);
Route::get('/umkms', [UmkmController::class, 'index']);
Route::get('/umkms/{id}', [UmkmController::class, 'show']);
Route::get('/umkms/{id}/form-fields', [FormFieldController::class, 'publicShowById']);
Route::get('/umkms/{umkm}/booked-times', [BookingController::class, 'getBookedTimes']);
Route::post('/bookings', [BookingController::class, 'store']);

// Dashboard UMKM
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/bookings/recent', [DashboardController::class, 'recentBookings']);
    Route::post('/bookings/confirm-all', [BookingController::class, 'confirmAll']);
    Route::post('/bookings/{id}/confirm', [BookingController::class, 'confirm']);
    Route::post('/bookings/{id}/reject', [BookingController::class, 'reject']);
    Route::post('/bookings/{id}/served', [BookingController::class, 'markAsServed']);
});

// SETTINGS UMKM
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/umkm/me', [UmkmSettingsController::class, 'me']);
    Route::match(['post', 'put'], '/umkm/settings', [UmkmSettingsController::class, 'update']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/me', function (Request $request) {
        return response()->json($request->user());
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/formbuilder', [FormBuilderController::class, 'index']);
    Route::post('/formbuilder', [FormBuilderController::class, 'store']);
    Route::get('/umkm-services', [FormBuilderController::class, 'getServices']);
});

// ==================== SUPERADMIN ONLY — CRUD UMKM ====================
Route::middleware(['auth:sanctum', 'role:superadmin'])->group(function () {
    // Full CRUD UMKM untuk Superadmin
    Route::get('/admin/umkms', [UmkmController::class, 'index']);
    Route::post('/admin/umkms', [UmkmController::class, 'store']);
    Route::get('/admin/umkms/{id}', [UmkmController::class, 'show']);
    Route::match(['post', 'put', 'patch'], '/admin/umkms/{id}', [UmkmController::class, 'update']);
    Route::delete('/admin/umkms/{id}', [UmkmController::class, 'destroy']);
    Route::get('/admin/dashboard/stats', [UmkmController::class, 'dashboardStats']);
    Route::get('/admin/dashboard/data', [UmkmController::class, 'dashboardData']);
});
