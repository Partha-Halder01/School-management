<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('parent_name')->nullable()->after('name');
            $table->string('phone')->nullable()->after('parent_name');
            $table->foreignId('course_class_id')->nullable()->after('phone')->constrained('course_classes')->onDelete('set null');
            $table->string('roll_no')->nullable()->after('course_class_id');
            $table->string('admission_no')->nullable()->after('roll_no');
            $table->text('address')->nullable()->after('admission_no');
            $table->date('dob')->nullable()->after('address');
            $table->softDeletes();
        });

        // Add Student role
        DB::table('roles')->insert([
            'name' => 'Student',
            'slug' => 'student',
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['course_class_id']);
            $table->dropColumn(['parent_name', 'phone', 'course_class_id', 'roll_no', 'admission_no', 'address', 'dob', 'deleted_at']);
        });
        
        DB::table('roles')->where('slug', 'student')->delete();
    }
};
