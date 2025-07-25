// resources/js/components/auth/SignInForm.tsx

import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

// Asumsikan komponen ini ada atau sesuaikan path-nya
import InputError from '@/components/form/input-error'; // Komponen untuk menampilkan error

// Impor Ikon
import { EyeCloseIcon, EyeIcon } from '../../icons'; // Tambahkan LoaderCircle

// Impor komponen UI dari template baru Anda
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';

export default function SignInForm() {
    // State untuk UI (menampilkan/menyembunyikan password) boleh dipertahankan
    const [showPassword, setShowPassword] = useState(false);

    // [1] Ambil logika useForm dari form lama Anda
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    // [2] Ambil fungsi submit dari form lama Anda
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex flex-1 flex-col">
            <Head>
                <title>Login</title>
                <meta name="description" content="This is React.js Blank Dashboard page for TailAdmin" />
            </Head>
            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">Log In</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Silakan Masukkan Username dan Password Anda!</p>
                    </div>
                    <div>
                        {/* [3] Hubungkan form dengan fungsi submit */}
                        <form onSubmit={submit}>
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="username">
                                        Username <span className="text-error-500">*</span>
                                    </Label>
                                    {/* [4] Hubungkan Input Username */}
                                    <Input
                                        id="username"
                                        placeholder="Masukkan Username"
                                        required
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                    />
                                    {/* [5] Tampilkan error jika ada */}
                                    <InputError message={errors.username} className="mt-2" />
                                </div>
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <Label htmlFor="password">
                                            Password <span className="text-error-500">*</span>
                                        </Label>
                                        {/* [6] Tambahkan link "Forgot Password" dari form lama */}
                                        {/* <Link href={route('password.request')} className="text-sm text-brand-500 hover:underline">
                                            Lupa password?
                                        </Link> */}
                                    </div>
                                    <div className="relative">
                                        {/* [4] Hubungkan Input Password */}
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Masukkan password"
                                            value={data.password}
                                            required
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                                            ) : (
                                                <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                                            )}
                                        </span>
                                    </div>
                                    {/* [5] Tampilkan error jika ada */}
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* [7] Tambahkan checkbox "Remember me" dari form lama */}

                                <div>
                                    {/* [8] Hubungkan Tombol Login */}
                                    <Button type="submit" className="w-full" size="sm" disabled={processing}>
                                        Log in
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
