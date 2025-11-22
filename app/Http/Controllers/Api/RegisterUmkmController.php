<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;

class RegisterUmkmController extends Controller
{
    public function index()
    {
        return view('register-umkm');
    }

    public function store(Request $request)
    {
        $authController = new \App\Http\Controllers\Api\AuthController();
        return $authController->registerUmkm($request);
    }
}