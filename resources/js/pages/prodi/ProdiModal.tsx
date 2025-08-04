import InputError from '@/components/form/input-error';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal/index'; // pastikan path-nya sesuai
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

interface ProdiModalProps {
    isOpen: boolean;
    onClose: () => void;
    prodi: {
        id?: number;
        nama_prodi: string;
    } | null;
}

export default function ProdiModal({ isOpen, onClose, prodi }: ProdiModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_prodi: '',
    });

    const isEditing = !!prodi;

    useEffect(() => {
        if (isEditing && prodi) {
            setData('nama_prodi', prodi.nama_prodi);
        } else {
            reset();
        }
    }, [prodi, isEditing, reset, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                onClose();
                reset();
                router.visit(route('prodi.index'), {
                    preserveState: false, // 🔥 penting supaya layout & sidebar nge-refresh
                });
            },
        };

        if (isEditing) {
            put(route('prodi.update', prodi.id), options);
        } else {
            post(route('prodi.store'), options);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
            <h2 className="mb-4 text-lg font-bold">{isEditing ? 'Edit Prodi' : 'Tambah Prodi'}</h2>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <Label htmlFor="nama_prodi">Nama Prodi</Label>
                    <Input
                        id="nama_prodi"
                        value={data.nama_prodi}
                        onChange={(e) => setData('nama_prodi', e.target.value)}
                        className="mt-1 block w-full"
                        autofocus
                    />
                    <InputError message={errors.nama_prodi} className="mt-2" />
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
