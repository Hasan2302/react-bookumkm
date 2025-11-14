<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function ($umkm) {
    return view('booking.index', ['umkm' => $umkm]);
});

// Tambahkan route lain yang spesifik untuk UMKM di sini
