import { NextRequest, NextResponse } from "next/server";
import { parseParameters } from '@/lib/utils';
import { get as getBinance } from '@/lib/binance';
import { parse } from "path";
import { promises as fs } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest, { params }: { params: { proxy: string[] } }) {
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
    const proxy = params.proxy;
    const proxyName = params.proxy.shift();
    const parsedParams =parseParameters( { endpoint: proxy });//parseParameters(params.proxy);
    // specific file
    const pathFileEndpoint = join(...proxy);
    const basePath = join(process.cwd(), 'lib', 'proxy', proxyName);
    console.log(pathFileEndpoint);
    const endpointPath = join(basePath, '[...endpoint]', 'route.ts');
    const specificEndpointPath = join(basePath, pathFileEndpoint, 'route.ts');
    let moduleToLoad;
    try {
        console.log(specificEndpointPath)
        await fs.access(specificEndpointPath);
        moduleToLoad = `${pathFileEndpoint.replaceAll('\\', '/')}/route`;
    } catch (error) {
        try {
            await fs.access(endpointPath);
            moduleToLoad = `[...endpoint]/route`;
        } catch (error) {
        }
    }

    try {
        if( ! moduleToLoad ) {
            return NextResponse.json({ error: `Endpoint ${proxyName} not found` }, { status: 404 });
        }
        // Verificar si el archivo existe
        const endpointModule = await import(`@/lib/proxy/${proxyName}/${moduleToLoad}`);
            
        if (endpointModule.GET) {
            // Invocar el método GET exportado
            //return NextResponse.json({ error: `@/lib/proxy/${proxyName}/${moduleToLoad}` }, { status: 404 });
            return await endpointModule.GET(request, { params: { endpoint: proxy } });
        } else {
            return NextResponse.json({ error: `GET method not found in ${proxyName}` }, { status: 404 });
        }
        //const endpointModule = await import(`@/lib/proxy/${proxyName}/[...endpoint]/route`);

        console.log(`@/lib/proxy/${proxyName}/[...endpoint]/route` == moduleToLoad);

        // Importar dinámicamente el módulo
        
        //return NextResponse.json({ error: `GET method not found in ${proxyName}` }, { status: 404 });
        // Verificar si el método GET está exportado
        return NextResponse.json({ error: `Endpoint ${proxyName} not found or error occurred: ${error.message}` }, { status: 404 });
        
    } catch (error) {
        // Si el archivo no existe o hay otro error, devolver un error
        return NextResponse.json({ error: `Endpoint ${proxyName} not found or error occurred: ${error.message}` }, { status: 404 });
    }
   

    return NextResponse.json({ error: `GET method not found in ${proxyName}` }, { status: 404 });
}
