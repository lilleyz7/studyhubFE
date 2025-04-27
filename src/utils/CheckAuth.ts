import { cookies } from "next/headers";

export async function CheckAuth(){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    if(accessToken){
        return true;
    }

    const refreshToken = cookieStore.get("refreshToken");

    if(refreshToken){
        await handleRefresh(refreshToken.value);
        return true
    }
    return false;
}

async function handleRefresh(refreshToken: string): Promise<boolean>{
    const url = process.env.API_BASE_URL + "/refresh"
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify(refreshToken)
    }

    const response = await fetch(url, options)
    if (response.status != 200){
        return false
    }

    const tokenData= await response.json()
    const cookieStore = await cookies()
    cookieStore.set("access", tokenData.accessToken, {httpOnly: true, expires: tokenData.expiresIn})
    cookieStore.set("refresh", tokenData.refreshToken, {httpOnly: true,expires: tokenData.expiresIn})
    return true
}