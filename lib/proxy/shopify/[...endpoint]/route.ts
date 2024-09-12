import { NextRequest, NextResponse } from "next/server";
import { parseParameters } from '@/lib/utils';
import { get as getBinance } from '@/lib/binance';
import * as client from '../client';

export async function GET(request: NextRequest, { params }: { params: { endpoint: string[] } }) {

    const dataR = await client.getAllProducts();

    return NextResponse.json({ data  : dataR.products[0]});
    
}
