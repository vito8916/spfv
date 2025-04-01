//get symbols from SPFV_API_URL/symbol-list cache it for 5 hours

import { NextResponse } from "next/server";

async function getSymbols() {
    const response = await fetch(`${process.env.SPFV_API_URL}/symbol-list`);
    const data = await response.json();
    return data;
}

export async function GET() {
    const data = await getSymbols();
    return NextResponse.json(data, {
        headers: {
            'Cache-Control': 'max-age=18000, s-maxage=18000, stale-while-revalidate=18000' // 5 hours in seconds
        }
    });
}