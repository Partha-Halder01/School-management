<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeHistory extends Model
{
    protected $fillable = [
        'student_id',
        'total_fee',
        'total_paid',
        'academic_year',
        'payment_details',
    ];

    protected $casts = [
        'payment_details' => 'array',
    ];
}
