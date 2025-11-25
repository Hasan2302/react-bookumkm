<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GeospatialUmkmSeeder extends Seeder
{
    public function run(): void
    {
        // Data koordinat Jakarta Selatan (real locations)
        $locations = [
            ['name' => 'Salon', 'lat' => -6.2424, 'lng' => 106.7974], // Kebayoran Baru
            ['name' => 'Barbershop', 'lat' => -6.2258, 'lng' => 106.8019], // Senayan
            ['name' => 'Café', 'lat' => -6.2897, 'lng' => 106.8067], // Cilandak
            ['name' => 'Bengkel', 'lat' => -6.2656, 'lng' => 106.7838], // Pondok Indah
            ['name' => 'Klinik', 'lat' => -6.2363, 'lng' => 106.8568], // Tebet
            ['name' => 'Laundry', 'lat' => -6.2615, 'lng' => 106.7834], // Lebak Bulus
        ];

        foreach ($locations as $location) {
            DB::table('umkms')
                ->where('name', 'LIKE', '%' . $location['name'] . '%')
                ->limit(1)
                ->update([
                    'latitude' => $location['lat'],
                    'longitude' => $location['lng']
                ]);
        }

        $this->command->info('Geospatial data seeded successfully!');
    }
}
