"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState , useEffect} from "react"
import { Slider } from "@/components/ui/slider"
interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export function Paquetes({ onSubmit }: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  const [tone, setTone] = useState('formal');

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    async function fetchData() {
        const response = await fetch("/api/supabase/preferences");
        const data = await response.json();
        setQuestions(data);
    }
    fetchData();    
  }, []);

  return (
    <div className="grid w-full  mx-auto">
      <Card className="w-full">
        <CardHeader className="bg-primary text-primary-foreground py-4 px-6 rounded-t-md">
          <CardTitle className="text-2xl font-bold">Crear Paquete</CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
        <CardContent>
          <div className="flex flex-col space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="destination">Destino</Label>
              <Input name="destino" id="destination" placeholder="Ingresa el destino" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="includes">Breve descripcion</Label>
              <Textarea name="includes" id="includes" placeholder="Describe lo que incluye el paquete" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="price">Enfoque Formal - Casual</Label>
                <Slider id="price" name="enfoque_formal" defaultValue={[5]} min={0} max={10} step={1} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="price">Enfoque Jovenes - Adultos</Label>
                <Slider id="price"  name="enfoque_edad" defaultValue={[5]} min={0} max={10} step={1} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="price">Emojis</Label>
                <Slider id="price" name="enfoque_emojis" defaultValue={[5]} min={0} max={10} step={1} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="text-length" >Texto Corto - Largo</Label>
              <Slider id="text-length" name="enfoque_longitud" defaultValue={[5]} min={0} max={10} step={1} />
            </div>

            {questions.map((question: Question) => (
              <div key={question.id} className="grid gap-2">
                <Label htmlFor={question.id}>{question.question}</Label>
                <select id={question.id} name={question.id} key={question.id} className="w-full p-2 border border-gray-300 rounded-md">
                    <option value={question.option_a}>{question.option_a}</option>                
                    <option value={question.option_b}>{question.option_b}</option>
                    <option value={question.option_c}>{question.option_c}</option>
                    <option value={question.option_d}>{question.option_d}</option>
                </select>
              </div>
            ))}
          </div>
          
        </CardContent>
        <CardFooter className="flex justify-end p-6 rounded-b-md">
          <Button type="submit" >Crear Paquete</Button>
        </CardFooter>
        </form>
      </Card>
     
    </div>
  )
}

