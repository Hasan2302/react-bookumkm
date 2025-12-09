<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class LaundryUmkmSeeder extends Seeder
{
    public function run(): void
    {
        // Check if user already exists
        $existingUser = DB::table('users')->where('email', 'washstudios@gmail.com')->first();
        
        if ($existingUser) {
            $userId = $existingUser->id;
            $this->command->info('Using existing user...');
        } else {
            // Create user for the UMKM owner
            $userId = DB::table('users')->insertGetId([
                'name' => 'Wash Studios Owner',
                'email' => 'washstudios@gmail.com',
                'password' => Hash::make('password123'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insert UMKM data
        $umkmId = DB::table('umkms')->insertGetId([
            'user_id' => $userId,
            'name' => 'Wash Studios Laundry',
            'subdomain' => 'washstudios',
            'phone' => '021-12345678',
            'address' => 'RUKO SERPONG GRAND PARK BLOK A1 NO. 5, Muncul, Kec. Setu, Kota Tangerang Selatan, Banten 15314',
            'category' => 'Laundry',
            'latitude' => -6.3195,
            'longitude' => 106.6684,
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info('✅ Wash Studios Laundry berhasil ditambahkan!');
        $this->command->info('📍 Lokasi: Serpong Grand Park BLOK A1 NO. 5');
        $this->command->info('📌 Koordinat: -6.3195, 106.6684');
        $this->command->info('📏 Jarak: ~1.6 km dari Golden Park 3 Serpong');
    }
}
