'use client';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';

export function PayrollModal({ isOpen, onClose, onSuccess, initialData }: any) {
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());

        const url = initialData ? `http://localhost:8000/payrolls/${initialData.id}` : 'http://localhost:8000/payrolls';
        const method = initialData ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            Swal.fire('Saved!', '', 'success');
            onSuccess();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-black">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
                <h2 className="text-lg font-bold">{initialData ? 'Edit Payroll' : 'Add Payroll'}</h2>
                <input name="employee_id" defaultValue={initialData?.employee_id} placeholder="Employee ID" className="w-full border p-2 rounded" required />
                <input name="month" type="number" defaultValue={initialData?.month} placeholder="Month" className="w-full border p-2 rounded" />
                <input name="year" type="number" defaultValue={initialData?.year} placeholder="Year" className="w-full border p-2 rounded" />
                <input name="net_salary" type="number" defaultValue={initialData?.net_salary} placeholder="Net Salary" className="w-full border p-2 rounded" />
                <select name="payment_status" defaultValue={initialData?.payment_status} className="w-full border p-2 rounded">
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                </select>
                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={onClose} className="bg-gray-200 text-black">Cancel</Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </div>
    );
}
