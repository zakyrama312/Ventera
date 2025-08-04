// resources/js/Pages/kondisi/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import AppLayout from '@/layout/AppLayout';
import { Search, SquarePen, Trash } from 'lucide-react';
import KondisiModal from './KondisiModal';

type Kondisi = {
    id: number;
    nama_kondisi: string;
};

type KondisiIndexProps = {
    kondisi: {
        data: Kondisi[];
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

export default function KondisiIndex({ kondisi, filters }: KondisiIndexProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingKondisi, setEditingKondisi] = useState<Kondisi | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const kondisiData = useMemo(() => kondisi.data, [kondisi]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('kondisi.index'), { search }, { preserveState: true });
    };

    const openEditModal = (kondisiItem: Kondisi) => {
        setEditingKondisi(kondisiItem);
        setModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingKondisi(null);
        setModalOpen(true);
    };

    const deleteKondisi = (kondisiItem: Kondisi) => {
        if (confirm(`Yakin ingin menghapus kondisi "${kondisiItem.nama_kondisi}"?`)) {
            router.delete(route('kondisi.destroy', kondisiItem.id), {
                onSuccess: () => {
                    router.visit(route('kondisi.index'), {
                        preserveState: false,
                    });
                },
            });
        }
    };

    const columns = useMemo<ColumnDef<(typeof kondisiData)[0]>[]>(
        () => [
            { header: 'No', cell: ({ row }) => row.index + 1 },
            { header: 'Nama Kondisi', accessorKey: 'nama_kondisi' },
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
                            onClick={() => deleteKondisi(row.original)}
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
        data: kondisiData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <Head title="Kondisi" />
            <PageBreadcrumb pageTitle="Kondisi" />
            <KondisiModal isOpen={modalOpen} onClose={() => setModalOpen(false)} kondisi={editingKondisi} />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <Button onClick={openCreateModal} size="sm">
                        Tambah Kondisi
                    </Button>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kondisi..."
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

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                        Halaman {kondisi.current_page} dari {kondisi.last_page}
                    </span>
                    <div className="flex gap-2">
                        {kondisi.links.map((link, index) => (
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

KondisiIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
