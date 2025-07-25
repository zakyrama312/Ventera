import { Link } from '@inertiajs/react';
import React from 'react';
import GridShape from '../../components/common/GridShape';
import ThemeTogglerTwo from '../../components/common/ThemeTogglerTwo';
import { ThemeProvider } from '../../context/ThemeContext';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
                <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
                    {children}
                    <div className="hidden h-full w-full items-center bg-brand-950 lg:grid lg:w-1/2 dark:bg-white/5">
                        <div className="relative z-1 flex items-center justify-center">
                            {/* <!-- ===== Common Grid Shape Start ===== --> */}
                            <GridShape />
                            <div className="flex max-w-xs flex-col items-center">
                                <Link href="/" className="mb-4 block">
                                    <img width={231} height={48} src="/images/logo/auth-logo.svg" alt="Logo" />
                                </Link>
                                <p className="text-center text-gray-400 dark:text-white/60">Selamat Datang</p>
                            </div>
                        </div>
                    </div>
                    <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
                        <ThemeTogglerTwo />
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
