<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('umkms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('category')->nullable();
            $table->string('logo')->nullable();
            $table->string('subdomain')->unique();
            $table->string('slug')->unique()->nullable();
            $table->enum('status', ['active', 'suspended'])->default('active');
            $table->text('description')->nullable();
            $table->json('services')->nullable();
            $table->json('opening_hours')->nullable();
            $table->string('banner')->nullable();
            $table->string('qris_image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('umkms');
    }
};
