'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export function PositionModal({ isOpen, onClose, onSuccess, initialData }: any) {
    const [departments, setDepartments] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetch('/api/departments')
                .then(res => res.json())
                .then(data => setDepartments(Array.isArray(data) ? data : []))
                .catch(console.error);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            title: formData.get('title'),
            department_id: formData.get('department_id'),
            description: formData.get('description'),
            is_active: formData.get('is_active') === 'true'
        };

        await fetch(initialData ? `/api/positions?id=${initialData.id}` : '/api/positions', {
            method: initialData ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        onSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4 text-black">
                <h2 className="text-xl font-bold">{initialData ? 'Edit Position' : 'New Position'}</h2>

                <label className="block text-sm font-medium">Title</label>
                <input name="title" defaultValue={initialData?.title} className="w-full border border-gray-400 p-2 rounded" required />

                <label className="block text-sm font-medium">Department</label>
                <select name="department_id" defaultValue={initialData?.department_id} className="w-full border border-gray-400 p-2 rounded" required>
                    <option value="">Select a Department</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </select>

                <label className="block text-sm font-medium">Description</label>
                <textarea name="description" defaultValue={initialData?.description} className="w-full border border-gray-400 p-2 rounded" rows={3} />

                <label className="block text-sm font-medium">Status</label>
                <select name="is_active" defaultValue={initialData?.is_active?.toString()} className="w-full border border-gray-400 p-2 rounded">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" onClick={onClose} className="bg-gray-200 text-black">Cancel</Button>
                    <Button type="submit" className="bg-blue-600 text-white">Save</Button>
                </div>
            </form>
        </div>
    );
}
