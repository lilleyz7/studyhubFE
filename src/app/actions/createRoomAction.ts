"use server"

import { cookies } from "next/headers";
import TokenError from "../types/TokenError";

export default async function CreateRoom(roomName: string){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    console.log(accessToken);

    if (!accessToken){
        const errorResponse: TokenError = {
            error: "invalid"
        }

        return errorResponse
    }

    const url = process.env.API_BASE_URL

    //check this
    const createRoomEndPoint = url + "/api/StudyRoom/create-room"

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
            const errorResponse: TokenError = {
                error: await response.text()
            }

            return errorResponse;
        }

        const errorResponse: TokenError = {
            error: null
        }

        return errorResponse

    } catch(e){
        const errorResponse: TokenError = {
            error: e + ""
        }

        return errorResponse
    }
}