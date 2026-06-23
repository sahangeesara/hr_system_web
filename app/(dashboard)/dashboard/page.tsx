'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        totalPositions: 0,
        monthlyPayroll: 0,
        pendingPayrolls: 0
    });

    // In a real app, fetch these from your FastAPI backend
    useEffect(() => {
        // fetch('http://localhost:8000/dashboard/stats').then(...)
    }, []);

    return (
        <>
            <h1 className="text-2xl font-bold mb-6">HRM Overview</h1>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Employees" value={stats.totalEmployees} />
                <StatCard title="Total Departments" value={stats.totalDepartments} />
                <StatCard title="Total Positions" value={stats.totalPositions} />
                <StatCard title="Monthly Payroll" value={`$${stats.monthlyPayroll.toLocaleString()}`} />
            </div>

            {/* Pending Payrolls Table */}
            <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Pending Payrolls</h2>
                {/* Add your table logic here */}
            </Card>
        </>
    );
}

function StatCard({ title, value }: { title: string, value: string | number }) {
    return (
        <Card className="p-6">
            <p className="text-sm text-secondary">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
        </Card>
    );
}
