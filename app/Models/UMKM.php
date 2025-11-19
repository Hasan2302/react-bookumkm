<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UMKM extends Model
{
    use HasFactory;

    protected $table = 'umkms';
    protected $fillable = [
        'user_id', 'name', 'phone', 'address', 'category',
        'subdomain', 'slug', 'status'
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
