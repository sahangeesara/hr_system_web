// app/api/payrolls/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    const { employee_id, month, year, basic_salary, allowances, deductions } = await req.json();

    // Server-side calculation
    const net_salary = basic_salary + allowances - deductions;

    const { data, error } = await supabase
        .from('payrolls')
        .insert([{ employee_id, month, year, basic_salary, allowances, deductions, net_salary }])
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data[0]);
}

export async function GET() {
    const { data, error } = await supabase.from('payrolls').select('*, employees(first_name, last_name)');
    return NextResponse.json(data);
}
