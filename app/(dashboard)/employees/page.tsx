'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Swal from 'sweetalert2';

export default function OnboardingPage() {
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', phone: '', department_id: '',
    });
    const [files, setFiles] = useState<FileList | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Validate file size (5MB) and type
            const validFiles = Array.from(e.target.files).filter(file => {
                const isSizeValid = file.size <= 5 * 1024 * 1024;
                const isTypeValid = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
                if (!isSizeValid) Swal.fire('Error', `${file.name} is too large (>5MB)`, 'error');
                return isSizeValid && isTypeValid;
            });
            setFiles(e.target.files);
        }
    };

    const submitOnboarding = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (files) Array.from(files).forEach(file => data.append('documents', file));

        const response = await fetch('/api/employees', { method: 'POST', body: data });
        if (response.ok) Swal.fire('Success', 'Employee onboarded', 'success');
    };

    return (
        <form onSubmit={submitOnboarding} className="p-8 space-y-6">
            <h2 className="text-heading font-bold">New Employee Onboarding</h2>
            <div className="grid grid-cols-2 gap-4">
                <Input placeholder="First Name" onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
                <Input placeholder="Last Name" onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
                <Input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="border-2 border-dashed p-6 rounded-lg">
                <label className="block mb-2 font-semibold">Upload Documents (PDF, JPG, PNG - Max 5MB)</label>
                <input type="file" multiple onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
            </div>

            <Button type="submit">Complete Onboarding</Button>
        </form>
    );
}
