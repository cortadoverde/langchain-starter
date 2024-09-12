import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { supabase } from '@/lib/supabase';
import { createClient } from "@supabase/supabase-js";
import { OpenAIClient } from "@/lib/openai";



function calculateAffinity(userPreferences: any[] | null, packageScores: { [x: string]: { [x: string]: number; }; }) {
    let affinityScore = 0;
    if (userPreferences) {
        userPreferences.forEach(preference => {
            const prefId = preference.preference_id;
            const userOption = preference.selected_option;
            
            if (packageScores[prefId] && packageScores[prefId][userOption.toLowerCase()]) {
                // Incrementar el score de afinidad si coincide
                affinityScore += packageScores[prefId][userOption.toLowerCase()];
            }
        });
    }


    return affinityScore;
}

export async function GET(request: NextRequest) {
    const { data, error } = await supabase.from('packages').select("*");
    const { data: userPreferences, error : userPreferencesError } = await supabase.from('user_responses').select("*");
    /*const userPreferences = [
        
            {"id":156,"user_id":1,"preference_id":5,"selected_option":"A"},
            {"id":157,"user_id":1,"preference_id":6,"selected_option":"B"},
            {"id":158,"user_id":1,"preference_id":7,"selected_option":"B"},
            {"id":159,"user_id":1,"preference_id":8,"selected_option":"C"},
            {"id":160,"user_id":1,"preference_id":9,"selected_option":"A"},
            {"id":161,"user_id":1,"preference_id":10,"selected_option":"B"},
            {"id":162,"user_id":1,"preference_id":11,"selected_option":"C"},
            {"id":163,"user_id":1,"preference_id":12,"selected_option":"A"},
            {"id":164,"user_id":1,"preference_id":13,"selected_option":"A"},
            {"id":165,"user_id":1,"preference_id":14,"selected_option":"B"},
            {"id":166,"user_id":1,"preference_id":15,"selected_option":"A"},
            {"id":167,"user_id":1,"preference_id":16,"selected_option":"B"},
            {"id":168,"user_id":1,"preference_id":17,"selected_option":"A"},
            {"id":169,"user_id":1,"preference_id":18,"selected_option":"B"},
            {"id":170,"user_id":1,"preference_id":20,"selected_option":"C"},
            {"id":171,"user_id":1,"preference_id":21,"selected_option":"B"},
            {"id":172,"user_id":1,"preference_id":22,"selected_option":"A"},
            {"id":173,"user_id":1,"preference_id":23,"selected_option":"B"},
            {"id":174,"user_id":1,"preference_id":24,"selected_option":"C"}
          ]
    */
    if (error) {
        return NextResponse.json({ errors: error }, { status: 500 });
    }
    const candidatePackages = data.map(pkg => {
        const affinityScore = calculateAffinity(userPreferences, pkg.score.scores);
        return {
            package_id: pkg.id,
            affinity_score: affinityScore,
        };
    });

    candidatePackages.sort((a, b) => b.affinity_score - a.affinity_score);

    // obtener paquetes segun el nuevo orden de afinidad
    const topPackages = candidatePackages.slice(0, 5);
    const topPackageIds = topPackages.map(pkg => pkg.package_id);
    const topPackageData = data.filter(pkg => topPackageIds.includes(pkg.id));
    // append score
    topPackageData.forEach(pkg => {
        const foundCandidate = candidatePackages.find(candidate => candidate.package_id === pkg.id);
        if (foundCandidate) {
          pkg.affinity_score = foundCandidate.affinity_score;
        }
    });

    topPackageData.sort((a, b) => b.affinity_score - a.affinity_score);
    // formatear el array de userPreferences para enviarlo en el response
    const formattedUserPreferences = userPreferences?.map(preference => {
        return { [preference.preference_id]: preference.selected_option };
    });

    formattedUserPreferences?.sort((a, b) => {
        return Number(Object.keys(a)[0]) - Number(Object.keys(b)[0]);
    })

    return NextResponse.json({
        packages: data,
        userPreferences: formattedUserPreferences,
        candidatePackages: candidatePackages,
        topPackageData
    });
}
