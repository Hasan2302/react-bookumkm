<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UMKM extends Model
{
    use HasFactory;

    protected $table = 'umkms';
    protected $fillable = ['name', 'subdomain', 'status', 'description'];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
