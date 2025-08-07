<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdiController;
use App\Http\Controllers\RuangController;
use App\Http\Controllers\KondisiController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\BarangController;

Route::get('/', function () {
    return Inertia::render('AuthPages/SignIn'); // Atau dari Controller
})->name('login');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard'); // Atau dari Controller
    })->name('dashboard');

    // --- Master Data ---
    Route::get('/users', function () {
        return Inertia::render('users/index'); // Contoh path komponen
    })->name('users.index');

    Route::resource('/pengguna', PenggunaController::class);
    Route::resource('/prodi', ProdiController::class);
    Route::resource('/kondisi', KondisiController::class);
    Route::resource('/kategori', KategoriController::class);
    Route::resource('/ruang', RuangController::class);
    Route::get('/ruang/{ruang:slug}', [RuangController::class, 'show'])
        ->name('ruang.data');

    // --- Transaksi ---
    Route::resource('barang-masuk', BarangController::class);

    Route::get('/peminjaman', function () {
        return Inertia::render('Transaksi/Peminjaman');
    })->name('peminjaman.index');

    Route::get('/permintaan', function () {
        return Inertia::render('Transaksi/Permintaan');
    })->name('permintaan.index');

    // --- Laporan ---
    Route::get('/laporan/barang-masuk', function () {
        return Inertia::render('Laporan/BarangMasuk');
    })->name('laporan.barang-masuk');

    Route::get('/laporan/peminjaman', function () {
        return Inertia::render('Laporan/Peminjaman');
    })->name('laporan.peminjaman');

    // Tambahkan route untuk profile jika ada
    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
