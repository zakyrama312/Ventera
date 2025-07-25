<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prodi extends Model
{
    protected $table = 'prodi';
    protected $primaryKey = 'id';
    protected $fillable = [
        'nama_prodi',
        'slug'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($prodi) {
            $prodi->slug = str()->slug($prodi->nama_prodi);
        });
        static::updating(function ($prodi) {
            $prodi->slug = str()->slug($prodi->nama_prodi);
        });
    }
    public function kategori()
    {
        return $this->hasMany(Kategori::class);
    }
    public function user()
    {
        return $this->hasMany(User::class);
    }
}
