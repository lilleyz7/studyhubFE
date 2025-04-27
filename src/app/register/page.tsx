"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password != passwordConfirm){
        console.log("Passwords do not match")
        console.log(password + "does not equal" + passwordConfirm)
        alert("Passwords do not match");
    } else{
      const url = "/api/register"
      const method = "POST"
  
      const options = {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "email": email,
          "password": password
        })
      }
  
      try{
        const response = await fetch(url, options);
        if(!response.ok){
          console.log("Failed to fetch");
          console.log(response.statusText)
        } else{
          router.push("/login")
        }
      } catch(e){
        console.log(e);
      }
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login to your account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                minLength={7}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirm}
                minLength={7}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground justify-center">
            Don&apos;t have an account? <a href="/login" className="ml-1 underline">Sign up</a>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
