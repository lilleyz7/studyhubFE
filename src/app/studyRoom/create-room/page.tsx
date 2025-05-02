"use client"

import CheckAuth from "@/app/actions/checkAuth";
import CreateRoom from "@/app/actions/createRoomAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function CreateRoomPage(){
    const [roomName, setRoomName] = useState("");
    const routeController  = useRouter();

    useEffect(() => {
      async function checkAuth(){
        const isAuthenticated = CheckAuth();
        if(!isAuthenticated){
          routeController.push("/login")
        }
      }
      checkAuth()
    }, [routeController])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await CreateRoom(roomName);
        if (res.error){
          alert(res.error);
        }

        routeController.push("/");
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
            <Button type="submit" className="w-full">Create</Button>
          </CardContent>
          {/* <CardFooter className="text-sm text-muted-foreground justify-center">
            Don&apos;t have an account? <a href="/login" className="ml-1 underline">Sign up</a>
          </CardFooter> */}
        </form>
      </Card>
    </div>
    )
}