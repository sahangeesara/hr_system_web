'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
            <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-danger text-white rounded-md text-caption"
            >
                Logout
            </button>
        </header>
    );
};
