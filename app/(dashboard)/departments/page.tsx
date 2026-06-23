'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        const res = await fetch('http://localhost:8000/departments');
        const data = await res.json();
        setDepartments(data);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        });

        if (result.isConfirmed) {
            await fetch(`http://localhost:8000/departments/${id}`, { method: 'DELETE' });
            fetchDepartments();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Departments</h1>
                <Button>+ Add Department</Button>
            </div>

            <Card className="p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {departments.map((dept: any) => (
                        <tr key={dept.id} className="border-b">
                            <td className="p-4">{dept.name}</td>
                            <td className="p-4">{dept.description}</td>
                            <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${dept.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {dept.is_active ? 'Active' : 'Inactive'}
                                    </span>
                            </td>
                            <td className="p-4 text-right">
                                <Button className="bg-danger" onClick={() => handleDelete(dept.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
