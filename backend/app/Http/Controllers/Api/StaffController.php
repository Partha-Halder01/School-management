<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class StaffController extends Controller
{
    /**
     * Display a listing of staff (Editors and Accountants).
     */
    public function index()
    {
        // Get all users except Admin (role_id 1)
        $staff = User::whereIn('role_id', [2, 3])->latest()->get(['id', 'name', 'email', 'role_id', 'created_at']);
        return response()->json($staff);
    }

    /**
     * Store a newly created staff member in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
            'role_id' => ['required', Rule::in([2, 3])] // Only allow Editor (2) or Accountant (3)
        ]);
        
        $email = strtolower(trim($validated['email']));
        $existingUser = User::whereRaw('LOWER(email) = ?', [$email])->first();

        if ($existingUser) {
            if (in_array((int) $existingUser->role_id, [2, 3], true)) {
                throw ValidationException::withMessages([
                    'email' => ['A staff account with this email already exists.'],
                ]);
            }

            $roleLabels = [
                1 => 'Admin',
                4 => 'Student',
            ];

            $roleLabel = $roleLabels[(int) $existingUser->role_id] ?? 'another user';

            throw ValidationException::withMessages([
                'email' => ["This email is already linked to a {$roleLabel} account."],
            ]);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $email,
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id']
        ]);

        return response()->json(['message' => 'Staff generated securely!', 'user' => $user], 201);
    }

    /**
     * Remove the specified staff member from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting the super admin
        if ($user->role_id === 1) {
            return response()->json(['message' => 'Not authorized to delete Super Admin'], 403);
        }
        if (!in_array((int) $user->role_id, [2, 3], true)) {
            return response()->json(['message' => 'Only staff accounts can be deleted from this section'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'Staff account permanently removed']);
    }
}
