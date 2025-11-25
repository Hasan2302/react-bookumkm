<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'name',    
        'email',   
        'password',
        'role',   
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'role' => 'string', 
    ];

    public function umkm()
    {
        // return $this->hasOne(\App\Models\Umkm::class, 'user_id');
        // atau cukup:
        return $this->hasOne(Umkm::class, 'user_id');
    }
}