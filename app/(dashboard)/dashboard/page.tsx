'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        monthlyPayroll: 0,
        pendingPayrolls: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => { setStats(data); setLoading(false); })
            .catch(console.error);
    }, []);

    if (loading) return <div className="p-8">Loading dashboard metrics...</div>;

    return (
        <div className="min-h-screen bg-gray-50 text-black p-6">
            <h1 className="text-2xl font-bold mb-6">HRM Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Employees" value={stats.totalEmployees} />
                <StatCard title="Total Departments" value={stats.totalDepartments} />
                <StatCard title="Pending Approvals" value={stats.pendingPayrolls} />
                <StatCard title="Monthly Payroll" value={`$${stats.monthlyPayroll.toLocaleString()}`} />
            </div>

            <Card className="p-6 bg-white border border-gray-200">
                <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                <p className="text-gray-500">Dashboard visual data would go here...</p>
            </Card>
        </div>
    );
}

function StatCard({ title, value }: { title: string, value: string | number }) {
    return (
        <Card className="p-6 bg-white border-l-4 border-l-blue-600 shadow-sm">
            <p className="text-sm text-gray-500 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
        </Card>
    );
}
