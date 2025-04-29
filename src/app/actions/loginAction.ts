"use server"

import { cookies } from "next/headers"
import ApiResponse from "../types/ApiResponse"
export default async function Login(email: string, password: string){
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
                const responseAsJson = await response.json();
                const apiResponse: ApiResponse = {
                    error: responseAsJson.error,
                    status: response.status
                }
                return apiResponse
            }
            const responseAsJson = await response.json();
            const cookieStore = await cookies();
            console.log(responseAsJson.accessToken);
            cookieStore.set("accessToken", responseAsJson.accessToken)
            cookieStore.set("refreshToken", responseAsJson.refreshToken)
    
            const apiResponse: ApiResponse = {
                error: null,
                status: 200
            }
            return apiResponse
        } catch(e){
            const apiResponse: ApiResponse = {
                error: e + "",
                status: 400
            }
            return apiResponse
        }
}