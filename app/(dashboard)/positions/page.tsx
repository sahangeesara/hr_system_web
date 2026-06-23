'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PositionModal } from '@/components/positions/PositionModal';

export default function PositionsPage() {
    const [positions, setPositions] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPos, setEditingPos] = useState<any | null>(null);

    const fetchPositions = async () => {
        const res = await fetch('/api/positions');
        const data = await res.json();
        setPositions(Array.isArray(data) ? data : []);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            const res = await fetch(`/api/positions?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                Swal.fire('Deleted!', 'Position has been removed.', 'success');
                fetchPositions();
            } else {
                Swal.fire('Error!', 'Failed to delete position.', 'error');
            }
        }
    };

    useEffect(() => { fetchPositions(); }, []);

    return (
        <div className="space-y-6 p-8 text-black">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Positions Management</h1>
                <Button onClick={() => { setEditingPos(null); setIsModalOpen(true); }} className="bg-blue-600 text-white">
                    + Add Position
                </Button>
            </div>

            <Card className="p-0 overflow-hidden">
                <table className="w-full text-left text-black">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="p-4">Title</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {positions.map((pos) => (
                        <tr key={pos.id} className="hover:bg-gray-50">
                            <td className="p-4 font-semibold">{pos.title}</td>
                            <td className="p-4">{pos.departments?.name || 'N/A'}</td>
                            <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${pos.is_active ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                                        {pos.is_active ? 'Active' : 'Inactive'}
                                    </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <Button onClick={() => { setEditingPos(pos); setIsModalOpen(true); }} className="bg-gray-200 text-black border border-gray-400">Edit</Button>
                                <Button onClick={() => handleDelete(pos.id)} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>

            <PositionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPositions}
                initialData={editingPos}
            />
        </div>
    );
}
