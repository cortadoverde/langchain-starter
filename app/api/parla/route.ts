import { NextRequest, NextResponse } from "next/server";
import { supabase } from '@/lib/supabase';
import { OpenAIClient } from "@/lib/openai";

async function generateSpeech(text: any) {
    const mp3 = await OpenAIClient.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });
  
    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer;
  }

export async function POST(req: NextRequest, res: NextResponse) {
  const { text } = await req.json();
  const audioBuffer = await generateSpeech(text);

  return new NextResponse(audioBuffer);

}