<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormField;
use Illuminate\Http\Request;

class FormFieldController extends Controller
{
    public function index()
    {
        $fields = auth()->user()->umkm->formFields()->orderBy('sort_order')->get();
        return response()->json($fields);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:text,email,phone,select,radio,checkbox,textarea',
            'required' => 'boolean',
            'options' => 'nullable|array',
        ]);

        $field = auth()->user()->umkm->formFields()->create($data);

        return response()->json($field, 201);
    }

    public function update(Request $request, $id)
    {
        $field = auth()->user()->umkm->formFields()->findOrFail($id);
        $field->update($request->all());
        return response()->json($field);
    }

    public function destroy($id)
    {
        $field = auth()->user()->umkm->formFields()->findOrFail($id);
        $field->delete();
        return response()->json(['message' => 'Field dihapus']);
    }

    public function reorder(Request $request)
    {
        foreach ($request->fields as $index => $fieldId) {
            auth()->user()->umkm->formFields()->where('id', $fieldId)->update(['sort_order' => $index]);
        }
        return response()->json(['message' => 'Urutan disimpan']);
    }
}
