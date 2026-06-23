import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH: Update Employee
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json();
    const { data, error } = await supabase
        .from('employees')
        .update(body)
        .eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

// DELETE: Remove Employee
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    // Note: Ensure your DB has "ON DELETE CASCADE" on the documents table
    // so that deleting an employee automatically removes their document records.
    const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
}
