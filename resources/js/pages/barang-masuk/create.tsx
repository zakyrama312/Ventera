// resources/js/Pages/barang-masuk/Create.tsx
import InputError from '@/components/form/input-error';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select'; // Gunakan komponen Select Anda
import Button from '@/components/ui/button/Button';
import AppLayout from '@/layout/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';

// Definisikan tipe untuk props
type Option = { id: number; [key: string]: any };
interface CreateProps {
    kategoris: Option[];
    kondisis: Option[];
    ruangs: Option[];
}

export default function BarangMasukCreate({ kategoris, kondisis, ruangs }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        nama_barang: '',
        kode_barang: '',
        merk: '',
        ukuran: '',
        bahan: '',
        tahun_pengadaan: '',
        keterangan: '',
        spesifikasi: '',
        stok_masuk: 1,
        kategori_id: '',
        kondisi_id: '',
        ruang_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('barang-masuk.store'));
    };

    // Helper untuk membuat options
    const createOptions = (items: Option[], labelKey: string) => items.map((item) => ({ value: String(item.id), label: item[labelKey] }));

    return (
        <>
            <Head title="Tambah Barang Masuk" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="mb-4 text-xl font-bold">Form Tambah Barang Masuk</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Kolom Kiri */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="nama_barang">Nama Barang*</Label>
                                <Input id="nama_barang" value={data.nama_barang} onChange={(e) => setData('nama_barang', e.target.value)} />
                                <InputError message={errors.nama_barang} />
                            </div>
                            <div>
                                <Label htmlFor="stok_masuk">Jumlah Masuk*</Label>
                                <Input
                                    type="number"
                                    id="stok_masuk"
                                    value={data.stok_masuk}
                                    onChange={(e) => setData('stok_masuk', Number(e.target.value))}
                                />
                                <InputError message={errors.stok_masuk} />
                            </div>
                            <div>
                                <Label htmlFor="kategori_id">Kategori*</Label>
                                <Select options={createOptions(kategoris, 'nama_kategori')} onChange={(val) => setData('kategori_id', val)} />
                                <InputError message={errors.kategori_id} />
                            </div>
                            <div>
                                <Label htmlFor="kondisi_id">Kondisi*</Label>
                                <Select options={createOptions(kondisis, 'nama_kondisi')} onChange={(val) => setData('kondisi_id', val)} />
                                <InputError message={errors.kondisi_id} />
                            </div>
                            <div>
                                <Label htmlFor="ruang_id">Ruang*</Label>
                                <Select options={createOptions(ruangs, 'nama_ruang')} onChange={(val) => setData('ruang_id', val)} />
                                <InputError message={errors.ruang_id} />
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="kode_barang">Kode Barang</Label>
                                <Input id="kode_barang" value={data.kode_barang} onChange={(e) => setData('kode_barang', e.target.value)} />
                                <InputError message={errors.kode_barang} />
                            </div>
                            <div>
                                <Label htmlFor="merk">Merk</Label>
                                <Input id="merk" value={data.merk} onChange={(e) => setData('merk', e.target.value)} />
                                <InputError message={errors.merk} />
                            </div>
                            <div>
                                <Label htmlFor="tahun_pengadaan">Tahun Pengadaan*</Label>
                                <Input
                                    type="number"
                                    id="tahun_pengadaan"
                                    value={data.tahun_pengadaan}
                                    onChange={(e) => setData('tahun_pengadaan', e.target.value)}
                                />
                                <InputError message={errors.tahun_pengadaan} />
                            </div>
                            <div>
                                <Label htmlFor="spesifikasi">Spesifikasi</Label>
                                <TextArea
                                    value={data.spesifikasi}
                                    onChange={(value) => setData('spesifikasi', value)}
                                    className="input-field"
                                    rows={6}
                                />
                                <InputError message={errors.spesifikasi} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Barang'}
                        </Button>
                        <Link href={route('barang-masuk.index')}>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

BarangMasukCreate.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
