import type { route as routeFn } from 'ziggy-js';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

// === TIPE UNTUK PROPS INERTIA (YANG BARU) ===
export type User = {
    id: number;
    name: string;
    username: string;
    role: string
    // Tambahkan properti lain jika ada
};

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = InertiaPageProps & T & {
    auth: {
        user: User;
    };
};

// === TIPE UNTUK ZIGGY (YANG SUDAH ADA, JANGAN DIHAPUS) ===
declare global {
    const route: typeof routeFn;
}
