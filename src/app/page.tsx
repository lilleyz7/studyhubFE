"use client"

import { useEffect } from "react";
import CheckAuth from "./actions/checkAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth(){
      const isLoggedIn = await CheckAuth();
      if (!isLoggedIn){
        router.push("/login");
      }
    }

    checkAuth();
  })
  return (
    <div >
      
    </div>
  );
}
