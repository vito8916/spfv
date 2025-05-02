//Get SPFV Beast data for a given symbol for a single current day
import { format } from "date-fns";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const API_URL = `${process.env.SPFV_API_URL}/spfv-beast`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const endDateParam = searchParams.get("endDate");

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  // If endDate is not provided, default to today
  let endDate: Date;
  try {
    if (endDateParam) {
      // Simply create a new date from the parameter
      endDate = new Date(endDateParam);
    } else {
      endDate = new Date();
    }
  } catch (err) {
    console.error("Error parsing date:", err);
    return NextResponse.json({ error: "Invalid endDate format" }, { status: 400 });
  }

  // Format dates
  const endDateFormatted = format(endDate.setDate(endDate.getDate()), "yyyy-MM-dd");
  
  // For daily view, we want just a single day of data
  // For startDate, use the same day as endDate to get just one day's data
  const startDateFormatted = endDateFormatted;

  console.log("endDateFormatted", endDateFormatted);
  console.log("startDateFormatted", startDateFormatted);


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
      `${API_URL}?symbolsListRaw=${symbol}&endDate=${endDateFormatted}&startDate=${startDateFormatted}&beastNumbersOnly=false`, 
      {
        cache: "no-store"
      }
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

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
