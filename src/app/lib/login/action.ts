'use server'

import { cookies } from "next/headers";

export async function AttemptLogin(formData: FormData){
    const apiBaseEndPoint = process.env.API_BASE_URL;
    const loginEndPoint = apiBaseEndPoint + "/login" 

    const email = formData.get("email");
    const password = formData.get("password");

    const options = {
        method: "post",
        headers: {
            "Content-Type": "application-json"
        },
        body: JSON.stringify({
            "email": email, "password": password
        }) 
    }

    try{
        const response = await fetch(loginEndPoint, options)
        if(!response.ok){
            return new Error("Invalid combination");
        }

        const responseAsJson = await response.json();
        const cookieStore = await cookies()
        cookieStore.set("accessToken", responseAsJson.accessToken, {httpOnly: true, expires: responseAsJson.expiresIn})
        cookieStore.set("refreshToken", responseAsJson.refreshToken, {httpOnly: true, expires: responseAsJson.expiresIn * 3})

    } catch(e){
        console.log(e);
        return new Error(e + "")
    }
}