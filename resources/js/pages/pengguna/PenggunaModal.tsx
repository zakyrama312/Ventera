// resources/js/Pages/pengguna/PenggunaModal.tsx
import InputError from '@/components/form/input-error';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select'; // ✅ SESUAIKAN PATH IMPORT INI
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal/index';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useMemo } from 'react';

// Tipe data ini bisa di-share jika perlu
type Prodi = { id: number; nama_prodi: string };
type Pengguna = { id: number; name: string; username: string; role: 'admin' | 'anggota' | 'kaprodi'; prodi: Prodi; prodi_id: number };
type OptionType = { value: string; label: string };

interface PenggunaModalProps {
    isOpen: boolean;
    onClose: () => void;
    pengguna: Pengguna | null;
    prodi: Prodi[];
}

export default function PenggunaModal({ isOpen, onClose, pengguna, prodi }: PenggunaModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        username: '',
        role: 'anggota' as 'admin' | 'anggota' | 'kaprodi',
        prodi_id: '' as number | '',
        password: '',
        password_confirmation: '',
    });

    const isEditing = !!pengguna;

    // Persiapan options, ini sudah benar
    const prodiOptions: OptionType[] = useMemo(
        () =>
            prodi.map((p) => ({
                // ✅ PERBAIKAN 2: Ubah prodi.id (number) menjadi string saat membuat options
                value: String(p.id),
                label: p.nama_prodi,
            })),
        [prodi],
    );

    const roleOptions: OptionType[] = [
        { value: 'admin', label: 'Admin' },
        { value: 'anggota', label: 'Anggota' },
        { value: 'kaprodi', label: 'Kaprodi' },
    ];

    // Logika useEffect ini sudah benar untuk mengatasi bug "tidak bisa mengetik"
    useEffect(() => {
        if (isOpen) {
            if (isEditing && pengguna) {
                // ✅ SOLUSI: Panggil setData satu per satu untuk setiap field
                setData('name', pengguna.name);
                setData('username', pengguna.username);
                setData('role', pengguna.role);
                setData('prodi_id', pengguna.prodi.id);
                setData('password', '');
                setData('password_confirmation', '');
            } else {
                // Fungsi reset() akan mengembalikan semua field ke nilai awal di useForm
                reset();
            }
        }
    }, [isOpen, pengguna, isEditing, setData, reset]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                onClose();
                reset();
            },
        };

        if (isEditing) {
            put(route('pengguna.update', pengguna.id), options);
        } else {
            post(route('pengguna.store'), options);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl p-6">
            <h2 className="mb-4 text-lg font-bold">{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
            <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Kolom Kiri */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} autofocus />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" value={data.username} onChange={(e) => setData('username', e.target.value)} />
                        <InputError message={errors.username} />
                    </div>
                    <div>
                        <Label htmlFor="role">Role</Label>
                        {/* ✅ PENGGUNAAN SELECT YANG DIPERBAIKI */}
                        <Select
                            options={roleOptions}
                            placeholder="Pilih Role"
                            defaultValue={data.role}
                            onChange={(value) => setData('role', value as 'admin' | 'anggota' | 'kaprodi')}
                        />
                        <InputError message={errors.role} />
                    </div>
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="prodi_id">Program Studi</Label>
                        {/* ✅ PENGGUNAAN SELECT YANG DIPERBAIKI */}
                        <Select
                            options={prodiOptions}
                            placeholder="Pilih Prodi"
                            defaultValue={data.prodi_id ? String(data.prodi_id) : ''}
                            onChange={(value) => setData('prodi_id', Number(value))}
                        />
                        <InputError message={errors.prodi_id} />
                    </div>
                    <div>
                        <Label htmlFor="password">Password {isEditing && '(Opsional)'}</Label>
                        <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        <InputError message={errors.password} />
                    </div>
                    <div>
                        <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="col-span-1 flex justify-end gap-2 md:col-span-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
