'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PositionsPage() {
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const fetchPositions = async () => {
            const res = await fetch('/api/payrolls');            const data = await res.json();
            setPositions(data);
        };
        fetchPositions();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Positions</h1>
                <Button>+ Add Position</Button>
            </div>

            <Card className="p-0">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-4">Title</th>
                        <th className="p-4">Department ID</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {positions.map((pos: any) => (
                        <tr key={pos.id} className="border-b">
                            <td className="p-4">{pos.title}</td>
                            <td className="p-4">{pos.department_id}</td>
                            <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${pos.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {pos.is_active ? 'Active' : 'Inactive'}
                                    </span>
                            </td>
                            <td className="p-4 text-right">
                                <Button className="bg-danger">Delete</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
