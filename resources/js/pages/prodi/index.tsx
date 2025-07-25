// resources/js/Pages/Prodi/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import AppLayout from '@/layout/AppLayout';
import { Search, SquarePen, Trash } from 'lucide-react';
import ProdiModal from './ProdiModal';

type Prodi = {
    id: number;
    nama_prodi: string;
};

type ProdiIndexProps = {
    prodi: {
        data: Prodi[];
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
    filters: {
        search?: string;
    };
};

export default function ProdiIndex({ prodi, filters }: ProdiIndexProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProdi, setEditingProdi] = useState<Prodi | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const prodiData = useMemo(() => prodi.data, [prodi]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('prodi.index'), { search }, { preserveState: true });
    };

    const openEditModal = (prodiItem: Prodi) => {
        setEditingProdi(prodiItem);
        setModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingProdi(null);
        setModalOpen(true);
    };

    const deleteProdi = (prodiItem: Prodi) => {
        if (confirm(`Yakin ingin menghapus prodi "${prodiItem.nama_prodi}"?`)) {
            router.delete(route('prodi.destroy', prodiItem.id));
        }
    };

    const columns = useMemo<ColumnDef<(typeof prodiData)[0]>[]>(
        () => [
            { header: 'No', cell: ({ row }) => row.index + 1 },
            { header: 'Nama Prodi', accessorKey: 'nama_prodi' },
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
                            onClick={() => deleteProdi(row.original)}
                        >
                            <Trash className="h-4 w-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    const table = useReactTable({
        data: prodiData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <Head title="Prodi" />
            <PageBreadcrumb pageTitle="Prodi" />
            <ProdiModal isOpen={modalOpen} onClose={() => setModalOpen(false)} prodi={editingProdi} />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <Button onClick={openCreateModal} size="sm">
                        Tambah Prodi
                    </Button>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari prodi..." className="w-80" />
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
                            <tr key={row.id} className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                        Halaman {prodi.current_page} dari {prodi.last_page}
                    </span>
                    <div className="flex gap-2">
                        {prodi.links.map((link, index) => (
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

ProdiIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
