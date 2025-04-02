import { NextRequest, NextResponse } from "next/server";
// API endpoint to fetch options data (calls/puts)
const API_URL = `${process.env.SPFV_API_URL}/symbol-value-live`;

export async function GET(request: NextRequest) {
  try {
    // Parse search parameters
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get("symbol");
    const expiration = searchParams.get("expiration");
    const strike = searchParams.get("strike");
    const callPutIndicator = searchParams.get("callPutIndicator");

    /* //check if user is authenticated
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        } */

    // Validate required parameters
    if (!symbol || !expiration || !strike || !callPutIndicator) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters. Required: symbol, expiration, strike, callPutIndicator",
        },
        { status: 400 }
      );
    }

    // Construct the API URL with parameters
    const apiUrlWithParams = `${API_URL}?symbol=${symbol}&expiration=${expiration}&strike=${strike}&callPutIndicator=${callPutIndicator}`;

    // Fetch data from external API
    const response = await fetch(apiUrlWithParams, {
      headers: {
        "Content-Type": "application/json",
        // Add any required API keys or authentication headers
      },
    });

    if (response.status === 400) {
      return NextResponse.json(
        { error: "No data found for the given parameters" },
        { status: 400 }
      );
    }

    // Check if the external API request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} - ${errorText}`);
      throw new Error(`API responded with status: ${response.status}`);
    }

    // Parse the response data
    const data = await response.json();

    // Return the original API response structure
    // The component will handle the data formatting
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching options data:", error);
    return NextResponse.json(
      { error: "Failed to fetch options data" },
      { status: 500 }
    );
  }
}
