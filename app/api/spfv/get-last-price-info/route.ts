import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';
// API endpoint to fetch options data (calls/puts)
const API_URL = `${process.env.SPFV_API_URL}/symbol-chain`;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const  endDateTime = searchParams.get('endDateTime');

    if (!symbol || !endDateTime) {
        return NextResponse.json({ error: "Symbol and endDateTime are required" }, { status: 400 });
    }
    
    //Format the endDateTime to YYYYMMDD
    const formattedEndDateTime = format(endDateTime!, 'yyyyMMdd');

    try {
        const apiUrlWithParams = `${API_URL}?symbol=${symbol}&StartDateTime=${formattedEndDateTime}&EndDateTime=${formattedEndDateTime}&callOrPut=BOTH`;
        const response = await fetch(apiUrlWithParams, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });
        const data = await response.json();

    //Get the last price info for the symbol
    const lastPriceInfo = 
        {
            symbol: symbol,
            underlyingPrice: data?.callOptionChain?.underlyingPrice || 0,
            lastTradePrice: data?.callOptionChain?.lastTradePrice || 0,
            lastTradeAmountChange: data?.callOptionChain?.lastTradeAmountChange || 0,
            lastTradePercentChange: data?.callOptionChain?.lastTradePercentChange || 0,
        };
    

    //Get the last price info for the put options
    return NextResponse.json(lastPriceInfo);
    } catch (error) {
        console.error('Error fetching last price info:', error);
        return NextResponse.json({ error: 'Failed to fetch last price info' }, { status: 500 });
    }
}
