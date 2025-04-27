import { cookies } from "next/headers";

export async function POST(req: Request){
    const { email, password } = await req.json();
    const url = process.env.API_BASE_URL
    const loginEndPoint = url + '/login'
    console.log(loginEndPoint);

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
        console.log(responseAsJson);
        console.log(responseAsJson.accessToken)
        cookieStore.set("accessToken", responseAsJson.accessToken, {httpOnly: true, expires: responseAsJson.expiresIn})
        cookieStore.set("refreshToken", responseAsJson.refreshToken, {httpOnly: true, expires: responseAsJson.expiresIn * 3})


        return new Response(JSON.stringify({status: 200}))
    } catch(e){
        return new Response(JSON.stringify({
            "error": e + "",
            status: 400
        }))
    }
}

