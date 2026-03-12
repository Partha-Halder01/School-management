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
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('candidate_name');
            $table->string('parent_name')->nullable();
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('class_applied');
            $table->text('details')->nullable();
            $table->string('status')->default('Pending'); // Pending, Approved, FollowUp
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enquiries');
    }
};
