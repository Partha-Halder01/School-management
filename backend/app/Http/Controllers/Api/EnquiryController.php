<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use Illuminate\Http\Request;

class EnquiryController extends Controller
{
    public function index()
    {
        return response()->json(Enquiry::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'candidate_name' => 'required|string|max:255',
            'parent_name' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'class_applied' => 'required|string',
            'details' => 'nullable|string'
        ]);

        $enquiry = Enquiry::create($validated);
        
        return response()->json([
            'message' => 'Admission Enquiry submitted successfully.',
            'data' => $enquiry
        ], 201);
    }

    public function show(Enquiry $enquiry)
    {
        return response()->json($enquiry);
    }

    public function update(Request $request, Enquiry $enquiry)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Approved,FollowUp'
        ]);

        $enquiry->update($validated);
        return response()->json(['message' => 'Status updated.', 'data' => $enquiry]);
    }

    public function destroy(Enquiry $enquiry)
    {
        $enquiry->delete();
        return response()->json(['message' => 'Enquiry logically deleted.']);
    }
}
