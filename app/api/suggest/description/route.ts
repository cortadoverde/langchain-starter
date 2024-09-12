import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { createClient } from "@supabase/supabase-js";
import { OpenAIClient } from "@/lib/openai";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        const template = `
    
        # CONTEXTO #    
        [
        {
            "id": 5,
            "question": "¿Qué tipo de vacaciones prefieres?",
            "option_a": "Relax en la playa",
            "option_b": "Aventura en la montaña",
            "option_c": "Turismo cultural en ciudades",
            "option_d": "Escapadas urbanas"
        },
        {
            "id": 6,
            "question": "¿Cuál es tu destino ideal para unas vacaciones?",
            "option_a": "Playa",
            "option_b": "Montaña",
            "option_c": "Ciudad",
            "option_d": "Campo"
        },
        {
            "id": 7,
            "question": "¿Qué actividades disfrutas hacer durante tus vacaciones?",
            "option_a": "Senderismo y naturaleza",
            "option_b": "Visitas a museos y sitios históricos",
            "option_c": "Practicar deportes acuáticos",
            "option_d": "Disfrutar de la gastronomía local"
        },
        {
            "id": 8,
            "question": "¿Qué tan importante es para ti el confort del alojamiento?",
            "option_a": "Muy importante (prefiero hoteles de lujo)",
            "option_b": "Moderadamente importante (hoteles cómodos o apartamentos)",
            "option_c": "No muy importante (no me importa si es más básico)",
            "option_d": null
        },
        {
            "id": 9,
            "question": "¿Cuál es tu presupuesto típico para unas vacaciones?",
            "option_a": "Bajo",
            "option_b": "Moderado",
            "option_c": "Alto",
            "option_d": null
        },
        {
            "id": 10,
            "question": "¿Qué tipo de clima prefieres en tus vacaciones?",
            "option_a": "Cálido y soleado",
            "option_b": "Frío y nevado",
            "option_c": "Templado y fresco",
            "option_d": "Variable (no tengo una preferencia específica)"
        },
        {
            "id": 11,
            "question": "¿Cuántas horas estás dispuesto a viajar para llegar a tu destino?",
            "option_a": "Menos de 2 horas",
            "option_b": "Entre 2 y 5 horas",
            "option_c": "Más de 5 horas",
            "option_d": null
        },
        {
            "id": 12,
            "question": "¿Qué importancia le das a la vida nocturna y las actividades sociales?",
            "option_a": "Muy importante (me gusta salir y socializar)",
            "option_b": "Moderadamente importante (me gusta, pero no es crucial)",
            "option_c": "No importante (prefiero actividades tranquilas)",
            "option_d": null
        },
        {
            "id": 13,
            "question": "¿Cuál es tu tipo de comida favorita?",
            "option_a": "Comida local y típica",
            "option_b": "Cocina internacional (italiana, japonesa, etc.)",
            "option_c": "Comida rápida y sencilla",
            "option_d": "Comida gourmet y exclusiva"
        },
        {
            "id": 14,
            "question": "¿Qué tipo de transporte prefieres usar durante tus vacaciones?",
            "option_a": "Alquilar un coche",
            "option_b": "Transporte público",
            "option_c": "Bicicleta o caminando",
            "option_d": "Tours organizados"
        },
        {
            "id": 15,
            "question": "¿Qué tipo de experiencias buscas en tus vacaciones?",
            "option_a": "Experiencias culturales y educativas",
            "option_b": "Aventuras y deportes extremos",
            "option_c": "Relajación y bienestar",
            "option_d": "Compras y entretenimiento"
        },
        {
            "id": 16,
            "question": "¿Qué importancia tiene la sostenibilidad y el impacto ambiental en tu elección de destino?",
            "option_a": "Muy importante (busco destinos ecológicos y sostenibles)",
            "option_b": "Moderadamente importante (considero opciones, pero no es decisivo)",
            "option_c": "No importante (no tengo en cuenta la sostenibilidad)",
            "option_d": null
        },
        {
            "id": 17,
            "question": "¿Prefieres viajar solo, en pareja, en familia o en grupo?",
            "option_a": "Solo",
            "option_b": "En pareja",
            "option_c": "En familia",
            "option_d": "En grupo"
        },
        {
            "id": 18,
            "question": "¿Cuál es tu frecuencia ideal para viajar?",
            "option_a": "Una vez al año",
            "option_b": "Un par de veces al año",
            "option_c": "Varias veces al año",
            "option_d": "Viajes frecuentes (cada mes o más)"
        },
        {
            "id": 19,
            "question": "¿Qué tan importante es para ti la oferta de actividades especiales en el destino?",
            "option_a": "Muy importante (me gustan actividades organizadas y eventos especiales)",
            "option_b": "Moderadamente importante (algunas actividades son un plus)",
            "option_c": "No importante (prefiero hacer lo que surja)",
            "option_d": null
        },
        {
            "id": 20,
            "question": "¿Cómo prefieres planificar tus vacaciones?",
            "option_a": "De manera detallada y con itinerario",
            "option_b": "Con algunas actividades planificadas, pero flexibilidad",
            "option_c": "Sin plan específico, me gusta improvisar",
            "option_d": null
        },
        {
            "id": 21,
            "question": "¿Qué tipo de alojamiento prefieres?",
            "option_a": "Hotel",
            "option_b": "Apartamento",
            "option_c": "Cabaña o casa rural",
            "option_d": "Camping"
        },
        {
            "id": 22,
            "question": "¿Cómo te sientes sobre la tecnología y la conectividad durante tus vacaciones?",
            "option_a": "Prefiero desconectar completamente",
            "option_b": "Me gusta tener acceso a internet para mantenerme en contacto",
            "option_c": "Necesito estar siempre conectado para trabajar o comunicarme",
            "option_d": null
        },
        {
            "id": 23,
            "question": "¿Qué importancia le das a la accesibilidad del destino (facilidad para llegar, servicios, etc.)?",
            "option_a": "Muy importante (busco destinos con buena accesibilidad y servicios)",
            "option_b": "Moderadamente importante (es un factor a considerar)",
            "option_c": "No importante (no me importa si es más complicado)",
            "option_d": null
        },
        {
            "id": 24,
            "question": "¿Qué tipo de ambiente prefieres en tu destino de vacaciones?",
            "option_a": "Tranquilo y relajado",
            "option_b": "Animado y bullicioso",
            "option_c": "Con una mezcla de tranquilidad y actividad",
            "option_d": null
        }           
        ]

        # INSTRUCCIONES #
        Crear descripciones basadas en las respuestas asiganadas dentro del bloque --- QUESTIONS --- formatear con markdown, definir el texto basado en las intrucciones de ENFOQUE DE REDACCION

        --- QUESTIONS ---
        %QUESTION_ID%: option_a, option_b, option_c, option_d
        %QUESTION_ID%: option_a, option_b, option_c, option_d
        --- /QUESTIONS ---
        
        # INPUT #
        ${prompt}
        `;  
        

        const prediction =  await OpenAIClient.chat.completions.create({
            messages: [ 
                { role: "user", content: template  },
                // { role: "function", name: "get_city_description", content: JSON.stringify({ city: destino, approach: data.targetAudience  }) }, 
                ],
            model: "gpt-3.5-turbo",
        });
        
     

      return NextResponse.json(prediction.choices[0].message?.content);
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
