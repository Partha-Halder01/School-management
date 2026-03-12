<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeePayment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'fee_id',
        'student_id',
        'amount_paid',
        'discount',
        'is_paid',
        'due_date',
        'payment_date'
    ];

    protected $casts = [
        'due_date' => 'date',
        'payment_date' => 'date',
        'is_paid' => 'boolean'
    ];

    public function fee()
    {
        return $this->belongsTo(Fee::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
