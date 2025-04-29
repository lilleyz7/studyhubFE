import { cookies } from "next/headers";

export async function POST(req: Request){
    const { email, password } = await req.json();
    const url = process.env.API_BASE_URL
    const loginEndPoint = url + '/login'

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
        const response = await fetch(loginEndPoint, options)
        if(!response.ok){
            return new Response(JSON.stringify({ response }), { status: 401 });
        }
        const responseAsJson = await response.json();
        const cookieStore = await cookies()
        cookieStore.set("accessToken", responseAsJson.accessToken, {expires: 36000})
        cookieStore.set("refreshToken", responseAsJson.refreshToken, {expires: 100000})


        return new Response(JSON.stringify({status: 200}))
    } catch(e){
        return new Response(JSON.stringify({
            "error": e + "",
            status: 400
        }))
    }
}

