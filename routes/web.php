<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UmkmController;
use App\Http\Controllers\SuperadminController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// DASHBOARD UTAMA: Redirect berdasarkan role
Route::get('/dashboard', function () {
    $role = strtolower(auth()->user()->role);

    return match ($role) {
        'superadmin'    => redirect()->route('superadmin.dashboard'),
        'umkm_admin'    => redirect()->route('umkm.dashboard'),
        default         => Inertia::render('Dashboard'), // user biasa
    };
})->middleware(['auth', 'verified'])->name('dashboard');

// === SUPERADMIN ROUTES ===
Route::middleware(['auth', 'role:superadmin'])->prefix('superadmin')->name('superadmin.')->group(function () {
    Route::get('/dashboard', [SuperadminController::class, 'dashboard'])->name('dashboard');
});

// === UMKM ADMIN ROUTES ===
Route::middleware(['auth', 'role:umkm_admin'])->prefix('umkm')->name('umkm.')->group(function () {
    Route::get('/dashboard', [UmkmController::class, 'dashboard'])->name('dashboard');
    Route::get('/formbuilder', [UmkmController::class, 'formbuilder'])->name('formbuilder');
    Route::get('/settings', [UmkmController::class, 'settings'])->name('settings');
});

// === USER ROUTES (opsional) ===
Route::middleware(['auth', 'role:user'])->group(function () {
    Route::get('/user/dashboard', function () {
        return Inertia::render('User/Dashboard');
    })->name('user.dashboard');
});

// === PROFILE ===
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// === PUBLIC UMKM PAGE ===
Route::get('/umkm/{subdomain}', [UmkmController::class, 'show'])->name('umkm.detail');

// === BOOKING PAGE ===
Route::get('/booking/{umkm}', [UserController::class, 'booking'])->name('user.booking');

require __DIR__.'/auth.php';
