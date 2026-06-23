import { supabase } from './supabase';

// Example: Generic fetch helper
export async function fetchData(table: string, query: any = '*') {
    const { data, error } = await supabase.from(table).select(query);
    if (error) throw error;
    return data;
}

// Example: File upload utility
export async function uploadDocument(file: File, path: string) {
    const { data, error } = await supabase.storage
        .from('employee-documents')
        .upload(path, file);

    if (error) throw error;
    return data;
}
