'use client';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

// Add {children} prop here
export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
};
