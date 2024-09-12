"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { MouseEvent, useState } from "react"

export function Planner({ resultData, content }: { resultData: any, content: any }) {
    const [response2, setResponse2] = useState(null);
    const handleSubmit2 = async (e: any) => {
        e.preventDefault();
    
        const res = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: content.response}),
        });
    
        if (res.ok) {
          const data = JSON.parse(await res.json());
    
    
          await fetch('/api/supabase/packages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              score: data,
              name: content.paquete,
              description: content.response
            })        
          })
          setResponse2(data);
        }
      };
  return (

    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-primary-foreground text-primaryd py-4 px-6 rounded-t-md">
          <CardTitle className="text-2xl font-bold">Previsualización</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6 bg-primary text-muted-foreground ">
          <div className="prose">
            {
              resultData 
                ? 
                <>
                    <AudioPlayer text={resultData} />
                    <div dangerouslySetInnerHTML={{ __html: resultData }} />
                </>
                : <p>comienza a crear tu paquete</p>
            }      
          </div>
          <div className="grid gap-4">
            {
              resultData &&
              <Button className="bg-primary-foreground text-primary rounded-md" onClick={(e) => handleSubmit2(e)}>Guardar</Button>
            }
          </div>
          <div className="grid gap-4 bg-primary-foreground">
                <pre>{JSON.stringify(response2, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SpeakerButton({ content }: { content: string }) {
    const [response, setResponse] = useState(null);
  
    const handleClick = async () => {
      const res = await fetch('/api/parla', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
  
      if (res.ok) {
        const data = JSON.parse(await res.json());
        setResponse(data);
      }
    };
  
    return (
      <div>
        <button onClick={handleClick}>
            leer
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2a10 10 0 0 0-7.54 16.47l1.91-1.91A7 7 0 1 1 12 4V2zm0 16a8 8 0 1 1 0-16v2a6 6 0 1 0 0 12v2z" />
          </svg>
        </button>
        {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      </div>
    );
  }

  export function AudioPlayer({ text }: { text: string }) {
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
  
    const handleClick = async () => {
      const res = await fetch('/api/parla', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
  
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioSrc(url);
      } else {
        console.error('Failed to fetch audio');
      }
    };
  
    return (
      <div>
        <button onClick={handleClick} className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50
    ">Crear audio</button>
        {audioSrc && (
          <audio controls>
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    );
  }