// resources/js/components/modals/BarangDetailModal.tsx
import { Modal } from '@/components/ui/modal';

import type { BarangDetail } from '@/types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    data: BarangDetail | null;
}

export default function BarangDetailModal({ isOpen, onClose, data }: Props) {
    if (!data) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6">
            <h2 className="mb-4 text-xl font-bold">Detail Barang: {data.barang.nama_barang}</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div>
                        <strong>Kode Barang:</strong> {data.barang.kode_barang || '-'}
                    </div>
                    <div>
                        <strong>Kategori:</strong> {data.barang.kategori.nama_kategori}
                    </div>
                    <div>
                        <strong>Merk:</strong> {data.barang.merk || '-'}
                    </div>
                    <div>
                        <strong>Kondisi:</strong> {data.barang.kondisi.nama_kondisi}
                    </div>
                    <div>
                        <strong>Tahun Pengadaan:</strong> {data.barang.tahun_pengadaan}
                    </div>
                    <div>
                        <strong>Ruang:</strong> {data.barang.ruang.nama_ruang}
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                        <strong>Stok Saat Ini:</strong> {data.stok_masuk}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold">Spesifikasi:</h3>
                    <p className="whitespace-pre-wrap text-gray-600">{data.barang.spesifikasi || '-'}</p>
                </div>
                <div>
                    <h3 className="font-bold">Keterangan:</h3>
                    <p className="text-gray-600">{data.barang.keterangan || '-'}</p>
                </div>
            </div>
        </Modal>
    );
}
