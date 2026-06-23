'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Department } from "@/types/department";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Department | null;
}

export function DepartmentModal({ isOpen, onClose, onSuccess, initialData }: Props) {
    const [formData, setFormData] = useState({ name: '', description: '', is_active: true });

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else setFormData({ name: '', description: '', is_active: true });
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = initialData ? `/api/departments/${initialData.id}` : '/api/departments';
        const method = initialData ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method,
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            onSuccess();
            onClose();
        } else {
            Swal.fire('Error', 'Operation failed', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit' : 'Add'} Department</h2>
                <input className="w-full p-2 border mb-3 rounded" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <textarea className="w-full p-2 border mb-3 rounded" placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                </div>
            </form>
        </div>
    );
}
