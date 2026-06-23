'use client';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
    const pathname = usePathname();
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Departments', path: '/departments' },
        { name: 'Positions', path: '/positions' },
        { name: 'Employees', path: '/employees' },
        { name: 'Payroll', path: '/payroll' },
    ];

    return (
        <aside className="w-64 h-screen bg-surface border-r border-gray-200">
            <div className="p-6 font-bold text-heading text-primary">HRM System</div>
            <nav className="mt-4 px-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <a
                            key={item.path}
                            href={item.path}
                            className={`block p-3 rounded-md transition-colors ${
                                isActive
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-primary/10 text-secondary'
                            }`}
                        >
                            {item.name}
                        </a>
                    );
                })}
            </nav>
        </aside>
    );
};
