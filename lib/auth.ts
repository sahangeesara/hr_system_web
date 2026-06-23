import { supabase } from './supabase';

export async function getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ?? null;
}

export async function getUserRole() {
    const { data, error } = await supabase.rpc('get_my_role');
    if (error) return null;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}
