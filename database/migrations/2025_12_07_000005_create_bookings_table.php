<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->constrained('umkms')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('date');
            $table->time('time');
            $table->string('payment_method')->nullable();
            $table->string('status', 20)->default('pending');
            $table->timestamps();
            $table->dateTime('served_at')->nullable();
            $table->boolean('reminded')->default(false);
            $table->string('customer_name')->nullable();
            $table->string('service_name')->nullable();
            $table->decimal('total_price', 15, 2)->default(0.00);
            $table->string('payment_proof')->nullable();
            $table->string('customer_phone', 20)->nullable();
            $table->json('customer_data')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
