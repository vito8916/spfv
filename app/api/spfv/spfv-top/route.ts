import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const SPFV_TOP_API_URL = `${process.env.SPFV_API_URL}/spfv-top`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    console.log("searchParams", searchParams);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    if (type !== "percent" && type !== "dollar") {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Authentication check
    /* const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    console.log(user);
    console.log(authError);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } */

    const response = await fetch(`${SPFV_TOP_API_URL}?type=${type}`);

    if (!response.ok) {
      console.error("Failed to fetch SPFV top", await response.text());
      return NextResponse.json(
        { error: "Failed to fetch SPFV top" },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching SPFV top:", error);
    return NextResponse.json(
      { error: "Failed to fetch SPFV top" },
      { status: 500 }
    );
  }
}
