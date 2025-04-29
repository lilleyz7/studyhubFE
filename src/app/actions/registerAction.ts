"use server"

import ApiResponse from "../types/ApiResponse"
export default async function Register(email: string, password: string){
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
                const responseAsJson = await response.json();
                const apiResponse: ApiResponse = {
                    error: responseAsJson.error,
                    status: response.status
                }
                return apiResponse
            }
    
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