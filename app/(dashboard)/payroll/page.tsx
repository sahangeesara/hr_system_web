'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PayrollPage() {
    const [payrolls, setPayrolls] = useState([]);

    // Fetch payroll records from your FastAPI backend
    useEffect(() => {
        const fetchPayroll = async () => {
            const res = await fetch('http://localhost:8000/payrolls');
            const data = await res.json();
            setPayrolls(data);
        };
        fetchPayroll();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Payroll Management</h1>
            <Card className="p-0">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-4">Employee ID</th>
                        <th className="p-4">Period</th>
                        <th className="p-4">Net Salary</th>
                        <th className="p-4">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payrolls.map((p: any) => (
                        <tr key={p.id} className="border-b">
                            <td className="p-4">{p.employee_id}</td>
                            <td className="p-4">{p.month}/{p.year}</td>
                            <td className="p-4 font-semibold">${p.net_salary}</td>
                            <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        p.payment_status === 'PAID' ? 'bg-green-100 text-green-700' :
                                            p.payment_status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {p.payment_status}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
