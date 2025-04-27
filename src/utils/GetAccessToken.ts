import { cookies } from "next/headers";

export default async function GetAccessToken(){
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken");

    if(accessToken){
        return accessToken.value;
    } else{
        return null;
    }
}