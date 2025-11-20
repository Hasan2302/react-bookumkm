<?php
// app/Http/Controllers/Api/FormBuilderController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FormBuilderController extends Controller
{
    // Ambil semua field milik UMKM user yang login
    public function index(Request $request)
    {
        $umkm = $request->user()->umkm;
        if (!$umkm) return response()->json(['message' => 'UMKM tidak ditemukan'], 404);

        $fields = $fields = $umkm->formFields()->orderBy('sort_order')->get();

        // Convert ke format yang dipakai frontend
        $formatted = $fields->map(function ($f) {
            return [
                'id' => $f->id,
                'type' => $f->type,
                'label' => $f->label,
                'required' => (bool)$f->required,
                'options' => $f->options ? json_decode($f->options, true) : [],
                'sort_order' => $f->sort_order,
            ];
        });

        return response()->json(['success' => true, 'data' => $formatted]);
    }

    // Simpan semua field (replace semua)
    public function store(Request $request)
    {
        $umkm = $request->user()->umkm;
        if (!$umkm) return response()->json(['message' => 'UMKM tidak ditemukan'], 404);

        $request->validate([
            'fields' => 'required|array',
            'fields.*.type' => 'required|in:text,email,phone,number,textarea,select,radio,checkbox',
            'fields.*.label' => 'required|string',
            'fields.*.required' => 'boolean',
            'fields.*.options' => 'array',
        ]);

        // Hapus semua field lama
        $umkm->formFields()->delete();

        // Insert baru dengan sort_order
        foreach ($request->fields as $index => $field) {
            $umkm->formFields()->create([
                'label' => $field['label'],
                'type' => $field['type'],
                'required' => $field['required'] ?? false,
                'options' => !empty($field['options']) ? json_encode($field['options']) : null,
                'sort_order' => $index,
            ]);
        }

        return response()->json(['success' => true, 'message' => 'Form berhasil disimpan!']);
    }
}