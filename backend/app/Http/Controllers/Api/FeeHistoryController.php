<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeeHistory;
use App\Models\User;
use Illuminate\Http\Request;

class FeeHistoryController extends Controller
{
    public function archiveFees(User $student)
    {
        $totalFees = $student->courseClass->fees->where('fee_type', 'Annual Fee')->sum('amount');
        $totalPaid = $student->feePayments()->sum('amount_paid');

        FeeHistory::create([
            'student_id' => $student->id,
            'total_fee' => $totalFees,
            'total_paid' => $totalPaid,
            'academic_year' => date('Y'),
            'payment_details' => $student->feePayments->toJson(),
        ]);

        $student->feePayments()->delete();
        $student->courseClass->fees()->where('fee_type', 'Annual Fee')->delete();

        return response()->json(['message' => 'Fee history has been archived.']);
    }

    public function index(User $student)
    {
        return response()->json($student->feeHistory()->latest()->get());
    }

class FeeHistoryController extends Controller
{
    //
}
