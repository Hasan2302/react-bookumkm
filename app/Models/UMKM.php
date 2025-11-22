<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Umkm extends Model
{
    use HasFactory;

    protected $table = 'umkms';
    protected $fillable = [
        'user_id', 'name', 'phone', 'address', 'category',
        'logo', 'banner', 'description', 'services', 'opening_hours',
        'subdomain', 'slug', 'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function formFields()
    {
        return $this->hasMany(FormField::class, 'umkm_id'); // tambahkan 'umkm_id'
    }   
}
