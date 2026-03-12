<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        return response()->json(Gallery::with('category')->where('is_active', true)->latest()->get());
    }

    public function home()
    {
        return response()->json(
            Gallery::with('category')
                ->where('is_active', true)
                ->where('show_on_home', true)
                ->latest()
                ->take(6)
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'gallery_category_id' => 'required|exists:gallery_categories,id',
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|max:5120',
            'show_on_home' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('galleries', 'public');
            $validated['image_path'] = $path;
        }

        $validated['show_on_home'] = $request->boolean('show_on_home', false);

        $gallery = Gallery::create($validated);
        
        return response()->json(['message' => 'Image uploaded.', 'data' => $gallery]);
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title' => 'sometimes|nullable|string|max:255',
            'gallery_category_id' => 'sometimes|required|exists:gallery_categories,id',
            'is_active' => 'sometimes|boolean',
            'show_on_home' => 'sometimes|boolean',
        ]);

        $gallery->update($validated);

        return response()->json([
            'message' => 'Gallery item updated.',
            'data' => $gallery->fresh('category'),
        ]);
    }

    public function destroy(Gallery $gallery)
    {
        $gallery->delete();
        return response()->json(['message' => 'Image deleted.']);
    }
}
