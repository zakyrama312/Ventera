import InputError from '@/components/form/input-error';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal/index';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

interface RuangModalProps {
    isOpen: boolean;
    onClose: () => void;
    ruang: {
        id?: number;
        nama_ruang: string;
    } | null;
}

export default function RuangModal({ isOpen, onClose, ruang }: RuangModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_ruang: '',
    });

    const isEditing = !!ruang;

    useEffect(() => {
        if (isEditing && ruang) {
            setData('nama_ruang', ruang.nama_ruang);
        } else {
            reset();
        }
    }, [ruang, isEditing, reset, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                onClose();
                reset();
                router.visit(route('ruang.index'), {
                    preserveState: false, // 🔥 penting supaya layout & sidebar nge-refresh
                });
            },
        };

        if (isEditing) {
            put(route('ruang.update', ruang.id), options);
        } else {
            post(route('ruang.store'), options);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
            <h2 className="mb-4 text-lg font-bold">{isEditing ? 'Edit Ruang' : 'Tambah Ruang'}</h2>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <Label htmlFor="nama_ruang">Nama Ruang</Label>
                    <Input
                        id="nama_ruang"
                        value={data.nama_ruang}
                        onChange={(e) => setData('nama_ruang', e.target.value)}
                        className="mt-1 block w-full"
                        autofocus
                    />
                    <InputError message={errors.nama_ruang} className="mt-2" />
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
