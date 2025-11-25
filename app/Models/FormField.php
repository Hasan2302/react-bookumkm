<?php
// app/Models/FormField.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormField extends Model
{
    protected $table = 'form_fields'; // kalau nama tabelnya beda dari default

    protected $fillable = [
        'umkm_id',
        'label',
        'type',
        'required',
        'options',
        'price',
        'sort_order'
    ];

    protected $casts = [
        'required' => 'boolean',
        'options' => 'array',
    ];

    // INI YANG PALING PENTING!
    public function umkm()
    {
        return $this->belongsTo(Umkm::class, 'umkm_id'); // tambahkan 'umkm_id'
    }
}
