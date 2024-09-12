import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { resourse: string } }) {
  try {
    const postData = await request.json();
    const { resourse } = params;
    const { data, error } = await supabase.from(resourse).insert(postData);
    
    if (error) {
        return NextResponse.json({ errors: error }, { status: 500 });
    }
    /*

    -*/
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { resourse: string } }) {
  try {
      const { resourse } = params;
      let data;
      const { data: responseData, error } = await supabase.from(resourse).select("*");  
  
      if (error) {
          return NextResponse.json({ errors: error }, { status: 500 });
      }
  
      data = responseData;
      return NextResponse.json(data);
  } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
  }
}


export async function PUT(request: NextRequest, { params }: { params: { resourse: string } }) {
  try {
    const postData = await request.json();
    const { resourse } = params;
    let data; // Declare the 'data' variable
    postData.forEach(async (post: any) => {
       await supabase.from(resourse)
          .update({selected_option: post.selected_option})
          .eq('user_id', post.user_id)
          .eq('preference_id', post.preference_id)
          .select()
          ;

    })
    
    
    /*

    -*/
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { resourse: string } }) {
  try {
    const {condition} = await request.json();
    console.log(condition);
    const { resourse } = params;
    const { data, error } = await supabase.from(resourse).delete().eq(condition.field, condition.value);
    
    if (error) {
        return NextResponse.json({ errors: error }, { status: 500 });
    }
    /*

    -*/
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}