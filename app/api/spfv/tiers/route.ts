import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const TIERS_API_URL = `${process.env.SPFV_API_URL}/updown`;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");
    const expirationDate = searchParams.get("expirationDate");

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
      `${TIERS_API_URL}?symbol=${symbol}&expirationDate=${expirationDate}`
    );

    if (!response.ok) {
      console.error("Failed to fetch tiers", await response.text());
      return NextResponse.json(
        { error: "Failed to fetch tiers" },
        { status: response.status || 500 }
      );
    }

    const tiers = await response.json();
    return NextResponse.json(tiers);
  } catch (error) {
    console.error("Unexpected server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
