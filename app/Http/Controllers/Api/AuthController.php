<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Umkm;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login API
     * Endpoint: POST /api/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau password salah',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ], 200);
    }

    // app/Http/Controllers/Api/AuthController.php
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'umkm_name' => 'required|string|max:255',
            'phone'     => 'required|string|max:20',
        ]);

        // Buat user dengan role umkm_admin
        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'umkm_admin',
        ]);

        // Buat UMKM otomatis
        $umkm = $user->umkm()->create([
            'name'      => $validated['umkm_name'],
            'subdomain' => Str::slug($validated['umkm_name']),
            'slug'      => Str::slug($validated['umkm_name']),
            'phone'     => $validated['phone'],
            'status'    => 'active',
        ]);

        // Buat token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Registrasi berhasil! Silakan login.',
            'data'    => [
                'user'  => $user,
                'umkm'  => $umkm,
                'token' => $token
            ]
        ], 201);
    }

    // app/Http/Controllers/Api/AuthController.php → tambah method ini
    public function registerUmkm(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|min:8|confirmed',
            'umkm_name'  => 'required|string|max:255',
            'phone'      => 'required|string|max:20',
            'address'    => 'required|string',
            'category'   => 'required|string',
        ]);

        DB::transaction(function () use ($request, &$user, &$umkm) {
            // 1. Buat user dengan role umkm_admin
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => 'umkm_admin', // sesuai enum di migration
            ]);

            // 2. Buat UMKM otomatis
            $umkm = Umkm::create([
                'user_id'    => $user->id,
                'name'       => $request->umkm_name,
                'phone'      => $request->phone,
                'address'    => $request->address,
                'category'   => $request->category,
                'subdomain'  => Str::slug($request->umkm_name) . '-' . $user->id,
                'slug'       => Str::slug($request->umkm_name),
                'status'     => 'active',
            ]);

            // 3. Buat token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Simpan ke response
            $this->responseData = compact('user', 'umkm', 'token');
        });

        return response()->json([
            'success' => true,
            'message' => 'Selamat! Akun UMKM Anda berhasil dibuat.',
            'data'    => $this->responseData ?? null
        ], 201);
    }

    /**
     * Logout API
     * Endpoint: POST /api/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout berhasil',
        ], 200);
    }
}
