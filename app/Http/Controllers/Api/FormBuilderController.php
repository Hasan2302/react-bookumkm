namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FormBuilderController extends Controller
{
    public function index()
    {
        return view('form-builder.index');
    }

    public function store(Request $request)
    {
        // Simpan konfigurasi form ke database
        // Validasi dan logika penyimpanan
        return response()->json(['message' => 'Form berhasil disimpan']);
    }
}
