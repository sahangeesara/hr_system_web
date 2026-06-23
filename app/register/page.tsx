'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Swal from 'sweetalert2';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 1. Send the registration request to Supabase
        const { data, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullName, // Matches the SQL trigger key
                },
            },
        });

        // 2. Handle Errors
        if (authError) {
            setLoading(false);
            await Swal.fire({ icon: "error", title: "Registration Failed", text: authError.message });
            return;
        }

        // 3. Success Feedback
        setLoading(false);
        await Swal.fire({
            icon: "success",
            title: "Registration successful!",
            text: "Welcome to the HRM system.",
        });

        router.push("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
            <Card className="w-full max-w-md shadow-2xl border-none p-8">
                <div className="text-center mb-8">
                    <h2 className="text-heading font-extrabold text-gray-900">Welcome to HRM</h2>
                    <p className="text-body text-secondary mt-2">Create your account to get started</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-caption font-semibold text-secondary">Full Name</label>
                        <Input
                            placeholder="John Doe"
                            required
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-caption font-semibold text-secondary">Email Address</label>
                        <Input
                            type="email"
                            placeholder="name@company.com"
                            required
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-caption font-semibold text-secondary">Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <Button type="submit" className="w-full h-12 mt-2" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
