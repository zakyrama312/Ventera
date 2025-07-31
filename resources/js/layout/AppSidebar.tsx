import { Link, usePage } from '@inertiajs/react'; // 👈 [1] Impor dari Inertia
import React, { useEffect, useRef, useState } from 'react';

// Asumsikan ikon-ikon ini sudah diimpor dengan benar
import { useSidebar } from '../context/SidebarContext';
import { BoxCubeIcon, BoxIcon, CalenderIcon, ChevronDownIcon, GridIcon, GroupIcon, HorizontaLDots, PageIcon, PieChartIcon, TaskIcon } from '../icons';

// Definisikan tipe untuk item navigasi
type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    routeName?: string;
    subItems?: {
        name: string;
        path: string;
        routeName?: string;
        pro?: boolean;
        new?: boolean;
    }[];
};

const navItems: NavItem[] = [
    {
        icon: <GridIcon />,
        name: 'Dashboard',
        path: route('dashboard'),
        routeName: 'dashboard',
    },
    {
        icon: <CalenderIcon />,
        name: 'Ruang',
        subItems: [{ name: 'Lab RPL', path: route('users.index'), routeName: 'users.*' }],
    },
];

const othersItems: NavItem[] = [
    {
        icon: <GroupIcon />,
        name: 'Pengguna',
        path: route('users.index'), // contoh: users.index
        routeName: 'users.*', // contoh: users.* agar aktif di users.create, users.edit
    },
    {
        icon: <BoxCubeIcon />,
        name: 'Prodi',
        path: route('prodi.index'), // contoh: prodi.index
        routeName: 'prodi.*',
    },
    {
        icon: <PieChartIcon />,
        name: 'Kondisi',
        path: route('kondisi.index'), // contoh: kondisi.index
        routeName: 'kondisi.*',
    },
    {
        icon: <TaskIcon />,
        name: 'Ruang',
        path: route('ruang.index'), // contoh: ruang.index
        routeName: 'ruang.*',
    },
    {
        icon: <BoxIcon />,
        name: 'Kategori',
        path: route('kategori.index'), // contoh: kategori.index
        routeName: 'kategori.*',
    },
];

const transaksiItem: NavItem[] = [
    {
        icon: <BoxIcon />,
        name: 'Barang Masuk',
        path: route('barang-masuk.index'), // contoh
        routeName: 'barang-masuk.*',
    },
    {
        icon: <PageIcon />,
        name: 'Peminjaman Barang',
        path: route('peminjaman.index'), // contoh
        routeName: 'peminjaman.*',
    },
    {
        icon: <PageIcon />,
        name: 'Permintaan Barang',
        path: route('permintaan.index'), // contoh
        routeName: 'permintaan.*',
    },
];

