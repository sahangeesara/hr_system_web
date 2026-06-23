import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    // Parallel fetching for performance
    const [employees, depts, payrolls] = await Promise.all([
        supabase.from('employees').select('id', { count: 'exact', head: true }),
        supabase.from('departments').select('id', { count: 'exact', head: true }),
        supabase.from('payrolls').select('amount', { count: 'exact' }).eq('status', 'pending')
    ]);

    const totalPayroll = payrolls.data?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

    return NextResponse.json({
        totalEmployees: employees.count || 0,
        totalDepartments: depts.count || 0,
        pendingPayrolls: payrolls.count || 0,
        monthlyPayroll: totalPayroll
    });
}
