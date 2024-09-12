import { NextRequest, NextResponse } from "next/server";
import { parseParameters } from '@/lib/utils';
import { get as getBinance } from '@/lib/binance';

export async function GET(request: NextRequest) {

  
    const url = `https://fapi.binance.com/fapi/v2/balanace`;
    const dataR = await getBinance(url, {});

    return NextResponse.json({  dataR});
    
}