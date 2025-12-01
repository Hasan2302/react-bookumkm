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
|----------------------------------------------------------------------
| API ROUTES — FULL API MODE (untuk React/Vite terpisah)
|----------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // optional
Route::post('/register-umkm', [AuthController::class, 'registerUmkm']);
Route::get('/umkms', [UmkmController::class, 'index']);
Route::get('/umkms/{id}', [UmkmController::class, 'show']);
Route::get('/umkms/{id}/form-fields', [UmkmController::class, 'getFormFields']);
Route::post('/bookings', [BookingController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/me', function (Request $request) {
        return response()->json($request->user());
    });
});

// Dashboard UMKM
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/bookings/recent', [DashboardController::class, 'recentBookings']);
    Route::get('/dashboard/queue', [DashboardController::class, 'queue']);
    Route::post('/bookings/confirm-all', [BookingController::class, 'confirmAll']);
    Route::post('/bookings/{id}/confirm', [BookingController::class, 'confirm']);
    Route::post('/bookings/{id}/reject', [BookingController::class, 'reject']);
    Route::post('/bookings/{id}/served', [BookingController::class, 'markAsServed']);
});

// SETTINGS UMKM
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/umkm/me', [UmkmSettingsController::class, 'me']);
    Route::match(['post', 'put'], '/umkm/settings', [UmkmSettingsController::class, 'update']);
    Route::delete('/umkm/settings/image', [UmkmSettingsController::class, 'deleteImage']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/me', function (Request $request) {
        return response()->json($request->user());
    });
});

// FORM BUILDER — INI YANG WAJIB ADA!
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/formbuilder', [FormBuilderController::class, 'index']);
    Route::post('/formbuilder', [FormBuilderController::class, 'store']);
});