const laporanItems: NavItem[] = [
    {
        icon: <BoxIcon />,
        name: 'Laporan Barang Masuk',
        path: route('laporan.barang-masuk'), // contoh
        routeName: 'laporan.barang-masuk',
    },
    {
        icon: <PageIcon />,
        name: 'Laporan Peminjaman',
        path: route('laporan.peminjaman'), // contoh
        routeName: 'laporan.peminjaman',
    },
    {
        icon: <PageIcon />,
        name: 'Laporan Permintaan',
        path: route('laporan.peminjaman'), // contoh
        routeName: 'laporan.peminjaman',
    },
];
// --- Akhir dari area kustomisasi route ---

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const { url } = usePage(); // 👈 [2] Gunakan usePage, bukan useLocation

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: string;
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // 👈 [3] Fungsi isActive sekarang menggunakan helper `route().current()`
    const isActive = (routeName: string | undefined) => {
        if (!routeName) return false;
        return route().current(routeName);
    };

    // Efek untuk membuka submenu yang aktif saat halaman dimuat
    useEffect(() => {
        const allItemGroups = {
            main: navItems,
            beranda: othersItems,
            transaksi: transaksiItem,
            laporan: laporanItems,
        };
        let submenuMatched = false;
        for (const [menuType, items] of Object.entries(allItemGroups)) {
            items.forEach((nav, index) => {
                if (nav.subItems?.some((sub) => isActive(sub.routeName))) {
                    setOpenSubmenu({ type: menuType, index });
                    submenuMatched = true;
                }
            });
        }
        // Jika tidak ada submenu yang cocok, jangan tutup menu yang mungkin sudah terbuka
        // if (!submenuMatched) {
        //   setOpenSubmenu(null);
        // }
    }, [url]);

    // Efek untuk mengkalkulasi tinggi submenu saat dibuka
    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prev) => ({
                    ...prev,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (index: number, menuType: string) => {
        setOpenSubmenu((prev) => {
            if (prev && prev.type === menuType && prev.index === index) {
                return null; // Tutup jika yang sama diklik lagi
            }
            return { type: menuType, index }; // Buka yang baru
        });
    };

    const renderMenuItems = (items: NavItem[], menuType: string) => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => (
                <li key={`${menuType}-${nav.name}-${index}`}>
                    {nav.subItems ? (
                        // Button untuk membuka/menutup submenu
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`group menu-item ${
                                openSubmenu?.type === menuType && openSubmenu?.index === index ? 'menu-item-active' : 'menu-item-inactive'
                            } w-full cursor-pointer`}
                        >
                            <span className="menu-item-icon-size">{nav.icon}</span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <>
                                    <span className="menu-item-text">{nav.name}</span>
                                    <ChevronDownIcon
                                        className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                                            openSubmenu?.type === menuType && openSubmenu?.index === index ? 'rotate-180 text-brand-500' : ''
                                        }`}
                                    />
                                </>
                            )}
                        </button>
                    ) : (
                        // Link navigasi biasa
                        nav.path && (
                            <Link
                                href={nav.path}
                                className={`group menu-item ${isActive(nav.routeName) ? 'menu-item-active' : 'menu-item-inactive'}`}
                            >
                                <span
                                    className={`menu-item-icon-size ${isActive(nav.routeName) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'}`}
                                >
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                            </Link>
                        )
                    )}
                    {/* Render Submenu jika ada */}
                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div
                            ref={(el) => {
                                subMenuRefs.current[`${menuType}-${index}`] = el;
                            }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                                height:
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? `${subMenuHeight[`${menuType}-${index}`] || 0}px`
                                        : '0px',
                            }}
                        >
                            <ul className="mt-2 ml-9 space-y-1">
                                {nav.subItems.map((subItem) => (
                                    <li key={subItem.name}>
                                        <Link
                                            href={subItem.path}
                                            className={`menu-dropdown-item ${
                                                isActive(subItem.routeName) ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'
                                            }`}
                                        >
                                            {subItem.name}
                                            {/* ... render badge pro/new jika ada ... */}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`flex py-8 ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}>
                <Link href={route('dashboard')}>
                    {' '}
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <img className="dark:hidden" src="/images/logo-png/ventera-logo.png" alt="Logo" width={150} height={40} />
                            <img className="hidden dark:block" src="/images/logo-png/ventera-logo-dark.png" alt="Logo" width={150} height={40} />
                        </>
                    ) : (
                        <img src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
                    )}
                </Link>
            </div>

            <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto duration-300 ease-linear">
                <nav className="flex flex-1 flex-col gap-6">
                    <div>
                        <h2
                            className={`mb-4 flex items-center text-xs leading-[20px] text-gray-400 uppercase ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}
                        >
                            {isExpanded || isHovered || isMobileOpen ? 'Menu' : <HorizontaLDots className="size-6" />}
                        </h2>
                        {renderMenuItems(navItems, 'main')}
                    </div>
                    <div>
                        <h2
                            className={`mb-4 flex items-center text-xs leading-[20px] text-gray-400 uppercase ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}
                        >
                            {isExpanded || isHovered || isMobileOpen ? 'Master Data' : <HorizontaLDots />}
                        </h2>
                        {renderMenuItems(othersItems, 'beranda')}
                    </div>
                    <div>
                        <h2
                            className={`mb-4 flex items-center text-xs leading-[20px] text-gray-400 uppercase ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}
                        >
                            {isExpanded || isHovered || isHovered ? 'Transaksi' : <HorizontaLDots />}
                        </h2>
                        {renderMenuItems(transaksiItem, 'transaksi')}
                    </div>
                    <div>
                        <h2
                            className={`mb-4 flex items-center text-xs leading-[20px] text-gray-400 uppercase ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}
                        >
                            {isExpanded || isHovered || isMobileOpen ? 'Laporan' : <HorizontaLDots />}
                        </h2>
                        {renderMenuItems(laporanItems, 'laporan')}
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;
