// resources/js/components/input-error.tsx

import { HTMLAttributes } from 'react';

// Definisikan props yang diterima oleh komponen
interface InputErrorProps extends HTMLAttributes<HTMLParagraphElement> {
    message?: string;
}

export default function InputError({ message, className = '', ...props }: InputErrorProps) {
    // Jika tidak ada pesan error (message bernilai null atau undefined),
    // maka komponen ini tidak akan merender apa-apa.
    if (!message) {
        return null;
    }

    return (
        // Jika ada pesan error, tampilkan di dalam tag <p> dengan style warna merah.
        <p {...props} className={`text-sm text-red-600 dark:text-red-400 ${className}`}>
            {message}
        </p>
    );
}
