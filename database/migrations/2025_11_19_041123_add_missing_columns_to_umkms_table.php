<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('umkms', function (Blueprint $table) {
            // Cek dulu kalau kolom belum ada, baru tambah
            if (!Schema::hasColumn('umkms', 'user_id')) {
                $table->foreignId('user_id')->after('id')->constrained('users')->onDelete('cascade');
            }
            if (!Schema::hasColumn('umkms', 'phone')) {
                $table->string('phone')->nullable()->after('name');
            }
            if (!Schema::hasColumn('umkms', 'address')) {
                $table->text('address')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('umkms', 'category')) {
                $table->string('category')->nullable()->after('address');
            }
            // Hapus add status, pindah ke add_complete untuk match order setelah slug
        });
    }

    public function down()
    {
        Schema::table('umkms', function (Blueprint $table) {
            $table->dropColumn(['user_id', 'phone', 'address', 'category']);
        });
    }
};
