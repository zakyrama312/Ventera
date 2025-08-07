<?php

namespace App\Http\Controllers;

use App\Models\User; // Laravel sudah menyediakan model User
use App\Models\Prodi; // Asumsi Anda punya model Prodi
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PenggunaController extends Controller
{
    public function index(Request $request)
    {
        $pengguna = User::query()
            ->with('prodi') // Eager load relasi prodi untuk ditampilkan di tabel
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('pengguna/index', [
            'pengguna' => $pengguna,
            'filters' => $request->only(['search']),
            'prodi' => Prodi::all(), // Kirim data prodi untuk form modal
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => ['required', Rule::in(['admin', 'anggota', 'kaprodi'])], // Sesuaikan role jika ada yg lain
            'prodi_id' => 'required|exists:prodi,id',
        ]);

        User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password), // Password harus di-hash
            'role' => $request->role,
            'prodi_id' => $request->prodi_id,
        ]);

        return redirect()->route('pengguna.index')->with('message', 'Pengguna berhasil ditambahkan.');
    }

    public function update(Request $request, User $pengguna)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($pengguna->id)],
            'password' => ['nullable', 'confirmed', Password::min(6)], // Password opsional saat update
            'role' => ['required', Rule::in(['admin', 'anggota', 'kaprodi'])],
            'prodi_id' => 'required|exists:prodi,id',
        ]);

        $pengguna->update([
            'name' => $request->name,
            'username' => $request->username,
            'role' => $request->role,
            'prodi_id' => $request->prodi_id,
        ]);

        // Hanya update password jika diisi
        if ($request->filled('password')) {
            $pengguna->update([
                'password' => Hash::make($request->password),
            ]);
        }

        return redirect()->route('pengguna.index')->with('message', 'Pengguna berhasil diupdate.');
    }

    public function destroy(User $pengguna)
    {
        // Tambahkan validasi agar tidak bisa menghapus diri sendiri
        if ($pengguna->id === auth()->id()) {
            return redirect()->route('pengguna.index')->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        $pengguna->delete();
        return redirect()->route('pengguna.index')->with('message', 'Pengguna berhasil dihapus.');
    }
}
