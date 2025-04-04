import { NextRequest, NextResponse } from 'next/server';

// API endpoint to fetch options data (calls/puts)
const API_URL = `${process.env.SPFV_API_URL}/symbol-chain`;

export async function GET(request: NextRequest) {
    try {
        // Parse search parameters
        const searchParams = request.nextUrl.searchParams;
        const symbol = searchParams.get('symbol');
        const startDateTime = searchParams.get('StartDateTime')?.replace(/-/g, '');
        const endDateTime = searchParams.get('EndDateTime')?.replace(/-/g, '');
        const callOrPut = searchParams.get('callOrPut');

        // Validate required parameters
        if (!symbol || !startDateTime || !endDateTime || !callOrPut) {
            return NextResponse.json(
                { error: 'Missing required parameters. Required: symbol, StartDateTime, EndDateTime, callOrPut' },
                { status: 400 }
            );
        }

        // Construct the API URL with parameters
        const apiUrlWithParams = `${API_URL}?symbol=${symbol}&StartDateTime=${startDateTime}&EndDateTime=${endDateTime}&callOrPut=${callOrPut}`;
        console.log(`Requesting data from external API: ${apiUrlWithParams}`);

        if (!API_URL) {
            console.error('SPFV_API_URL environment variable is not defined');
            return NextResponse.json(
                { error: 'API configuration error - Missing API URL' },
                { status: 500 }
            );
        }

        // Fetch data from external API
        const response = await fetch(apiUrlWithParams, {
            headers: {
                'Content-Type': 'application/json',
                // Add any required API keys or authentication headers
            },
            cache: 'no-store'
        });

        // Check if the external API request was successful
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error: ${response.status} - ${errorText}`);
            return NextResponse.json(
                { error: `External API error: ${response.status} - ${response.statusText}` },
                { status: response.status }
            );
        }

        // Parse the response data
        const data = await response.json();
        console.log(`Data received from external API for ${symbol}, strikes: ${data?.callOptionChain?.strikes?.length || 0} calls, ${data?.putOptionChain?.strikes?.length || 0} puts`);

        // Return the original API response structure
        // The component will handle the data formatting
        return NextResponse.json(data);

    } catch (error) {
        let errorMessage = 'Failed to fetch options data';
        
        if (error instanceof Error) {
            errorMessage = error.message;
            console.error('Error fetching options data:', error.message);
            console.error('Stack:', error.stack);
        } else {
            console.error('Unknown error type:', error);
        }
        
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}