<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fee;
use App\Models\FeePayment;
use Illuminate\Http\Request;

class FeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Fee::with('courseClass');
        if($request->class_id) {
            $query->where('course_class_id', $request->class_id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_class_id' => 'required|exists:course_classes,id',
            'fee_type' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'months' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $fee = Fee::create($validated);
        return response()->json(['message' => 'Fee structure updated securely.', 'data' => $fee]);
    }

    public function show(Fee $fee)
    {
        return response()->json($fee->load('courseClass'));
    }

    public function payments(Request $request)
    {
        $query = FeePayment::with(['fee.courseClass', 'student']);
        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }
        return response()->json($query->latest()->get());
    }

    public function recordPayment(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
            'amount_paid' => 'required|numeric|min:1',
            'total_fee' => 'required|numeric|min:0',
            'discount' => 'numeric|min:0',
            'payment_date' => 'required|date'
        ]);

        $student = \App\Models\User::findOrFail($validated['student_id']);

        $fee = Fee::firstOrCreate(
            [
                'course_class_id' => $student->course_class_id,
                'fee_type' => 'Annual Fee'
            ],
            [
                'amount' => $validated['total_fee']
            ]
        );

        if ($fee->wasRecentlyCreated) {
            $fee->amount = $validated['total_fee'];
            $fee->save();
        }

        $validated['fee_id'] = $fee->id;
        $validated['is_paid'] = true;
        
        $payment = FeePayment::create($validated);

        // Check if the balance is zero and archive if necessary
        $totalFees = $student->courseClass->fees->where('fee_type', 'Annual Fee')->sum('amount');
        $totalPaid = $student->feePayments()->sum('amount_paid');
        if ($totalFees - $totalPaid <= 0) {
            app(FeeHistoryController::class)->archiveFees($student);
        }

        return response()->json(['message' => 'Payment tracked successfully', 'data' => $payment]);
    }

    public function deletePayment(FeePayment $payment)
    {
        $payment->delete();
        return response()->json(['message' => 'Payment record deleted.']);
    }

    public function getStudentFeeSummary($studentId)
    {
        $student = \App\Models\User::with('courseClass.fees')->findOrFail($studentId);
        $totalFees = $student->courseClass->fees->where('fee_type', 'Annual Fee')->sum('amount');
        $totalPaid = $student->feePayments()->sum('amount_paid');
        $totalDiscount = $student->feePayments()->sum('discount');
        $balance = $totalFees - ($totalPaid + $totalDiscount);

        return response()->json([
            'total_fees' => $totalFees,
            'total_paid' => $totalPaid,
            'total_discount' => $totalDiscount,
            'balance' => $balance,
            'fees' => $student->courseClass->fees,
            'payments' => $student->feePayments
        ]);
    }

    public function completeYear($studentId)
    {
        $student = \App\Models\User::findOrFail($studentId);
        $student->feePayments()->update(['archived' => true]);
        return response()->json(['message' => 'Fee records for the year have been archived.']);
    }
}
