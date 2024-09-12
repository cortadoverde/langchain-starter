
"use client";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon, ArrowUpIcon, MenuIcon } from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from "@/components/ui/navigation-menu"


import { useState, useEffect , useRef } from 'react'
export function Header() {

    const [price, setPrice] = useState(0);
    const [order, setOrder] = useState(null);
    const [symbol, setSymbol] = useState("PEOPLEUSDT");
    const [intervalId, setInvervalId] = useState(null);
    const [PNL, setPNL] = useState(0);

     async function calcPNL() {
        
        const res = await fetch(`/api/binance/v2/balance`);
        const data = await res.json();
        if( data.dataR.length > 0) {
            data.dataR.forEach(element => {
                if(element.asset == 'USDT') {
                    setPNL(element.crossUnPnl)
                }
            })
        }
    }

    useEffect(() => {

        async function getPrice() {
            try {
                const res = await fetch(`/api/binance/ticker/price/symbol:${symbol}`);
                const data = await res.json();
                setPrice(data.dataR.price);
                calcPNL();
            } catch (error) {
                //console.error("Error fetching price:", error);
            }
        }

        // Fetch price immediately and then every 2 seconds
        getPrice();
        //const newIntervalId = setInterval(getPrice, 3000);
        // setInvervalId(newIntervalId);
        // Cleanup interval on component unmount
        return () => null;
    }, [symbol]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                {/* Logo y navegación */}
                <div className="flex items-center">
                    <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                        <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                <a
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                    href="/"
                                >
                                    <div className="mb-2 mt-4 text-lg font-medium">
                                    Crypto Dashboard
                                    </div>
                                    <p className="text-sm leading-tight text-muted-foreground">
                                    Visualiza y analiza tus criptomonedas favoritas
                                    </p>
                                </a>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                <a href="/portfolio">Portfolio</a>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                <a href="/market">Mercado</a>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink asChild>
                                <a href="/news">Noticias</a>
                                </NavigationMenuLink>
                            </li>
                            </ul>
                        </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Componente de criptomoneda */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                    <Input
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className="max-w-[120px] text-sm"
                        aria-label="Nombre de la criptomoneda"
                    />
                    </div>
                    <div className="hidden sm:block font-bold">${price.toLocaleString()}</div>
                    <div className={`hidden md:flex items-center ${PNL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {PNL >= 0 ? (
                        <ArrowUpIcon className="mr-1 h-4 w-4" />
                    ) : (
                        <ArrowDownIcon className="mr-1 h-4 w-4" />
                    )}
                    <span className="text-sm font-semibold">
                        ${Math.abs(PNL).toLocaleString()}
                    </span>
                    </div>
                </div>

                {/* Botón de menú para móviles */}
                <Button variant="ghost" size="icon" className="md:hidden">
                    <MenuIcon className="h-6 w-6" />
                    <span className="sr-only">Abrir menú</span>
                </Button>
                </div>
            </div>
        </header>

        
    );
}
