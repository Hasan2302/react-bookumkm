<?php

namespace App\Http\Controllers;

use App\Models\Umkm;
use App\Models\Booking;
use Inertia\Inertia;

class UserController extends Controller
{
    public function booking($umkm)
    {
        $umkm = Umkm::where('subdomain', $umkm)->firstOrFail();
        $bookings = Booking::where('umkm_id', $umkm->id)->get();

        return Inertia::render('UserBooking', [
            'umkm' => $umkm,
            'bookings' => $bookings,
        ]);
    }
}
