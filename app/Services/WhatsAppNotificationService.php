namespace App\Services;

use Illuminate\Support\Facades\Http;

class WhatsAppNotificationService
{
    protected $apiUrl;
    protected $apiToken;

    public function __construct()
    {
        $this->apiUrl = config('services.whatsapp.api_url');
        $this->apiToken = config('services.whatsapp.api_token');
    }

    public function sendNotification($phoneNumber, $message)
    {
        $response = Http::withToken($this->apiToken)->post($this->apiUrl, [
            'phone' => $phoneNumber,
            'message' => $message,
        ]);

        return $response->successful();
    }
}
