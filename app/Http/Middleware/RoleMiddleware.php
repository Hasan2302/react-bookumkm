<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        // Kalau belum login
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // Cek role
        $userRole = strtolower($user->role ?? '');
        $requiredRoles = array_map('strtolower', $roles);

        if (!in_array($userRole, $requiredRoles)) {
            return response()->json([
                'message' => 'Akses ditolak. Dibutuhkan role: ' . implode(', ', $roles)
            ], 403);
        }

        return $next($request);
    }
}