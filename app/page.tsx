"use client";
import { useState } from 'react';
import { set } from 'zod';
import { Paquetes } from "@/components/component/paquetes";
import { Planner } from "@/components/component/planner"
import  LoadingDots  from "@/components/ui/loadingdots"
import { isNumber } from 'util';
import { remark } from 'remark';
import html from 'remark-html';
import { describe } from 'node:test';
import { Description } from '@radix-ui/react-dialog';

export default function Home() {

  const [answers, setAnswers] = useState({
    destination: '',
    activity: '',
    budget: '',
    season: '',
  });

  const [response, setResponse] = useState('');
  const [response2, setResponse2] = useState('');
  const [paquete, setPaquete] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setAnswers({ ...answers, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    let formData = new FormData(e.target);
    console.log(Array.from(formData.entries()))
    console.log(e.target)
    let datas: { [key: string]: string } = {};
    let quiz = "";

    interface Longitud {
      [key: number]: string;
    }

    
    
    let valores = {
      Edad: {
        0: "Dirige el contenido al público más joven, posiblemente adolescentes o jóvenes adultos.",
        1: "Dirige el contenido a jóvenes adultos con intereses modernos.",
        2: "Enfoca el contenido en adultos jóvenes con un enfoque en tendencias actuales.",
        3: "Dirige el contenido a adultos de mediana edad, con un enfoque en intereses variados.",
        4: "Enfoca el contenido en adultos de mediana edad, con un tono profesional y accesible.",
        5: "Dirige el contenido a adultos de mediana edad con un enfoque equilibrado en la formalidad y accesibilidad.",
        6: "Enfoca el contenido en adultos mayores, con un tono respetuoso y considerado.",
        7: "Dirige el contenido a un público de edad avanzada, con un enfoque en comodidad y facilidad.",
        8: "Enfoca el contenido en personas mayores, con un enfoque en servicios adaptados a sus necesidades.",
        9: "Dirige el contenido a una audiencia senior, con un tono respetuoso y especializado.",
        10: "Dirige el contenido a un público adulto mayor, con un enfoque en la experiencia y el confort."
      },
      Emojis: {
        0: "Usa emojis de manera abundante para hacer el contenido más expresivo y atractivo.",
        1: "Incorpora emojis frecuentemente para añadir un toque de color y emoción.",
        2: "Usa emojis en moderación para realzar ciertos puntos del contenido.",
        3: "Añade algunos emojis para enfatizar aspectos clave sin sobrecargar el texto.",
        4: "Incorpora emojis ocasionalmente para mantener un equilibrio entre formalidad y expresividad.",
        5: "Usa emojis de forma equilibrada, limitando su uso a elementos destacados.",
        6: "Utiliza emojis de manera mínima para mantener un enfoque más formal.",
        7: "Añade emojis de forma muy limitada para no distraer del contenido principal.",
        8: "Usa uno o dos emojis para un toque sutil y profesional.",
        9: "Emplea emojis solo si es absolutamente necesario y de manera muy reservada.",
        10: "Evita el uso de emojis para mantener una formalidad estricta."
      },
      Formalidad: {
        0: "Utiliza un tono extremadamente informal y amigable.",
        1: "Mantén un tono casual y relajado, adecuado para una conversación entre amigos.",
        2: "Usa un tono ligeramente informal, amigable pero profesional.",
        3: "Enfoca el contenido en un tono accesible y ameno, con algo de formalidad.",
        4: "Mantén un tono moderadamente formal, equilibrando accesibilidad y profesionalismo.",
        5: "Usa un tono formal, pero con toques de accesibilidad para una comunicación efectiva.",
        6: "Mantén un tono formal y profesional, adecuado para una comunicación seria.",
        7: "Utiliza un tono muy formal, con un enfoque en profesionalismo y respeto.",
        8: "Enfoca el contenido en un tono extremadamente formal y respetuoso.",
        9: "Mantén un tono rigurosamente formal y técnico.",
        10: "Usa un tono altamente formal, ideal para documentos oficiales y profesionales."
      },
      Longitud: {
        0: "Genera contenido extremadamente breve, adecuado para mensajes cortos.",
        1: "Crea descripciones muy cortas, con solo la información esencial.",
        2: "Usa texto corto, proporcionando solo los puntos clave.",
        3: "Genera contenido breve, pero cubriendo los aspectos más importantes.",
        4: "Produce un contenido conciso que cubra lo necesario sin detalles extensivos.",
        5: "Mantén una longitud media, proporcionando un equilibrio entre detalle y brevedad.",
        6: "Crea un contenido algo largo, con información detallada pero accesible.",
        7: "Genera contenido extenso, cubriendo todos los detalles relevantes.",
        8: "Proporciona un texto largo y detallado, con una cobertura exhaustiva del tema.",
        9: "Crea descripciones muy largas, detallando todos los aspectos posibles.",
        10: "Genera un contenido extremadamente detallado y extensivo, ideal para documentación completa."
      }
    };
    const dataResponse = formData.entries();

   console.log(dataResponse);

  Array.from(dataResponse).forEach(({ 0: key, 1: value }) => {
    console.log(key, value);
    datas[key] = value.toString();
    if (Number(key) >= 0 && Number(key) <= 50) {
      quiz += `${key}: ${value}\n`;
    }
  })
    const prompTemplate = `
    
    # ENFOQUE DE REDACCION #
    - Edad: ${valores.Edad[Number(datas.enfoque_edad)as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10]}
    - Emojis: ${valores.Emojis[Number(datas.enfoque_emojis)as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10]}
    - Formalidad: ${valores.Formalidad[Number(datas.enfoque_formal)as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10] }
    - Longitud: ${valores.Longitud[Number(datas.enfoque_longitud) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10]}

    --- QUESTIONS ---
    ${quiz}
    --- /QUESTIONS ---
    
    # INPUT #
    Genera una descripción para un paquete turístico para el destino ${datas.destino} con estas caracteristicas
     ${datas.includes}
    `;	

    setPaquete(datas.destino);

    const res = await fetch('/api/suggest/description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompTemplate}),
    });

    if (res.ok) {
      const data = await res.text();

      const processedContent = await remark()
        .use(html)
        .process(data.replaceAll('"',"").replaceAll('\\n', "\n"));
      const contentHtml = processedContent.toString();
      // parse data 
      setLoading(false);
      setResponse(contentHtml);
    }
  };

  const handleSubmit2 = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: response}),
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
          name: paquete,
          description: response
        })        
      })
      setResponse2(data);
    }
  };

  return (
    <div className='w-full'>
      <div className='grid grid-cols-[40%_60%] gap-4 w-full max-w-6xl mx-auto py-5'>
        <Paquetes onSubmit={(e: any) => handleSubmit(e)}  />
        { isLoading ? 
            <div className='flex justify-center'><LoadingDots /></div> 
          : 
            <Planner resultData={response} content={{ paquete, response}} />
        }
      </div>
    </div>
  );
}
