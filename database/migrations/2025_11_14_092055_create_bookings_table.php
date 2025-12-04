<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            
            // Foreign key manual (tanpa constrained dulu)
            $table->unsignedBigInteger('umkm_id');
            $table->unsignedBigInteger('user_id')->nullable();

            // Customer Info
            $table->string('customer_name')->nullable();
            $table->string('customer_phone', 20)->nullable();

            // Service Info
            $table->string('service_name')->nullable();

            $table->date('date');
            $table->time('time');
            
            // Transaction
            $table->decimal('total_price', 15, 2)->default(0.00);
            $table->string('payment_method')->nullable();
            $table->string('payment_proof')->nullable();
            
            $table->string('status', 20)->default('pending');
            $table->timestamps();
            $table->dateTime('served_at')->nullable();
            $table->boolean('reminded')->default(0);
            $table->json('customer_data')->nullable();

            // Index dulu, foreign key nanti di migration terpisah
            $table->index('umkm_id');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
