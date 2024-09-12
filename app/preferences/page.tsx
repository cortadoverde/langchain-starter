"use client";
// pages/preferences.js
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Preferences() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [userId, setUserId] = useState<number | null>(null); // Simularemos un ID de usuario

  useEffect(() => {
    // Simula obtener el ID del usuario actual
    setUserId(1); // Puedes implementar la lógica para obtener el usuario actual

    // Cargar preguntas desde Supabase
    async function fetchQuestions() {
        const response = await fetch("/api/supabase/preferences");
        const data = await response.json();
        setQuestions(data);
    }
    
    fetchQuestions();
  }, []);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setResponses({
      ...responses,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const dataSend = Object.keys(responses).map(questionId => ({
        user_id: userId,
        preference_id: questionId,
        selected_option: responses[questionId]
      }));
    const response = await fetch("/api/supabase/user_responses", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ condition: { field: "user_id", value: userId } }),
    });


    const data = await response.json();

    const responseA = await fetch("/api/supabase/user_responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataSend),
    });

    console.log(await responseA.json());

    /*
    // Guardar respuestas en Supabase
    const { error } = await supabase
      .from('user_responses')
      .insert(Object.keys(responses).map(questionId => ({
        user_id: userId,
        preference_id: questionId,
        selected_option: responses[questionId]
      })));

    if (error) console.error(error);
    else alert('Respuestas enviadas con éxito!');
    */
  };

  let className = "bg-white rounded-lg shadow-md p-6 hover:bg-gray-200 transition-colors text-black";

  return (
    <div>
      <h1>Captura de Preferencias del Usuario</h1>
      <form onSubmit={handleSubmit}>
        <div className="w-full grid grid-cols-3 gap-2">
          {questions.map(question => (
            <div key={question.id} className="bg-black rounded-lg shadow-md p-6 flex-auto">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  <label>{question.question}</label>
                </h2>
              
              <div>
                <div className="grid grid-cols-1 gap-4">
                  <label className={className}>
                    <input
                      type="radio"
                      name={question.id}
                      value="A"
                      onChange={handleChange}
                    />
                    {question.option_a}
                  </label> 
                  <label  className={className}>
                  <input
                    type="radio"
                    name={question.id}
                    value="B"
                    onChange={handleChange}
                  />
                  {question.option_b}
                </label>
                {question.option_c && (
                  <label  className={className}>
                    <input
                      type="radio"
                      name={question.id}
                      value="C"
                      onChange={handleChange}
                    />
                    {question.option_c}
                  </label>
                )}
                {question.option_d && (
                    <label  className={className}>
                    <input
                      type="radio"
                      name={question.id}
                      value="D"
                      onChange={handleChange}
                    />
                    {question.option_d}
                  </label>
                )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className='shrink-0 px-8 py-4 bg-sky-600 rounded mt-2 mb-2'>Enviar Preferencias</button>
      </form>
    </div>
  );
}
