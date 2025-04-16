import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';
// API endpoint to fetch options data (calls/puts)
const API_URL = `${process.env.SPFV_API_URL}/symbol-chain`;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const  endDateTime = searchParams.get('endDateTime');
    
    //Format the endDateTime to YYYYMMDD
    //const formattedEndDateTime = endDateTime ? format(endDateTime, 'yyyyMMdd') : undefined;

    try {
        const apiUrlWithParams = `${API_URL}?symbol=${symbol}&StartDateTime=${endDateTime}&EndDateTime=${endDateTime}&callOrPut=BOTH`;
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
            underlyingPrice: data?.callOptionChain?.underlyingPrice,
            lastTradePrice: data?.callOptionChain?.lastTradePrice,
            lastTradeAmountChange: data?.callOptionChain?.lastTradeAmountChange,
            lastTradePercentChange: data?.callOptionChain?.lastTradePercentChange,
        };
    

    //Get the last price info for the put options
    return NextResponse.json(lastPriceInfo);
    } catch (error) {
        console.error('Error fetching last price info:', error);
        return NextResponse.json({ error: 'Failed to fetch last price info' }, { status: 500 });
    }
}
