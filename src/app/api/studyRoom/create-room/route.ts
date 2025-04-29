import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    const {roomName} = await req.json();
    const accessToken = req.cookies.get("accessToken");
    console.log(accessToken?.value);

    if (!accessToken){
        return new Response(JSON.stringify({ "error": "no token" }), { status: 401 });
    }

    const url = process.env.API_BASE_URL

    //check this
    const createRoomEndPoint = url + "/api/create-room"

    const options = {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.value}`
        },
        body: JSON.stringify({"roomName": roomName})
    }

    try{
        const response = await fetch(createRoomEndPoint, options)
        if(!response.ok){
            return new Response(JSON.stringify({"error": "bad request", "status": 400}))
        }

        const jsonResponse = await response.json();

        console.log(jsonResponse)
        //check for name convention
        return new Response(JSON.stringify({"data": jsonResponse.data}));
    } catch(e){
        console.log(e + "")
        return new Response(JSON.stringify({"error": e + ""}))
    }

}