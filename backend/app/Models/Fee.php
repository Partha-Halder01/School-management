<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fee extends Model
{
    protected $guarded = [];

    public function courseClass()
    {
        return $this->belongsTo(CourseClass::class);
    }

    public function feePayments()
    {
        return $this->hasMany(FeePayment::class);
    }
}
