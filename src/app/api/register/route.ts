
export async function POST(req: Request){
    const { email, password } = await req.json();
    const url = process.env.API_BASE_URL
    const registrationEndPoint = url + '/register'

    const options = {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    }

    try{
        const response = await fetch(registrationEndPoint, options)
        if(!response.ok){
            return new Response(JSON.stringify({ response }), { status: 401 });
        }
        return new Response(JSON.stringify({status: 200}))
    } catch(e){
        return new Response(JSON.stringify({
            "error": e + "",
            status: 400
        }))
    }
}

