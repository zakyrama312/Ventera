<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';
    protected $primaryKey = 'id';
    protected $fillable = [
        'prodi_id',
        'kategori_id',
        'kondisi_id',
        'ruang_id',
        'nama_barang',
        'slug',
        'kode_barang',
        'merk',
        'ukuran',
        'bahan',
        'spesifikasi',
        'tahun_pengadaan',
        'keterangan'
    ];
    public function barang_stoks()
    {
        return $this->hasMany(BarangStoks::class);
    }

    // Relasi lainnya untuk mempermudah
    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }
    public function kondisi()
    {
        return $this->belongsTo(Kondisi::class);
    }
    public function ruang()
    {
        return $this->belongsTo(Ruang::class);
    }
}
