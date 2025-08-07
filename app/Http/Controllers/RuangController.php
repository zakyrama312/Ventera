<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Ruang; // Ganti ke model Ruang
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RuangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $ruang = Ruang::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('nama_ruang', 'like', "%{$search}%"); // Ganti nama kolom
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('ruang/index', [ // Ganti path view ke 'ruang/index'
            'ruang' => $ruang,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['nama_ruang' => 'required|string|max:255']); // Ganti validasi
        Ruang::create([
            'nama_ruang' => $request->nama_ruang, // Ganti nama field
            'slug' => Str::slug($request->nama_ruang),
            'prodi_id' => auth()->user()->prodi_id,
        ]);
        return redirect()->route('ruang.index')->with('message', 'Ruang berhasil ditambahkan.'); // Ganti route dan pesan

    }

    /**
     * Display the specified resource.
     */
    public function show(Ruang $ruang) // Ganti type-hint
    {
        $inventaris = Barang::where('ruang_id', $ruang->id)
            ->with(['kategori', 'kondisi']) // contoh eager loading
            ->paginate(10);

        // Render halaman view, kirimkan data ruang saat ini dan data inventarisnya
        return Inertia::render('ruang/data', [
            'ruang' => $ruang,
            'inventaris' => $inventaris,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ruang $ruang) // Ganti type-hint
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ruang $ruang) // Ganti type-hint
    {
        $request->validate(['nama_ruang' => 'required|string|max:255']); // Ganti validasi
        $ruang->update([
            'nama_ruang' => $request->nama_ruang,
            'slug' => Str::slug($request->nama_ruang), // Sebaiknya slug juga diupdate
        ]);
        return redirect()->route('ruang.index')->with('message', 'Ruang berhasil diupdate.'); // Ganti route dan pesan
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ruang $ruang) // Ganti type-hint
    {
        $ruang->delete();
        return redirect()->route('ruang.index')->with('message', 'Ruang berhasil dihapus.');
    }
}
