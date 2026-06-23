'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';
import { Department } from "@/types/department";
import { DepartmentModal } from '@/components/departments/DepartmentModal';

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);

    useEffect(() => { fetchDepartments(); }, []);

    const fetchDepartments = async () => {
        const res = await fetch('/api/departments');
        const data = await res.json();
        setDepartments(data);
    };

    const handleDelete = async (id: string) => {
        if (!id) return;
        const result = await Swal.fire({
            title: 'Delete Department?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DC2626',
            confirmButtonText: 'Delete'
        });

        if (result.isConfirmed) {
            await fetch(`/api/departments/${id}`, { method: 'DELETE' });
            fetchDepartments();
        }
    };

    return (
        <div className="min-h-screen bg-white p-8 text-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Departments</h1>
                <Button onClick={() => { setEditingDept(null); setIsModalOpen(true); }} className="bg-blue-600 text-white">
                    + Add Department
                </Button>
            </div>

            <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {departments.map((dept) => (
                        <tr key={dept.id}>
                            <td className="p-4">{dept.name}</td>
                            <td className="p-4">{dept.description}</td>
                            <td className="p-4 text-right">
                                <Button variant="ghost" onClick={() => { setEditingDept(dept); setIsModalOpen(true); }}>Edit</Button>
                                <Button variant="ghost" className="text-red-600" onClick={() => handleDelete(dept.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>

            <DepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchDepartments}
                initialData={editingDept}
            />
        </div>
    );
}
