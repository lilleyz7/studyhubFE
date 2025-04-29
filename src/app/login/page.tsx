"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Login from "../actions/loginAction";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await Login(email, password);
    if (res.error){
      setError(res.error);
    }
    router.push("/studyRoom/create-room");
  };

  return ( 
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <p>{error}</p>
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground justify-center">
            Don&apos;t have an account? <a href="/register" className="ml-1 underline">Sign up</a>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
