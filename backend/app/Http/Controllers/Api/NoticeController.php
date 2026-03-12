<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    public function index()
    {
        return response()->json(Notice::where('is_active', true)->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
            'pdf' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        if ($request->hasFile('pdf')) {
            $path = $request->file('pdf')->store('notices', 'public');
            $validated['pdf_path'] = $path;
        }

        $notice = Notice::create($validated);
        return response()->json(['message' => 'Notice created securely.', 'data' => $notice]);
    }

    public function show(Notice $notice)
    {
        return response()->json($notice);
    }

    public function update(Request $request, Notice $notice)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'category' => 'string',
            'is_active' => 'boolean'
        ]);

        $notice->update($validated);
        return response()->json(['message' => 'Notice updated.', 'data' => $notice]);
    }

    public function destroy(Notice $notice)
    {
        $notice->delete();
        return response()->json(['message' => 'Notice logically deleted.']);
    }
}
