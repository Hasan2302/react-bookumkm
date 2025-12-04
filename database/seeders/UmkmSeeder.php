<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Umkm;
use App\Models\User;
use Illuminate\Support\Str;

class UmkmSeeder extends Seeder
{
    public function run(): void
    {
        $umkms = [
            [
                'name' => 'Captain Barbershop',
                'phone' => '081280777736',
                'address' => 'JI. Samanhudi No.49-51, Pasar Baru. Jakarta Pusat. 10710',
                'category' => 'Barbershop',
                'description' => 'Captain barbershop adalah tempat cukur rambut mewah terbesar di Indonesia. Sejak didirikan pada tahun 2015, Captain Barbershop telah berkembang menjadi 100 cabang di Jabodetabek, Karawang, Bandung, Surabaya, Medan dan Karawang. Pada tahun 2024 kami berencana untuk memperluas cabang kami hingga 130 cabang',
                'services' => json_encode(['Haircut & Styling', 'Hair Treatments', 'Hair Coloring', 'Face Treatments', 'Hair Solutions']),
                'opening_hours' => json_encode([
                    'Senin-Jumat' => '10:00 - 21:00',
                    'Sabtu-Minggu' => '10:00 - 20:00',
                ]),
                'logo' => null,
                'banner' => null,
                'subdomain' => 'captain-barbershop',
                'slug' => 'captain-barbershop',
                'status' => 'active',
            ],
        ];

        foreach ($umkms as $index => $umkmData) {
            $user = User::create([
                'name' => $umkmData['name'] . ' Owner',
                'email' => 'owner' . ($index + 1) . '@' . Str::slug($umkmData['name']) . '.com',
                'password' => bcrypt('password'),
                'role' => 'umkm_admin',
            ]);

            Umkm::create(array_merge($umkmData, [
                'user_id' => $user->id,
            ]));
        }
    }
}
