import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from "next/server";
import brain from "brain.js";


export async function GET(request: NextRequest, { params }: { params: { resourse: string } }) {
    
    try {
      const net = new brain.NeuralNetwork();

      net.train([
        { input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 } },
        { input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 } },
        { input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 } },
      ]);
      
      const output = net.run({ r: 1, g: 0.4, b: 0 }); 
      
      console.log(output);
      
      return NextResponse.json({"ok": true, output});
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }