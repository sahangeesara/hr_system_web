import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Download Document
export async function GET(req: Request, { params }: { params: { document_id: string } }) {
    const { data: doc, error: dbError } = await supabase
        .from('employee_documents')
        .select('stored_file_name')
        .eq('id', params.document_id)
        .single();

    if (dbError || !doc) {
        return NextResponse.json({ error: 'Document record not found' }, { status: 404 });
    }

    const { data, error: urlError } = await supabase.storage
        .from('employee-docs')
        .createSignedUrl(doc.stored_file_name, 60);

    if (urlError) {
        return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });
}

// DELETE: Remove Document
export async function DELETE(req: Request, { params }: { params: { document_id: string } }) {
    // 1. Fetch file record first
    const { data: doc, error: fetchError } = await supabase
        .from('employee_documents')
        .select('stored_file_name')
        .eq('id', params.document_id)
        .single();

    if (fetchError || !doc) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // 2. Delete from Storage
    const { error: storageError } = await supabase.storage
        .from('employee-docs')
        .remove([doc.stored_file_name]);

    if (storageError) {
        return NextResponse.json({ error: 'Failed to delete file from storage' }, { status: 500 });
    }

    // 3. Delete from DB only after successful file deletion
    const { error: dbError } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', params.document_id);

    if (dbError) {
        return NextResponse.json({ error: 'Failed to delete database record' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
