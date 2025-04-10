export async function getSpfvTop() {

    const params = new URLSearchParams({
        type: "dollar",
      });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/spfv/spfv-top?${params.toString()}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    const data = await res.json()



    console.log(data)
    return data.items
}