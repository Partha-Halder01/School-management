<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index()
    {
        $studentRole = Role::where('slug', 'student')->first();
        $students = User::where('role_id', $studentRole->id)
            ->with('courseClass')
            ->latest()
            ->get();
        return response()->json($students);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'parent_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'course_class_id' => 'required|exists:course_classes,id',
            'roll_no' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'dob' => 'nullable|date',
            'status' => 'string|in:active,inactive'
        ]);

        $studentRole = Role::where('slug', 'student')->first();
        $validated['role_id'] = $studentRole->id;
        
        // Auto-generate admission number if not provided (should be automatic now)
        $lastStudent = User::where('role_id', $studentRole->id)->orderBy('id', 'desc')->first();
        $nextId = $lastStudent ? ($lastStudent->id + 1) : 1;
        $validated['admission_no'] = 'SCH-' . date('Y') . '-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
        
        // Auto-generate password if not provided
        $validated['password'] = Hash::make('student123'); // Default password for new students

        $student = User::create($validated);

        return response()->json([
            'message' => 'Student enrolled successfully. Default password is: student123',
            'data' => $student
        ], 201);
    }

    public function show(User $student)
    {
        $studentRole = Role::where('slug', 'student')->first();
        if ($student->role_id !== $studentRole->id) {
            return response()->json(['message' => 'User is not a student.'], 404);
        }
        return response()->json($student->load('courseClass', 'feePayments.fee'));
    }

    public function update(Request $request, User $student)
    {
        $studentRole = Role::where('slug', 'student')->first();
        if ($student->role_id !== $studentRole->id) {
            return response()->json(['message' => 'User is not a student.'], 404);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $student->id,
            'password' => 'nullable|string|min:8',
            'parent_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'course_class_id' => 'exists:course_classes,id',
            'roll_no' => 'nullable|string|max:50',
            'admission_no' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'dob' => 'nullable|date',
            'status' => 'string|in:active,inactive'
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $student->update($validated);

        return response()->json([
            'message' => 'Student updated successfully.',
            'data' => $student
        ]);
    }

    public function destroy(User $student)
    {
        $studentRole = Role::where('slug', 'student')->first();
        if ($student->role_id !== $studentRole->id) {
            return response()->json(['message' => 'User is not a student.'], 404);
        }

        $student->delete();
        return response()->json(['message' => 'Student deleted successfully.']);
    }
}
