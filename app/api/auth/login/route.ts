import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Use your existing Supabase client

export async function POST(request: Request) {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return NextResponse.json({ message: error.message }, { status: 401 });
    }

    return NextResponse.json({ access_token: data.session.access_token }, { status: 200 });
}
