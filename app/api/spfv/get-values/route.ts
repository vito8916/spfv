import { createClient } from "@/utils/supabase/server";

import { NextResponse } from "next/server";

const TIERS_API_URL = `${process.env.SPFV_API_URL}/symbol-multi-value-live`;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");
    const expirationDate = searchParams.get("expirationDate");

    // format the expiration date to MM-DD-YYYY
    //
   // const formattedExpirationDate = format(expirationDate, "MM-dd-yyyy");

    if (!symbol || !expirationDate) {
      return NextResponse.json(
        { error: "Symbol and expiration are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${TIERS_API_URL}?expiration=${expirationDate}&symbol=${symbol}`,
      {
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch tiers", await response.text());
      return NextResponse.json(
        { error: "Failed to fetch tiers" },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
