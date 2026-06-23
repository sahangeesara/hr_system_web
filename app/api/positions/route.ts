import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch all positions
export async function GET() {
    const { data, error } = await supabase
        .from('positions')
        .select('*, departments(name)');

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

// POST: Create a new position
export async function POST(req: Request) {
    const body = await req.json();
    const { data, error } = await supabase.from('positions').insert([body]).select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data[0]);
}

// PATCH: Update an existing position
export async function PATCH(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { data, error } = await supabase
        .from('positions')
        .update(body)
        .eq('id', id)
        .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data[0]);
}
