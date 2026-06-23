// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();

    // 1. Add your database/Supabase logic here
    console.log("Registering user:", body);

    // 2. Return a response
    return NextResponse.json({ message: "Registration successful" }, { status: 201 });
}
