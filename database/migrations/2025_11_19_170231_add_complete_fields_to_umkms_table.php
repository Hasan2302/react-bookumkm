<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('umkms', function (Blueprint $table) {
            // Pastikan kolom-kolom ini BELUM ADA, baru tambah
            if (!Schema::hasColumn('umkms', 'logo')) {
                $table->string('logo')->nullable()->after('category');
            }
            if (!Schema::hasColumn('umkms', 'description')) {
                $table->text('description')->nullable()->after('logo');
            }
            if (!Schema::hasColumn('umkms', 'services')) {
                $table->json('services')->nullable()->after('description');
            }
            if (!Schema::hasColumn('umkms', 'opening_hours')) {
                $table->json('opening_hours')->nullable()->after('services');
            }
            if (!Schema::hasColumn('umkms', 'banner')) {
                $table->string('banner')->nullable()->after('opening_hours');
            }
            // Pastikan slug & subdomain ada
            if (!Schema::hasColumn('umkms', 'subdomain')) {
                $table->string('subdomain')->unique()->after('category');
            }
            if (!Schema::hasColumn('umkms', 'slug')) {
                $table->string('slug')->unique()->after('subdomain');
            }
            // Tambah status di sini untuk match order setelah slug
            if (!Schema::hasColumn('umkms', 'status')) {
                $table->enum('status', ['active', 'suspended'])->default('active')->after('slug');
            }
        });
    }

    public function down()
    {
        Schema::table('umkms', function (Blueprint $table) {
            $table->dropColumn(['logo', 'description', 'services', 'opening_hours', 'banner', 'slug', 'subdomain', 'status']);
        });
    }
};
