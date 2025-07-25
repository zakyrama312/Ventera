import React from 'react';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import { ThemeProvider } from '../context/ThemeContext';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import Backdrop from './Backdrop';

// Definisikan tipe untuk props, termasuk 'children'
type LayoutProps = {
    children: React.ReactNode;
};

// LayoutContent sekarang menerima 'children' sebagai prop
const LayoutContent: React.FC<LayoutProps> = ({ children }) => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen xl:flex dark:bg-gray-900">
            <div>
                <AppSidebar />
                <Backdrop />
            </div>
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${
                    isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
                } ${isMobileOpen ? 'ml-0' : ''}`}
            >
                <AppHeader />
                <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">{children}</div>
            </div>
        </div>
    );
};

// AppLayout juga menerima 'children' dan meneruskannya ke LayoutContent
const AppLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <LayoutContent>{children}</LayoutContent>
            </SidebarProvider>
        </ThemeProvider>
    );
};

export default AppLayout;
