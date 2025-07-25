<?php

namespace App\Http\Controllers;

use App\Models\Prodi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $prodi = Prodi::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('nama_prodi', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('prodi/index', [
            'prodi' => $prodi,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['nama_prodi' => 'required|string|max:255']);
        Prodi::create($request->only('nama_prodi'));
        return redirect()->route('prodi.index')->with('message', 'Prodi berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Prodi $prodi)
    {
        $request->validate(['nama_prodi' => 'required|string|max:255']);
        $prodi->update($request->only('nama_prodi'));
        return redirect()->route('prodi.index')->with('message', 'Prodi berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Prodi $prodi)
    {
        $prodi->delete();
        return redirect()->route('prodi.index')->with('message', 'Prodi berhasil dihapus.');
    }
}
