'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Swal from 'sweetalert2';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // CALL YOUR INTERNAL NEXT.JS ROUTE
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login Failed');
            }

            await Swal.fire({ icon: 'success', title: 'Welcome!', timer: 1500 });
            router.push('/dashboard');
        } catch (err: any) {
            Swal.fire({ icon: 'error', title: 'Login Failed', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-sm p-8 shadow-xl bg-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Login to HRM</h2>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <Input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Login'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
