<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

\App\Models\User::updateOrCreate(
    ['email' => 'admin@schoolcms.com'],
    [
        'name' => 'Admin User',
        'password' => \Illuminate\Support\Facades\Hash::make('password'),
        'role_id' => 1
    ]
);

echo "Admin User successfully created!\n";
