import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH: Update position details
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json();
    const { data, error } = await supabase
        .from('positions')
        .update({ ...body, updated_at: new Date() })
        .eq('id', params.id)
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data[0]);
}

// DELETE: Remove position by ID from the URL path
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
        .from('positions')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}
