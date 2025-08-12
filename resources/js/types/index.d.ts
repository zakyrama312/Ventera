import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// resources/js/types/index.d.ts

export type Prodi = {
    id: number;
    nama_prodi: string;
};

export type Pengguna = {
    id: number;
    name: string;
    username: string;
    role: 'admin' | 'anggota' | 'kaprodi';
    prodi: Prodi; // Relasi ke prodi
    prodi_id: number;
};

export type BarangDetail = {
    barang: Barang; // Pastikan tipe Barang juga sudah lengkap di file ini
    stok_masuk: number;
    total_stok: number;
    stok_keluar: number;
};

export type Barang = {
    id: number;
    nama_barang: string;
    kode_barang: string;
    merk: string;
    spesifikasi: string;
    tahun_pengadaan: string;
    keterangan: string;
    kondisi: Kondisi; // Relasi ke kondisi
    kondisi_id: number;
    kategori: Kategori; // Relasi ke kategori
    kategori_id: number;
    ruang: Ruang; // Relasi ke ruang
    ruang_id: number;
};
