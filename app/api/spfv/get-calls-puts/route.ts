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
        const desiredStrike = searchParams.get('desiredStrike');
        const nearTheMoney = searchParams.get('nearTheMoney');
        const strikeCount = searchParams.get('strikeCount') || '20';

        // Validate required parameters
        if (!symbol || !startDateTime || !endDateTime || !callOrPut) {
            return NextResponse.json(
                { error: 'Missing required parameters. Required: symbol, StartDateTime, EndDateTime, callOrPut' },
                { status: 400 }
            );
        }

        // Construct the API URL with parameters
        let apiUrlWithParams = `${API_URL}?symbol=${symbol}&StartDateTime=${startDateTime}&EndDateTime=${endDateTime}&callOrPut=${callOrPut}`;
        
        // Add optional parameters if they exist
        if (desiredStrike) {
            apiUrlWithParams += `&desiredStrike=${desiredStrike}`;
        }
        
        if (nearTheMoney && nearTheMoney === 'true') {
            apiUrlWithParams += '&nearTheMoney=true';
        }
        
        if (strikeCount) {
            apiUrlWithParams += `&strikeCount=${strikeCount}`;
        }

        // Fetch data from external API
        const response = await fetch(apiUrlWithParams, {
            headers: {
                'Content-Type': 'application/json',
                // Add any required API keys or authentication headers
            },
        });

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
        console.error('Error fetching options data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch options data' },
            { status: 500 }
        );
    }
}