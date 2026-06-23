'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export function EmployeeModal({ isOpen, onClose, onSuccess, initialData }: any) {
    const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);

    useEffect(() => {
        // Fetch departments for the dropdown
        fetch('/api/departments')
            .then(res => res.json())
            .then(data => setDepartments(data))
            .catch(console.error);
    }, []);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const method = initialData ? 'PATCH' : 'POST';
        const url = initialData ? `/api/employees?id=${initialData.id}` : '/api/employees';

        const res = await fetch(url, { method, body: formData });

        if (res.ok) {
            onSuccess();
            onClose();
        } else {
            alert("Error saving employee. Check console for details.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl space-y-3 max-h-[90vh] overflow-y-auto">
                <h2 className="font-bold text-xl mb-4">{initialData ? 'Edit Employee' : 'Add New Employee'}</h2>

                <div className="grid grid-cols-2 gap-3">
                    <input name="first_name" defaultValue={initialData?.first_name} placeholder="First Name" className="border p-2 rounded" required />
                    <input name="last_name" defaultValue={initialData?.last_name} placeholder="Last Name" className="border p-2 rounded" required />
                </div>

                <input name="email" type="email" defaultValue={initialData?.email} placeholder="Email" className="w-full border p-2 rounded" required />
                <input name="phone" defaultValue={initialData?.phone} placeholder="Phone Number" className="w-full border p-2 rounded" />
                <input name="address" defaultValue={initialData?.address} placeholder="Address" className="w-full border p-2 rounded" />

                <div className="grid grid-cols-2 gap-3">
                    <input name="joining_date" type="date" defaultValue={initialData?.joining_date} className="border p-2 rounded" />
                    <input name="basic_salary" type="number" defaultValue={initialData?.basic_salary} placeholder="Basic Salary" className="border p-2 rounded" />
                </div>

                <select name="department_id" defaultValue={initialData?.department_id} className="w-full border p-2 rounded">
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>

                <div className="pt-2">
                    <label className="text-sm text-gray-500">Upload Documents</label>
                    <input name="documents" type="file" multiple className="w-full border p-2 rounded" />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" onClick={onClose} className="bg-gray-200 text-black hover:bg-gray-300">Cancel</Button>
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Employee</Button>
                </div>
            </form>
        </div>
    );
}
