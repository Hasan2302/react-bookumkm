<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Cek dulu: hanya buat kolom jika belum ada
            if (!Schema::hasColumn('bookings', 'payment_proof')) {
                $table->string('payment_proof')->nullable()->after('total_price');
            }

            // Modifikasi kolom yang sudah ada (tetap jalankan ini)
            $table->string('payment_method')->nullable()->change();
            $table->decimal('total_price', 15, 2)->default(0)->change();
        });
    } 
};
