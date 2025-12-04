<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ubah ke VARCHAR seperti di DB, untuk fleksibilitas (bisa add value baru tanpa alter)
        DB::statement("ALTER TABLE bookings MODIFY COLUMN status VARCHAR(20) DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to VARCHAR jika perlu, atau adjust sesuai kebutuhan
        DB::statement("ALTER TABLE bookings MODIFY COLUMN status VARCHAR(20) DEFAULT 'pending'");
    }
};
