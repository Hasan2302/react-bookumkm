<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $userRole = strtolower(auth()->user()->role);
        $requiredRoles = array_map('strtolower', $roles);

        Log::info('Role Check', [
            'user_role' => $userRole,
            'required' => $requiredRoles,
            'match' => in_array($userRole, $requiredRoles)
        ]);

        if (!in_array($userRole, $requiredRoles)) {
            abort(403, 'Akses ditolak. Role dibutuhkan: ' . implode(', ', $roles));
        }

        return $next($request);
    }
}
