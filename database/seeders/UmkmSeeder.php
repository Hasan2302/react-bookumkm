<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UMKM;
use App\Models\User;
use Illuminate\Support\Str;

class UmkmSeeder extends Seeder
{
    public function run(): void
    {
        $umkmUsers = User::where('role', 'umkm_admin')->get();

        if ($umkmUsers->isEmpty()) {
            $user = User::create([
                'name' => 'UMKM Demo',
                'email' => 'umkm@demo.com',
                'password' => bcrypt('password'),
                'role' => 'umkm_admin',
            ]);
            $umkmUsers = collect([$user]);
        }

        $umkms = [
            [
                'name' => 'Barbershop Premium',
                'phone' => '081234567890',
                'address' => 'Jl. Sudirman No. 123, Jakarta Pusat',
                'category' => 'Barbershop',
                'description' => 'Barbershop premium dengan layanan profesional dan suasana nyaman. Tersedia layanan potong rambut, styling, dan perawatan rambut lainnya.',
                'services' => json_encode(['Haircut Premium', 'Hair Coloring', 'Hair Spa', 'Beard Grooming']),
                'opening_hours' => json_encode([
                    'Senin-Jumat' => '09:00 - 21:00',
                    'Sabtu-Minggu' => '10:00 - 20:00',
                ]),
                'logo' => null, // Will use default from UmkmCard
                'banner' => null, // Will use default from UmkmCard
                'subdomain' => 'barbershop-premium',
                'slug' => 'barbershop-premium',
                'status' => 'active',
            ],
            [
                'name' => 'Salon Cantik Anggun',
                'phone' => '081234567891',
                'address' => 'Jl. Thamrin No. 45, Jakarta Selatan',
                'category' => 'Salon',
                'description' => 'Salon kecantikan lengkap untuk wanita modern. Menyediakan berbagai treatment kecantikan dari rambut hingga kuku.',
                'services' => json_encode(['Hair Treatment', 'Facial', 'Manicure', 'Pedicure', 'Make Up']),
                'opening_hours' => json_encode([
                    'Senin-Minggu' => '08:00 - 20:00',
                ]),
                'logo' => null,
                'banner' => null,
                'subdomain' => 'salon-cantik-anggun',
                'slug' => 'salon-cantik-anggun',
                'status' => 'active',
            ],
            [
                'name' => 'Klinik Sehat Sentosa',
                'phone' => '081234567892',
                'address' => 'Jl. Gatot Subroto No. 78, Jakarta Barat',
                'category' => 'Klinik',
                'description' => 'Klinik kesehatan dengan dokter berpengalaman dan fasilitas lengkap. Melayani pemeriksaan umum, gigi, dan konsultasi kesehatan.',
                'services' => json_encode(['Konsultasi Dokter Umum', 'Pemeriksaan Gigi', 'Medical Check Up', 'Vaksinasi']),
                'opening_hours' => json_encode([
                    'Senin-Sabtu' => '07:00 - 21:00',
                    'Minggu' => '08:00 - 15:00',
                ]),
                'logo' => null,
                'banner' => null,
                'subdomain' => 'klinik-sehat-sentosa',
                'slug' => 'klinik-sehat-sentosa',
                'status' => 'active',
            ],
            [
                'name' => 'Spa & Massage Relax',
                'phone' => '081234567893',
                'address' => 'Jl. Kuningan No. 90, Jakarta Selatan',
                'category' => 'Spa',
                'description' => 'Tempat relaksasi terbaik dengan berbagai pilihan treatment spa dan massage. Suasana tenang dan terapis profesional.',
                'services' => json_encode(['Traditional Massage', 'Aromatherapy', 'Hot Stone Massage', 'Body Scrub']),
                'opening_hours' => json_encode([
                    'Senin-Minggu' => '10:00 - 22:00',
                ]),
                'logo' => null,
                'banner' => null,
                'subdomain' => 'spa-relax',
                'slug' => 'spa-relax',
                'status' => 'active',
            ],
            [
                'name' => 'Kafe Kopi Hangat',
                'phone' => '081234567894',
                'address' => 'Jl. Senopati No. 112, Jakarta Selatan',
                'category' => 'Cafe',
                'description' => 'Kafe dengan suasana nyaman dan menu kopi berkualitas. Tempat yang cocok untuk ngopi santai atau meeting.',
                'services' => json_encode(['Espresso', 'Latte', 'Cappuccino', 'Manual Brew', 'Dessert']),
                'opening_hours' => json_encode([
                    'Senin-Minggu' => '08:00 - 22:00',
                ]),
                'logo' => null,
                'banner' => null,
                'subdomain' => 'kafe-kopi-hangat',
                'slug' => 'kafe-kopi-hangat',
                'status' => 'active',
            ],
            [
                'name' => 'Bengkel Motor Jaya',
                'phone' => '081234567895',
                'address' => 'Jl. Rasuna Said No. 67, Jakarta Selatan',
                'category' => 'Bengkel',
                'description' => 'Bengkel motor terpercaya dengan mekanik berpengalaman. Melayani service rutin, tune up, dan perbaikan semua jenis motor.',
                'services' => json_encode(['Service Rutin', 'Tune Up', 'Ganti Oli', 'Ban & Kampas Rem', 'Overhaul Mesin']),
                'opening_hours' => json_encode([
                    'Senin-Sabtu' => '08:00 - 18:00',
                    'Minggu' => 'Tutup',
                ]),
                'logo' => null,
                'banner' => null,
                'subdomain' => 'bengkel-motor-jaya',
                'slug' => 'bengkel-motor-jaya',
                'status' => 'active',
            ],
        ];

        foreach ($umkms as $index => $umkmData) {
            $user = $umkmUsers->random();
            
            UMKM::create(array_merge($umkmData, [
                'user_id' => $user->id,
            ]));
        }
    }
}
