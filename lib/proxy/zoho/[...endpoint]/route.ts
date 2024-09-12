import { NextRequest, NextResponse } from "next/server";
import { parseParameters } from '@/lib/utils';
import { get as getBinance } from '@/lib/binance';
import { client } from '../client';
export async function GET(request: NextRequest, { params }: { params: { endpoint: string[] } }) {
    
    //const dataR = "";
    try {
        
        const dataR = await client.getProducts();
        return NextResponse.json({ data: dataR});
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    
}
