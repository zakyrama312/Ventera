<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangStoks extends Model
{
    protected $table = 'barang_stoks';
    protected $fillable = [
        'barang_id',
        'prodi_id',
        'stok_masuk',
        'total_stok',
        'stok_keluar'
    ];

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }
}
