<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class SettingController extends Controller
{
    // Get all settings (Public)
    public function index()
    {
        $settings = Setting::pluck('value', 'key');
        return response()->json($settings);
    }

    // Update settings (Admin + Editor)
    public function update(Request $request)
    {
        $user = Auth::user();
        if ($user->role_id !== null && !in_array((int) $user->role_id, [1, 2], true)) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $settingsInput = $request->input('settings', []);
        if (is_string($settingsInput)) {
            $decoded = json_decode($settingsInput, true);
            $settingsInput = is_array($decoded) ? $decoded : [];
        }

        $request->validate([
            'hero_banner_image' => 'nullable|image|max:5120',
        ]);

        if (!is_array($settingsInput)) {
            return response()->json(['message' => 'Invalid settings payload.'], 422);
        }

        foreach ($settingsInput as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_null($value) ? null : (string) $value]
            );
        }

        if ($request->hasFile('hero_banner_image')) {
            $path = $request->file('hero_banner_image')->store('settings', 'public');
            Setting::updateOrCreate(
                ['key' => 'home_hero_banner'],
                ['value' => $path]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    // Update testimonials (Admin + Editor)
    public function updateTestimonials(Request $request)
    {
        $user = Auth::user();
        if ($user->role_id !== null && !in_array($user->role_id, [1, 2])) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $request->validate([
            'testimonials' => 'required|array',
            'testimonials.*.name' => 'required|string|max:255',
            'testimonials.*.role' => 'required|string|max:255',
            'testimonials.*.text' => 'required|string',
            'testimonials.*.stars' => 'nullable|integer|min:1|max:5'
        ]);

        Setting::updateOrCreate(
            ['key' => 'testimonials'],
            ['value' => json_encode($request->testimonials)]
        );

        return response()->json(['message' => 'Testimonials updated successfully']);
    }

    // Update Admin Credentials (Admin)
    public function updateCredentials(Request $request)
    {
        $user = Auth::user();
        if ($user->role_id !== null && (int) $user->role_id !== 1) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $request->validate([
            'email' => 'required|email|unique:users,email,' . Auth::id(),
            'password' => 'nullable|min:6'
        ]);

        $user->email = $request->email;
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        return response()->json(['message' => 'Admin credentials updated successfully']);
    }

    // Update own credentials (Any authenticated user)
    public function updateOwnCredentials(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email,' . Auth::id(),
            'password' => 'nullable|min:6|confirmed'
        ]);

        $user = Auth::user();
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json(['message' => 'Credentials updated successfully']);
    }
}
