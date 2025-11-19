<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // 1. Users + role
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['superadmin', 'umkm_admin', 'user'])->default('user');
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. UMKM — PASTIKAN ADA SEMUA KOLOM INI!
        Schema::create('umkms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('category')->nullable();
            $table->string('subdomain')->unique();     // HARUS ADA!
            $table->string('slug')->unique();          // HARUS ADA!
            $table->enum('status', ['active', 'inactive', 'pending'])->default('pending');
            $table->timestamps();
        });

        // 3. Form Fields (Form Builder)
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->constrained('umkms')->onDelete('cascade');
            $table->string('label');
            $table->enum('type', ['text', 'email', 'phone', 'select', 'radio', 'checkbox', 'textarea']);
            $table->boolean('required')->default(false);
            $table->json('options')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 4. Bookings
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->constrained('umkms')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('date');
            $table->time('time');
            $table->enum('payment_method', ['online', 'cod'])->default('cod');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->timestamps();
        });

        // 5. Booking Responses
        Schema::create('booking_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade');
            $table->json('responses');
            $table->timestamps();
        });

        // 6. UMKM Settings
        Schema::create('umkm_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->unique()->constrained('umkms')->onDelete('cascade');
            $table->json('opening_hours')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->text('welcome_message')->nullable();
            $table->string('primary_color')->default('#6366f1');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('booking_responses');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('form_fields');
        Schema::dropIfExists('umkm_settings');
        Schema::dropIfExists('umkms');
        Schema::dropIfExists('users');
    }
};