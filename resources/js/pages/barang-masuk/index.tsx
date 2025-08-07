// resources/js/Pages/barang-masuk/Index.tsx
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import AppLayout from '@/layout/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

// Definisikan tipe datanya
type Kondisi = { id: number; nama_kondisi: string };
type Ruang = { id: number; nama_ruang: string };
type Barang = { id: number; nama_barang: string; merk: string; ruang: Ruang; kondisi: Kondisi };
type BarangMasuk = { id: number; stok_masuk: number; created_at: string; barang: Barang };
type PaginatedBarangMasuk = {
    data: BarangMasuk[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

interface IndexProps {
    barangMasuk: PaginatedBarangMasuk;
    filters: {
        search: string;
    };
}

export default function BarangMasukIndex({ barangMasuk, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Kirim request ke server dengan nilai search baru
            // `preserveState: true` agar tidak kehilangan fokus dari input
            // `replace: true` agar history browser tidak penuh
            router.get(route('barang-masuk.index'), { search }, { preserveState: true, replace: true });
        }, 300); // Tunggu 300ms setelah user berhenti mengetik

        // Cleanup function untuk membatalkan timeout jika user mengetik lagi
        return () => clearTimeout(timeoutId);
    }, [search]);
    return (
        <>
            <Head title="Histori Barang Masuk" />
            <PageBreadcrumb pageTitle="Histori Barang Masuk" />

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                    <Link href={route('barang-masuk.create')}>
                        <Button>Tambah Barang Masuk</Button>
                    </Link>
                    <div className="relative">
                        <Input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari..." className="w-80 pl-10" />
                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-700">
                        <tr>
                            <th className="px-6 py-3">Tanggal Masuk</th>
                            <th className="px-6 py-3">Nama Barang</th>
                            <th className="px-6 py-3">Merk</th>
                            <th className="px-6 py-3 text-center">Jumlah Masuk</th>
                            <th className="px-6 py-3 text-center">Kondisi</th>
                            <th className="px-6 py-3 text-center">Ruang</th>
                        </tr>
                    </thead>
                    <tbody>
                        {barangMasuk.data.map((item) => (
                            <tr key={item.id} className="border-b bg-white hover:bg-gray-100">
                                <td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                <td className="px-6 py-4">{item.barang.nama_barang}</td>
                                <td className="px-6 py-4">{item.barang.merk || '-'}</td>
                                <td className="px-6 py-4 text-center">{item.stok_masuk}</td>
                                <td className="px-6 py-4 text-center">{item.barang.kondisi.nama_kondisi}</td>
                                <td className="px-6 py-4 text-center">{item.barang.ruang.nama_ruang}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Anda bisa menambahkan komponen pagination di sini */}
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                        Halaman {barangMasuk.current_page} dari {barangMasuk.last_page}
                    </span>
                    <div className="flex gap-2">
                        {barangMasuk.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded border px-3 py-1 ${link.active ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'} ${!link.url ? 'cursor-not-allowed text-gray-400' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveState
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

BarangMasukIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
