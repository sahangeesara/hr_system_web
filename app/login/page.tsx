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
            // Point this to your FastAPI backend URL (usually port 8000)
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username: email, password }),
            });

            if (!response.ok) throw new Error('Invalid email or password');

            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);

            await Swal.fire({ icon: 'success', title: 'Welcome back!', timer: 1500 });
            router.push('/dashboard');
        } catch (err: any) {
            Swal.fire({ icon: 'error', title: 'Login Failed', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
            <Card className="w-full max-w-sm p-8 shadow-2xl">
                <h2 className="text-heading font-bold text-gray-900 mb-6">Login to HRM</h2>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <Input
                        type="email"
                        placeholder="Email Address"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" className="w-full h-12" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Login'}
                    </Button>
                </form>
                <p className="mt-4 text-center text-caption text-secondary">
                    Don't have an account? <a href="/register" className="text-primary font-bold">Register</a>
                </p>
            </Card>
        </div>
    );
}
