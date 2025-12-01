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
        DB::statement("ALTER TABLE form_fields MODIFY COLUMN type ENUM('text', 'email', 'phone', 'select', 'radio', 'checkbox', 'textarea', 'number', 'date', 'time')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE form_fields MODIFY COLUMN type ENUM('text', 'email', 'phone', 'select', 'radio', 'checkbox', 'textarea')");
    }
};
