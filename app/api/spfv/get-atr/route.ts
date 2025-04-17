//Get ATR for a given symbol

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=ATR&symbol=${symbol}&interval=daily&time_period=14&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching ATR data:", error);
    return NextResponse.json(
      { error: "Failed to fetch ATR data" },
      { status: 500 }
    );
  }
}
