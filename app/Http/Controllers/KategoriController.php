<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Kategori;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $kategori = Kategori::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('nama_kategori', 'like', "%{$search}%"); // Ganti nama kolom
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('kategori/index', [ // Ganti path view ke 'kategori/Index'
            'kategori' => $kategori,
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
        $request->validate(['nama_kategori' => 'required|string|max:255']); // Ganti validasi
        Kategori::create([
            'nama_kategori' => $request->nama_kategori, // Ganti nama field
            'slug' => Str::slug($request->nama_kategori),
            'prodi_id' => auth()->user()->prodi_id,
        ]);
        return redirect()->route('kategori.index')->with('message', 'Kategori berhasil ditambahkan.'); // Ganti route dan pesan

    }

    /**
     * Display the specified resource.
     */
    public function show(Kategori $kategori)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kategori $kategori)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kategori $kategori)
    {
        $request->validate(['nama_kategori' => 'required|string|max:255']); // Ganti validasi
        $kategori->update([
            'nama_kategori' => $request->nama_kategori,
            'slug' => Str::slug($request->nama_kategori), // Sebaiknya slug juga diupdate
        ]);
        return redirect()->route('kategori.index')->with('message', 'Kategori berhasil diupdate.'); // Ganti route dan pesan
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kategori $kategori)
    {
        $kategori->delete();
        return redirect()->route('kategori.index')->with('message', 'Kategori berhasil dihapus.');
    }
}
