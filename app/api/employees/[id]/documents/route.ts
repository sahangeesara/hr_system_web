import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const docType = formData.get('document_type') as string;

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${params.id}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('employee-docs')
        .upload(fileName, file);

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    // 2. Insert metadata into Database
    const { error: dbError } = await supabase
        .from('employee_documents')
        .insert({
            employee_id: params.id,
            document_type: docType,
            original_file_name: file.name,
            stored_file_name: fileName,
            file_path: uploadData.path,
            file_size: file.size,
            mime_type: file.type,
        });

    return NextResponse.json({ success: true });
}
