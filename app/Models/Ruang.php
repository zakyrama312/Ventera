<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ruang extends Model
{
    protected $table = 'ruang';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];


    protected static function boot()
    {
        parent::boot();
        static::creating(function ($ruang) {
            $ruang->slug = str()->slug($ruang->nama_ruang);
        });
        static::updating(function ($ruang) {
            $ruang->slug = str()->slug($ruang->nama_ruang);
        });
    }
}
