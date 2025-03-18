import { NextRequest, NextResponse } from 'next/server';

// API endpoint to fetch options data (calls/puts)
const API_URL = process.env.SPFV_API_URL;

export async function GET(request: NextRequest) {
    try {
        // Parse search parameters
        const searchParams = request.nextUrl.searchParams;
        const symbol = searchParams.get('symbol');
        const startDateTime = searchParams.get('StartDateTime');
        const endDateTime = searchParams.get('EndDateTime');
        const callOrPut = searchParams.get('callOrPut');
        //const type = searchParams.get('type');

        // Validate required parameters
        if (!symbol || !startDateTime || !endDateTime || !callOrPut) {
            return NextResponse.json(
                { error: 'Missing required parameters: symbol ' },
                { status: 400 }
            );
        }

        // Construct the API URL with parameters
        const apiUrlWithParams = `${API_URL}?symbol=${symbol}&StartDateTime=${startDateTime}&EndDateTime=${endDateTime}&callOrPut=${callOrPut}`;

        // Fetch data from external API
        const response = await fetch(apiUrlWithParams, {
            headers: {
                'Content-Type': 'application/json',
                // Add any required API keys or authentication headers
            },
        });

        // Check if the external API request was successful
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        // Parse the response data
        const data = await response.json();

        // Return the data
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching options data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch options data' },
            { status: 500 }
        );
    }
}