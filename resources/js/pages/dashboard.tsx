// resources/js/Pages/Blank.tsx

import PageBreadcrumb from '@/components/common/PageBreadCrumb'; // Asumsikan path alias @ sudah diatur
import AppLayout from '@/layout/AppLayout';
import { Head } from '@inertiajs/react';

export default function Blank() {
    return (
        // Sebaiknya bungkus dengan React Fragment <> </>
        <>
            {/* [3] Gunakan Head untuk title dan meta description */}
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="This is React.js Blank Dashboard page for TailAdmin" />
            </Head>

            {/* Komponen PageBreadcrumb tetap sama */}
            <PageBreadcrumb pageTitle="Blank Page" />

            {/* Konten utama halaman Anda tetap sama */}
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 xl:px-10 xl:py-12 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mx-auto w-full max-w-[630px] text-center">
                    <h3 className="mb-4 text-theme-xl font-semibold text-gray-800 sm:text-2xl dark:text-white/90">Card Title Here</h3>

                    <p className="text-sm text-gray-500 sm:text-base dark:text-gray-400">
                        Start putting content on grids or panels, you can also use different combinations of grids.Please check out the dashboard and
                        other pages
                    </p>
                </div>
            </div>
        </>
    );
}

// 👇 [4] Terapkan layout utama ke halaman ini
Blank.layout = (page) => <AppLayout>{page}</AppLayout>;
