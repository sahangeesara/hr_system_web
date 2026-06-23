export const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Departments', path: '/departments' },
        { name: 'Positions', path: '/positions' },
        { name: 'Employees', path: '/employees' },
        { name: 'Payroll', path: '/payroll' },
    ];

    return (
        <aside className="w-64 h-screen bg-surface border-r border-gray-200">
            <div className="p-4 font-bold text-heading">HRM System</div>
            <nav className="mt-4">
                {menuItems.map((item) => (
                    <a key={item.path} href={item.path} className="block p-3 hover:bg-primary/10">
                        {item.name}
                    </a>
                ))}
            </nav>
        </aside>
    );
};
