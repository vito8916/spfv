import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    const type = request.nextUrl.searchParams.get('type')

    if (!type) {
        return NextResponse.json({ error: 'Type is required' }, { status: 400 })
    }

    if (type !== 'percent' && type !== 'dollar') {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    

    const response = await fetch(`https://spfv.optionalitytrading.com/api/v1.0/SpfvApi/spfv-top?type=${type}`)
    const data = await response.json()
    return NextResponse.json(data)
}




