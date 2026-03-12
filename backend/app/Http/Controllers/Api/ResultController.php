<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Result;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $query = Result::with('courseClass')->where('is_published', true);
        if($request->session_year) $query->where('session_year', $request->session_year);
        if($request->class_id) $query->where('course_class_id', $request->class_id);
        
        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'result_title' => 'required|string|max:255',
            'session_year' => 'required|string|max:50',
            'course_class_id' => 'required|exists:course_classes,id',
            'pdf' => 'nullable|file|mimes:pdf|max:10240',
            'is_published' => 'boolean'
        ]);

        if ($request->hasFile('pdf')) {
            $path = $request->file('pdf')->store('results', 'public');
            $validated['document_path'] = $path;
        }

        $result = Result::create($validated);
        return response()->json(['message' => 'Result published.', 'data' => $result]);
    }

    public function destroy(Result $result)
    {
        $result->delete();
        return response()->json(['message' => 'Result logically deleted.']);
    }
}
