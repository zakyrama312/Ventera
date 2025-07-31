<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdiController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\KondisiController;

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

    Route::resource('/prodi', ProdiController::class);
    Route::resource('/kondisi', KondisiController::class);


    Route::get('/ruang', function () {
        return Inertia::render('Ruang/Index');
    })->name('ruang.index');

    Route::get('/kategori', function () {
        return Inertia::render('Kategori/Index');
    })->name('kategori.index');

    // --- Transaksi ---
    Route::get('/barang-masuk', function () {
        return Inertia::render('Transaksi/BarangMasuk');
    })->name('barang-masuk.index');

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
