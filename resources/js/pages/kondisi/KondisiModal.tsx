import InputError from '@/components/form/input-error';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal/index'; // pastikan path-nya sesuai
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

interface KondisiModalProps {
    isOpen: boolean;
    onClose: () => void;
    kondisi: {
        id?: number;
        nama_kondisi: string;
    } | null;
}

export default function KondisiModal({ isOpen, onClose, kondisi }: KondisiModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_kondisi: '',
    });

    const isEditing = !!kondisi;

    useEffect(() => {
        if (isEditing && kondisi) {
            setData('nama_kondisi', kondisi.nama_kondisi);
        } else {
            reset();
        }
    }, [kondisi, isEditing, reset, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                onClose();
                reset();
            },
        };

        if (isEditing) {
            put(route('kondisi.update', kondisi.id), options);
        } else {
            post(route('kondisi.store'), options);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
            <h2 className="mb-4 text-lg font-bold">{isEditing ? 'Edit Kondisi' : 'Tambah Kondisi'}</h2>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <Label htmlFor="nama_kondisi">Nama Kondisi</Label>
                    <Input
                        id="nama_kondisi"
                        value={data.nama_kondisi}
                        onChange={(e) => setData('nama_kondisi', e.target.value)}
                        className="mt-1 block w-full"
                        autofocus
                    />
                    <InputError message={errors.nama_kondisi} className="mt-2" />
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
