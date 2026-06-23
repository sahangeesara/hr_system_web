'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PayrollModal } from '@/components/payroll/PayrollModal';

export default function PayrollPage() {
    const [payrolls, setPayrolls] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPayroll, setEditingPayroll] = useState<any | null>(null);

    const fetchPayroll = async () => {
        const res = await fetch('http://localhost:8000/payrolls');
        const data = await res.json();
        setPayrolls(data);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Delete record?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete!'
        });

        if (result.isConfirmed) {
            await fetch(`http://localhost:8000/payrolls/${id}`, { method: 'DELETE' });
            fetchPayroll();
        }
    };

    useEffect(() => { fetchPayroll(); }, []);

    return (
        <div className="space-y-6 p-8 text-black">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Payroll Management</h1>
                <Button onClick={() => { setEditingPayroll(null); setIsModalOpen(true); }} className="bg-blue-600 text-white">
                    + Add Record
                </Button>
            </div>

            <Card className="p-0 overflow-hidden">
                <table className="w-full text-left text-black">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="p-4">Employee ID</th>
                        <th className="p-4">Period</th>
                        <th className="p-4">Net Salary</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payrolls.map((p: any) => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{p.employee_id}</td>
                            <td className="p-4">{p.month}/{p.year}</td>
                            <td className="p-4 font-semibold">${p.net_salary}</td>
                            <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.payment_status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {p.payment_status}
                                    </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <Button onClick={() => { setEditingPayroll(p); setIsModalOpen(true); }} className="bg-gray-200 text-black">Edit</Button>
                                <Button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white">Delete</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>

            <PayrollModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPayroll}
                initialData={editingPayroll}
            />
        </div>
    );
}
