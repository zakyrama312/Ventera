<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Ruang;
use App\Models\Barang;
use App\Models\Kondisi;
use App\Models\Kategori;
use App\Models\BarangStoks;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $barangMasuk = BarangStoks::with('barang', 'barang.kondisi', 'barang.ruang')
            ->where('prodi_id', auth()->user()->prodi_id)
            ->where('stok_masuk', '>', 0) // Hanya tampilkan histori stok masuk
            ->when($request->input('search'), function ($query, $search) {
                $query->whereHas('barang', function ($barangQuery) use ($search) {
                    $barangQuery->where('nama_barang', 'like', "%{$search}%")
                        ->orWhere('merk', 'like', "%{$search}%")
                        // Cari juga di tabel relasi ruang
                        ->orWhereHas('ruang', function ($ruangQuery) use ($search) {
                            $ruangQuery->where('nama_ruang', 'like', "%{$search}%");
                        })
                        // Cari juga di tabel relasi kondisi
                        ->orWhereHas('kondisi', function ($kondisiQuery) use ($search) {
                            $kondisiQuery->where('nama_kondisi', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('barang-masuk/index', [
            'barangMasuk' => $barangMasuk,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $prodiId = auth()->user()->prodi_id;
        return Inertia::render('barang-masuk/create', [
            'kategoris' => Kategori::where('prodi_id', $prodiId)->get(),
            'kondisis' => Kondisi::where('prodi_id', $prodiId)->get(),
            'ruangs' => Ruang::where('prodi_id', $prodiId)->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'kode_barang' => 'nullable|string|max:255',
            'kategori_id' => 'required|exists:kategori,id',
            'kondisi_id' => 'required|exists:kondisi,id',
            'ruang_id' => 'required|exists:ruang,id',
            'merk' => 'nullable|string|max:50',
            'ukuran' => 'nullable|string|max:50',
            'bahan' => 'nullable|string|max:50',
            'tahun_pengadaan' => 'nullable|digits:4|integer|min:1900',
            'keterangan' => 'nullable|string',
            'spesifikasi' => 'nullable|string',
            'stok_masuk' => 'required|integer',
        ]);

        // Gunakan DB Transaction untuk memastikan konsistensi data
        DB::transaction(function () use ($request) {
            // 1. Simpan data ke tabel `barangs`
            $barang = Barang::create([
                'nama_barang' => $request->nama_barang,
                'slug' => Str::slug($request->nama_barang) . '-' . uniqid(),
                'kode_barang' => $request->kode_barang,
                'kategori_id' => $request->kategori_id,
                'kondisi_id' => $request->kondisi_id,
                'ruang_id' => $request->ruang_id,
                'merk' => $request->merk,
                'ukuran' => $request->ukuran,
                'bahan' => $request->bahan,
                'tahun_pengadaan' => $request->tahun_pengadaan,
                'keterangan' => $request->keterangan,
                'spesifikasi' => $request->spesifikasi,
                'prodi_id' => auth()->user()->prodi_id,
            ]);

            if (!$barang->id) {
                throw new \Exception('Gagal insert ke barangs, cek data!');
            }
            // 2. Simpan data ke tabel `barang_stoks`
            BarangStoks::create([
                'barang_id' => $barang->id, // Ambil ID dari barang yang baru dibuat
                'prodi_id' => auth()->user()->prodi_id,
                'stok_masuk' => $request->stok_masuk,
                'total_stok' => $request->stok_masuk, // Diasumsikan total stok saat ini = stok masuk
                'stok_keluar' => 0,
            ]);
        });

        return redirect()->route('barang-masuk.index')->with('message', 'Barang masuk berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Barang $barang)
    {
        $barang->load(['kategori', 'kondisi', 'ruang', 'prodi']);

        // Hitung total stok saat ini dari tabel barang_stoks
        $stokTerkini = BarangStoks::where('barang_id', $barang->id)->sum(DB::raw('stok_masuk - stok_keluar'));

        // Kembalikan sebagai JSON
        return response()->json([
            'barang' => $barang,
            'stok' => $stokTerkini,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Barang $barang)
    {
        $prodiId = auth()->user()->prodi_id;

        // Ambil data stok masuk awal dari record pertama
        $barang->load(['barang_stoks' => function ($query) {
            $query->orderBy('created_at', 'asc')->first();
        }]);

        return Inertia::render('barang-masuk/edit', [
            'barang' => $barang,
            'kategoris' => Kategori::where('prodi_id', $prodiId)->get(),
            'kondisis' => Kondisi::where('prodi_id', $prodiId)->get(),
            'ruangs' => Ruang::where('prodi_id', $prodiId)->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Barang $barang)
    {
        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'kode_barang' => 'nullable|string|max:255',
            'kategori_id' => 'required|exists:kategori,id',
            'kondisi_id' => 'required|exists:kondisi,id',
            'ruang_id' => 'required|exists:ruang,id',
            'merk' => 'nullable|string|max:50',
            'ukuran' => 'nullable|string|max:50',
            'bahan' => 'nullable|string|max:50',
            'tahun_pengadaan' => 'nullable|digits:4|integer|min:1900',
            'keterangan' => 'nullable|string',
            'spesifikasi' => 'nullable|string',
            'stok_masuk' => 'required|integer',
        ]);

        DB::transaction(function () use ($request, $barang) {
            // 1. Update data di tabel `barangs`
            $barang->update($request->except('stok_masuk'));

            // 2. Update data stok masuk di record `barang_stoks` yang pertama
            $stokAwal = $barang->barang_stoks()->orderBy('created_at', 'asc')->first();
            if ($stokAwal) {
                $stokAwal->update(['stok_masuk' => $request->stok_masuk]);
            }
        });

        return redirect()->route('barang-masuk.index')->with('message', 'Data barang berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barang $barang)
    {
        DB::transaction(function () use ($barang) {
            // 1. Hapus semua histori stok yang berhubungan
            $barang->barang_stoks()->delete();
            // 2. Hapus data barang itu sendiri
            $barang->delete();
        });

        return redirect()->route('barang-masuk.index')->with('message', 'Data barang berhasil dihapus.');
    }
}
