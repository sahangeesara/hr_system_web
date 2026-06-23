// PATCH: Update status
import {NextResponse} from "next/server";
import {supabase} from "@/lib/supabase";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { payment_status } = await req.json();

    const { data, error } = await supabase
        .from('payrolls')
        .update({ payment_status, updated_at: new Date() })
        .eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
}
