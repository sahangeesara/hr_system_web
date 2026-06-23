import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Generate secure download link for an employee document
export async function GET(
    req: Request,
    { params }: { params: { document_id: string } }
) {
    // 1. Fetch document metadata from the database
    const { data: doc, error: dbError } = await supabase
        .from('employee_documents')
        .select('stored_file_name')
        .eq('id', params.document_id)
        .single();

    if (dbError || !doc) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // 2. Generate a secure, temporary download URL (valid for 60 seconds)
    const { data, error: urlError } = await supabase.storage
        .from('employee-docs')
        .createSignedUrl(doc.stored_file_name, 60);

    if (urlError) {
        return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 });
    }

    // 3. Return the signed URL to the frontend
    return NextResponse.json({ url: data.signedUrl });
}
