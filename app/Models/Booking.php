<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $table = 'bookings';

    protected $fillable = [
        'umkm_id',
        'user_id',
        'customer_name',
        'customer_phone',
        'service_name',
        'date',
        'time',
        'total_price',
        'payment_method',
        'status',
        'payment_proof',
    ];

    protected $casts = [
        'date' => 'date',
        'total_price' => 'integer',
    ];

    public function umkm()
    {
        return $this->belongsTo(Umkm::class);
    }
}
