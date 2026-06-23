'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Import your supabase client here if you have a logout function
// import { supabase } from '@/lib/supabase';

export const Navbar = () => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSignOut = async () => {
        // await supabase.auth.signOut();
        router.push('/login');
    };

    // Prevent hydration mismatch by returning null until client-side mount
    if (!isMounted) return null;

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 shadow-sm">
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Admin User</span>
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
                    suppressHydrationWarning
                >
                    Logout
                </button>
            </div>
        </header>
    );
};
