<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/enquiries', [\App\Http\Controllers\Api\EnquiryController::class, 'store']); // Public admission
Route::post('/contact', [\App\Http\Controllers\Api\ContactMessageController::class, 'store']); // Public contact form

// Public Info Routes
Route::get('/notices', [\App\Http\Controllers\Api\NoticeController::class, 'index']);
Route::get('/galleries', [\App\Http\Controllers\Api\GalleryController::class, 'index']);
Route::get('/galleries/home', [\App\Http\Controllers\Api\GalleryController::class, 'home']);
Route::get('/results', [\App\Http\Controllers\Api\ResultController::class, 'index']);
Route::get('/settings', [\App\Http\Controllers\Api\SettingController::class, 'index']);

// Protected admin modules
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/user/credentials', [\App\Http\Controllers\Api\SettingController::class, 'updateOwnCredentials']);

    // Admin Notice Board
    Route::apiResource('admin/notices', \App\Http\Controllers\Api\NoticeController::class);
    
    // Admin Enquiries 
    Route::apiResource('admin/enquiries', \App\Http\Controllers\Api\EnquiryController::class);
    
    // Admin Fee 
    Route::get('admin/fee-payments', [\App\Http\Controllers\Api\FeeController::class, 'payments']);
    Route::post('admin/fee-payments', [\App\Http\Controllers\Api\FeeController::class, 'recordPayment']);
    Route::delete('admin/fee-payments/{payment}', [\App\Http\Controllers\Api\FeeController::class, 'deletePayment']);
    Route::apiResource('admin/fees', \App\Http\Controllers\Api\FeeController::class);
    Route::get('admin/classes', [\App\Http\Controllers\Api\ClassesController::class, 'index']);
    Route::get('admin/students/{studentId}/fee-summary', [\App\Http\Controllers\Api\FeeController::class, 'getStudentFeeSummary']);
    Route::post('admin/students/{studentId}/complete-year', [\App\Http\Controllers\Api\FeeController::class, 'completeYear']);

    // Admin Students
    Route::apiResource('admin/students', \App\Http\Controllers\Api\StudentController::class);

    // Admin Gallery
    Route::apiResource('admin/gallery-categories', \App\Http\Controllers\Api\GalleryCategoryController::class);
    Route::apiResource('admin/gallery', \App\Http\Controllers\Api\GalleryController::class);

    // Admin Settings
    Route::post('admin/settings', [\App\Http\Controllers\Api\SettingController::class, 'update']);
    Route::post('admin/settings/credentials', [\App\Http\Controllers\Api\SettingController::class, 'updateCredentials']);
    Route::post('admin/testimonials', [\App\Http\Controllers\Api\SettingController::class, 'updateTestimonials']);

    // Admin Contact Messages
    Route::apiResource('admin/contact-messages', \App\Http\Controllers\Api\ContactMessageController::class);

    // Admin Staff Management (RBAC)
    Route::apiResource('admin/staff', \App\Http\Controllers\Api\StaffController::class)->except(['create', 'edit', 'update', 'show']);

    Route::post('admin/students/{student}/archive-fees', [\App\Http\Controllers\Api\FeeHistoryController::class, 'archiveFees']);
    Route::get('admin/students/{student}/fee-history', [\App\Http\Controllers\Api\FeeHistoryController::class, 'index']);
});
