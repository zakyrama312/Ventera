// resources/js/Pages/pengguna/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import AppLayout from '@/layout/AppLayout';
import type { Pengguna, Prodi } from '@/types';
import { Search, SquarePen, Trash } from 'lucide-react';
import PenggunaModal from './PenggunaModal'; // Komponen modal yang akan dibuat

type PenggunaIndexProps = {
    pengguna: {
        data: Pengguna[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { search?: string };
    prodi: Prodi[]; // Terima data prodi
};

export default function PenggunaIndex({ pengguna, filters, prodi }: PenggunaIndexProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPengguna, setEditingPengguna] = useState<Pengguna | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const penggunaData = useMemo(() => pengguna.data, [pengguna]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('pengguna.index'), { search }, { preserveState: true });
    };

    const openEditModal = (penggunaItem: Pengguna) => {
        setEditingPengguna(penggunaItem);
        setModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingPengguna(null);
        setModalOpen(true);
    };

    const deletePengguna = (penggunaItem: Pengguna) => {
        if (confirm(`Yakin ingin menghapus pengguna "${penggunaItem.name}"?`)) {
            router.delete(route('pengguna.destroy', penggunaItem.id));
        }
    };

    const columns = useMemo<ColumnDef<Pengguna>[]>(
        () => [
            { header: 'No', cell: ({ row }) => row.index + 1 + (pengguna.current_page - 1) * pengguna.per_page },
            { header: 'Nama', accessorKey: 'name' },
            { header: 'Username', accessorKey: 'username' },
            { header: 'Role', accessorKey: 'role' },
            { header: 'Program Studi', cell: ({ row }) => row.original.prodi.nama_prodi },
            {
                header: 'Aksi',
                cell: ({ row }) => (
                    <div className="flex justify-center gap-1">
                        <button
                            className="flex items-center rounded-sm px-3 py-2 text-sm text-amber-400 hover:bg-amber-400 hover:text-white"
                            onClick={() => openEditModal(row.original)}
                        >
                            <SquarePen className="h-4 w-4" />
                        </button>
                        <button
                            className="flex items-center rounded-sm px-3 py-2 text-sm text-red-400 hover:bg-red-400 hover:text-white"
                            onClick={() => deletePengguna(row.original)}
                        >
                            <Trash className="h-4 w-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [pengguna.current_page, pengguna.per_page],
    );

    const table = useReactTable({
        data: penggunaData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <Head title="Pengguna" />
            <PageBreadcrumb pageTitle="Pengguna" />
            <PenggunaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} pengguna={editingPengguna} prodi={prodi} />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <Button onClick={openCreateModal} size="sm">
                        Tambah Pengguna
                    </Button>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau username..."
                            className="w-80"
                        />
                        <Button type="submit">
                            <Search />
                        </Button>
                    </form>
                </div>

                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className={`px-6 py-3 ${header.column.columnDef.header === 'Aksi' ? 'text-center' : ''}`}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="border-b bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                        Halaman {pengguna.current_page} dari {pengguna.last_page}
                    </span>
                    <div className="flex gap-2">
                        {pengguna.links.map((link, index) => (
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

PenggunaIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
