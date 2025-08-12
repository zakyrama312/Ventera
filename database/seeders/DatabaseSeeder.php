<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Prodi;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        Prodi::create([
            'nama_prodi' => 'PPLG'
        ]);
        User::create([
            'name' => 'Zaky Rama',
            'username' => 'zakyrama',
            'password' => bcrypt('zakyrama'),
            'role' => 'admin',
            'prodi_id' => 1
        ]);
    }
}
