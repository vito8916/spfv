//Get ATR for a given symbol
import { format } from "date-fns";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const API_URL = `${process.env.SPFV_API_URL}/spfv-beast`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const endDate = searchParams.get("endDate");

  if (!symbol || !endDate) {
    return NextResponse.json({ error: "Symbol and endDate are required" }, { status: 400 });
  }

  //end date is expiration date in format YYYY-MM-DD
  const endDateFormated = format(endDate!, "yyyy-MM-dd"); 
  //start date is 3 months before end date in format YYYY-MM-DD
  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - 3);
  const startDateFormated = format(startDate, "yyyy-MM-dd");


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
      `${API_URL}?symbolsListRaw=${symbol}&endDate=${endDateFormated}&startDate=${startDateFormated}&beastNumbersOnly=false`, 
      {
        cache: "no-store"
      }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching SPFV Beast data:", error);
    return NextResponse.json(
      { error: "Failed to fetch SPFV Beast data" },
      { status: 500 }
    );
  }
}
