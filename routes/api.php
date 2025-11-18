<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\FormFieldController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DashboardController;

/*
|----------------------------------------------------------------------
| API ROUTES — FULL API MODE (untuk React/Vite terpisah)
|----------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // optional

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', function (Request $request) {
        return response()->json($request->user());
    });

    // === DASHBOARD UMKM ===
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/bookings', [DashboardController::class, 'bookings']);

    // === FORM BUILDER ===
    Route::apiResource('/form-fields', FormFieldController::class);
    Route::post('/form-fields/reorder', [FormFieldController::class, 'reorder']);

    // === BOOKING MANAGEMENT ===
    Route::apiResource('/bookings', BookingController::class)->except(['store']);
    Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus']);
    Route::post('/bookings/{id}/complete', [BookingController::class, 'complete']);

    // === PUBLIC BOOKING (tanpa auth) ===
    Route::prefix('public')->group(function () {
        Route::get('/umkm/{slug}', [UmkmController::class, 'publicShow']);           // Ambil form + pengaturan
        Route::post('/umkm/{slug}/booking', [BookingController::class, 'publicStore']); // Submit dari pelanggan
    });
});
