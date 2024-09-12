import { NextRequest, NextResponse } from "next/server";
import { get as getBinance } from '@/lib/binance';
import { parse } from "path";

import brain from "brain.js";

function parseParameters(params : any): { parameters: any, endpoint: string } {
    let endpoint = params.endpoint[0]; // Tomar el primer elemento del array de endpoints

    const parameters = params.endpoint.slice(1); // Obtener los parámetros restantes

   

    const parsedParams = {};

    for (const param of parameters) {
        const [key, value] = param.split(':'); // Dividir el parámetro en clave y valor

        if( ! value ) {
            endpoint += `/${key}`
        }
        const keys = key.split('.'); // Dividir la clave en partes

        let currentObj: any = parsedParams;

        for (let i = 0; i < keys.length; i++) {
            const currentKey = keys[i];

            if (i === keys.length - 1) {
                // Última parte de la clave
                if (currentObj[currentKey] === undefined) {
                    // Si la clave no existe todavía, asignar el valor directamente
                    currentObj[currentKey] = value;
                } else {
                    // Si la clave ya existe, convertir en un array si no lo es y agregar el valor
                    if (!Array.isArray(currentObj[currentKey])) {
                        currentObj[currentKey] = [currentObj[currentKey]];
                    }
                    currentObj[currentKey].push(value);
                }
            } else {
                // Parte intermedia de la clave
                if (currentObj[currentKey] === undefined) {
                    // Si la clave no existe todavía, crear un objeto vacío
                    currentObj[currentKey] = {};
                }
                currentObj = currentObj[currentKey];
            }
        }
    }

    return { parameters: parsedParams, endpoint }; // Devolver el objeto parsedParams;
}

export async function GET(request: NextRequest, { params }: { params: { endpoint: string[] } }) {
    /* 
    # YAML
    # /openOrders/symbol:PEOPLEUSDT/key1:value1/key2:value2/key3:another/header.cfr:123
    endpoint: openOrders
    parameters:
        symbol: PEOPLEUSDT
        key1: value1
        key2: value2  
        key3: ampther
        header:
            cfr: 123

    [
  { key: 'symbol', value: 'BTCUSDT', disabled: false },
  { key: 'limit', value: '100', disabled: false },
  // otros parámetros
]
    */
try {

    const parsedParams = parseParameters(params);
    console.log(parsedParams);
    let v = 'v1/' + parsedParams.endpoint;
    if( params.endpoint[0].indexOf('v2') > -1 ) {
        v = parsedParams.endpoint;
    }
    const url = `https://fapi.binance.com/fapi/${v}`;
    const dataR = await getBinance(url, parsedParams.parameters);


     // Crear una nueva red neuronal

    const nextTime = 1724202667225; // El próximo timestamp (3 segundos después del último)
    //const prediction = net.run([nextTime]);

    return NextResponse.json({ params, parsedParams, dataR});
} catch (error) {
    console.error("Error in route.ts:", error);
    return NextResponse.json({ error: error.message });
}
    
}
