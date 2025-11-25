<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('form_fields', function (Blueprint $table) {
            $table->unsignedBigInteger('price')->nullable()->after('options');
            $table->index('price');
        });
    }

    public function down()
    {
        Schema::table('form_fields', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
};
