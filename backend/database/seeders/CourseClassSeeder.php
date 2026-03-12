<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\CourseClass;

class CourseClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = [
            'LKG',
            'UKG',
            'Class I',
            'Class II',
            'Class III',
            'Class IV',
            'Class V',
            'Class VI',
            'Class VII',
            'Class VIII',
            'Alim (IX-X)',
            'Fazil (XI-XII)',
        ];

        foreach ($classes as $className) {
            CourseClass::updateOrCreate(
                ['name' => $className],
                [
                    'section' => null,
                    'tuition_fee' => 0,
                    'is_active' => true
                ]
            );
        }
    }
}
