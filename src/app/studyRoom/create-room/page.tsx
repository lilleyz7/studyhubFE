"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckAuth } from "@/utils/CheckAuth";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CreateRoomPage(){
    const [roomName, setRoomName] = useState("");
    const routeController  = useRouter();

    useEffect(() => {
        async function isAuthenticated(){
          const authorized = await CheckAuth();
          if(!authorized){
            routeController.push("/login")
          }
        }

        isAuthenticated();
    }, [routeController])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = "/api/login"
        const method = "POST"
    
        const options = {
          method: method,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "roomName": roomName,
          })
        }
    
        try{
          const response = await fetch(url, options);
          if(!response.ok){
            console.log("Failed to fetch");
            console.log(response.statusText)
          } else{
            routeController.push("/")
          }
        } catch(e){
          console.log(e);
        }
    }

    return(
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create a new Study Room</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Name for your room</Label>
              <Input
                id="roomName"
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </CardContent>
          {/* <CardFooter className="text-sm text-muted-foreground justify-center">
            Don&apos;t have an account? <a href="/login" className="ml-1 underline">Sign up</a>
          </CardFooter> */}
        </form>
      </Card>
    </div>
    )
}