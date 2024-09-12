import { get as getBinance } from '@/lib/binance';

import { NextRequest, NextResponse } from "next/server";

interface CustomNextRequest extends NextRequest {
  query: {
    symbol?: string;
  };
}

export async function GET(request: CustomNextRequest) {

    // obtener predicciones

    let symbol = "PEOPLEUSDT";

    // obtener los precios de mercado
    const price = await getBinance(
      "https://fapi.binance.com/fapi/v1/ticker/price",
      {
        symbol: symbol
      }
    );

    
  try {

    /*

    -*/
    return NextResponse.json(price);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
