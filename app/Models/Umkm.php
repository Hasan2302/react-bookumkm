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
        'logo', 'banner', 'qris_image', 'description', 'services', 'opening_hours',
        'subdomain', 'slug', 'status', 'latitude', 'longitude'
    ];

    protected $appends = ['distance'];

    protected $casts = [
        'services' => 'array',
        'opening_hours' => 'array',
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
        return $this->hasMany(FormField::class, 'umkm_id');
    }

    public function scopeNearby($query, $latitude, $longitude, $radius = 10)
    {
        $haversine = "(6371 * acos(cos(radians($latitude))
                      * cos(radians(latitude))
                      * cos(radians(longitude) - radians($longitude))
                      + sin(radians($latitude))
                      * sin(radians(latitude))))";

        return $query
            ->select('*')
            ->selectRaw("{$haversine} AS distance")
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->whereRaw("{$haversine} <= ?", [$radius])
            ->orderBy('distance', 'asc');
    }

    /**
     * Accessor untuk distance (untuk append)
     */
    public function getDistanceAttribute()
    {
        return $this->attributes['distance'] ?? null;
    }
}
