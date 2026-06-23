import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch all departments
export async function GET() {
    const { data, error } = await supabase.from('departments').select('*');
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}

// POST: Create a new department
export async function POST(req: Request) {
    const body = await req.json();
    const { data, error } = await supabase.from('departments').insert([body]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data[0]);
}
