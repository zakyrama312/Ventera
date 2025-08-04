<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $table = 'kategori';
    protected $primaryKey = 'id';
    protected $fillable = [
        'prodi_id',
        'nama_kategori',
        'slug'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($kategori) {
            $kategori->slug = str()->slug($kategori->nama_kategori);
        });
        static::updating(function ($kategori) {
            $kategori->slug = str()->slug($kategori->nama_kategori);
        });
    }
}
