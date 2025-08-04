import InputError from '@/components/form/input-error';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal/index';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

interface KategoriModalProps {
    isOpen: boolean;
    onClose: () => void;
    kategori: {
        id?: number;
        nama_kategori: string;
    } | null;
}

export default function KategoriModal({ isOpen, onClose, kategori }: KategoriModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_kategori: '',
    });

    const isEditing = !!kategori;

    useEffect(() => {
        if (isEditing && kategori) {
            setData('nama_kategori', kategori.nama_kategori);
        } else {
            reset();
        }
    }, [kategori, isEditing, reset, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                onClose();
                reset();
                router.visit(route('kategori.index'), {
                    preserveState: false, // 🔥 penting supaya layout & sidebar nge-refresh
                });
            },
        };

        if (isEditing) {
            put(route('kategori.update', kategori.id), options);
        } else {
            post(route('kategori.store'), options);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
            <h2 className="mb-4 text-lg font-bold">{isEditing ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <Label htmlFor="nama_kategori">Nama Kategori</Label>
                    <Input
                        id="nama_kategori"
                        value={data.nama_kategori}
                        onChange={(e) => setData('nama_kategori', e.target.value)}
                        className="mt-1 block w-full"
                        autofocus
                    />
                    <InputError message={errors.nama_kategori} className="mt-2" />
                </div>
                <div className="flex justify-end gap-2">
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
