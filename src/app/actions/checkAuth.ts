"use server"

import { cookies } from "next/headers"

export default async function CheckAuth(){
    const cookieStore = await cookies();
    return cookieStore.has("accessToken");

}