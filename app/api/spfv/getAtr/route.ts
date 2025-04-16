//Get ATR for a given symbol

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const atrPeriod = searchParams.get("atrPeriod");

    const response = await fetch(`https://www.alphavantage.co/query?function=ATR&symbol=${symbol}&interval=daily&time_period=${atrPeriod}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);
    const data = await response.json();
    return NextResponse.json(data);
}