<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('umkm_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->unique()->constrained('umkms')->onDelete('cascade');
            $table->json('opening_hours')->nullable();
            $table->boolean('require_deposit')->default(false);
            $table->decimal('deposit_amount', 15, 2)->nullable();
            $table->boolean('delivery_enabled')->default(false);
            $table->decimal('delivery_fee', 15, 2)->nullable();
            $table->string('whatsapp_number', 20)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('umkm_settings');
    }
};
