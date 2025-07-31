<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kondisi extends Model
{
    protected $table = 'kondisi';

    protected $primaryKey = 'id';
    protected $fillable = [
        'prodi_id',
        'nama_kondisi',
        'slug'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($kondisi) {
            $kondisi->slug = str()->slug($kondisi->nama_kondisi);
        });
        static::updating(function ($kondisi) {
            $kondisi->slug = str()->slug($kondisi->nama_kondisi);
        });
    }
}
