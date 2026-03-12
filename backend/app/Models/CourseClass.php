<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseClass extends Model
{
    protected $guarded = [];

    public function fees()
    {
        return $this->hasMany(Fee::class);
    }
    
    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }
}
