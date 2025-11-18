namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WhatsAppNotificationService;

class BookingController extends Controller
{
    public function index()
    {
        return view('booking.index');
    }

    public function store(Request $request, WhatsAppNotificationService $whatsAppService)
    {
        $validated = $request->validate([
            'umkm_id' => 'required|exists:umkms,id',
            'date' => 'required|date',
            'time' => 'required',
            'payment_method' => 'required|in:online,cod',
        ]);

        $booking = Booking::create([
            'umkm_id' => $validated['umkm_id'],
            'user_id' => auth()->id(),
            'date' => $validated['date'],
            'time' => $validated['time'],
            'payment_method' => $validated['payment_method'],
            'status' => 'pending',
        ]);

        $message = "Booking berhasil untuk UMKM {$booking->umkm->name} pada tanggal {$booking->date} pukul {$booking->time}.";
        $whatsAppService->sendNotification(auth()->user()->phone, $message);

        return response()->json(['message' => 'Booking berhasil dibuat dan notifikasi telah dikirim']);
    }
}
