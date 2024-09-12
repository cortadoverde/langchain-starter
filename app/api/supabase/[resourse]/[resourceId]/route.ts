import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { resourse: string, resourceId: string } }) {
    const { data, error } = await supabase.from(params.resourse).select("*").eq("id", params.resourceId);
    if (error) {
        return NextResponse.json({ errors: error }, { status: 500 });
    }

    return NextResponse.json(data);
}