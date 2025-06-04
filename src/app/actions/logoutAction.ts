"use server"

import { cookies } from "next/headers"

export default async function LogoutAction(){
    const tokens = await cookies();
    tokens.delete("accessToken");
    tokens.delete("refreshToken");
}