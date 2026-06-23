import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: List all employees
export async function GET() {
    const { data, error } = await supabase.from('employees').select('*');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// POST: Create employee
export async function POST(request: Request) {
    const formData = await request.formData();

    // Extract fields matching your schema exactly
    const employeeData = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address') || null,
        department_id: formData.get('department_id') || null,
        position_id: formData.get('position_id') || null,
        joining_date: formData.get('joining_date') || null,
        basic_salary: parseFloat(formData.get('basic_salary') as string) || 0,
        // employee_code is handled by your database DEFAULT value
        // employment_type and status are handled by your database DEFAULT values
    };

    const { data: employee, error: empError } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single();

    if (empError) {
        console.error("Insert Error:", empError);
        return NextResponse.json({ error: empError.message }, { status: 400 });
    }

    // Save Documents logic remains the same...
    return NextResponse.json({ success: true, employee });
}
