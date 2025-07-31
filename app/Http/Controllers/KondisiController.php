<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

use App\Models\Kondisi;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class KondisiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $kondisi = Kondisi::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('nama_kondisi', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('kondisi/index', [
            'kondisi' => $kondisi,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['nama_kondisi' => 'required|string|max:255']);
        Kondisi::create([
            'nama_kondisi' => $request->nama_kondisi,
            'slug' => Str::slug($request->nama_kondisi),
            'prodi_id' => auth()->user()->prodi_id,
        ]);
        return redirect()->route('kondisi.index')->with('message', 'Kondisi berhasil ditambahkan.');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kondisi $kondisi)
    {
        $request->validate(['nama_kondisi' => 'required|string|max:255']);
        $kondisi->update($request->only('nama_kondisi'));
        return redirect()->route('kondisi.index')->with('message', 'Kondisi berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kondisi $kondisi)
    {
        $kondisi->delete();
        return redirect()->route('kondisi.index')->with('message', 'Kondisi berhasil dihapus.');
    }
}
