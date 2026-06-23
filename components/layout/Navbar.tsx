import { signOut } from '@/lib/auth';

export const Navbar = () => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
            <button
                onClick={signOut}
                className="px-4 py-2 bg-danger text-white rounded-md text-caption"
            >
                Logout
            </button>
        </header>
    );
};
