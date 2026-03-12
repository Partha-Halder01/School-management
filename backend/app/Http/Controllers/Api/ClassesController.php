<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseClass;
use Illuminate\Http\Request;

class ClassesController extends Controller
{
    public function index()
    {
        return response()->json(CourseClass::all());
    }
}
