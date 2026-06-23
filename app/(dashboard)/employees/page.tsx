'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { EmployeeModal } from '@/components/employees/EmployeeModal';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<any | null>(null);

    const fetchEmployees = async () => {
        const res = await fetch('/api/employees');
        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : []);
    };

    useEffect(() => { fetchEmployees(); }, []);

    const handleEdit = (emp: any) => {
        setEditingEmployee(emp);
        setIsModalOpen(true);
    };

    return (
        <div className="p-8 bg-white min-h-screen text-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Employee Directory</h1>
                <Button onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }} className="bg-blue-600 text-white">
                    + Add Employee
                </Button>
            </div>

            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                {employees.map((emp) => (
                    <tr key={emp.id}>
                        <td className="p-4">{emp.first_name} {emp.last_name}</td>
                        <td className="p-4">{emp.email}</td>
                        <td className="p-4 flex gap-2">
                            <Button onClick={() => handleEdit(emp)} className="bg-gray-200 text-black">Edit</Button>
                            <a href={`/api/employees/download?empId=${emp.id}`} className="text-blue-600">Download</a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <EmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchEmployees}
                initialData={editingEmployee} // Pass the data here
            />
        </div>
    );
}
