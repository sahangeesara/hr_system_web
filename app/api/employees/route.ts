import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    const body = await request.json();
    const { data, error } = await supabase.from('employees').insert([body]).select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data[0]);
}

export async function GET() {
    const { data, error } = await supabase.from('employees').select('*');
    return NextResponse.json(data);
}
