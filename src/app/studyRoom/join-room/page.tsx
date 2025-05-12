"use client"

import CheckAuth from "@/app/actions/checkAuth";
import { Message } from "@/app/types/ChatMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import checkForAI from "@/lib/checkForAiMessage";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function JoinRoomPage(){
    const [roomName, setRoomName] = useState("");
    const [hasEnteredRoom, setHasEnteredRoom] = useState(false);
    // const [isMounted, setIsMounted] = useState(false);
    const [userName, setUsername] = useState("");
    const [inputContent, setInputContent] = useState("");
    const [messages, setMessages] = useState<Message[]>([]); 
    const studyHubConnection  = useRef<HubConnection | null>(null);
    const router = useRouter();

    useEffect(() => {
      
        async function checkLoginState() {
          const authenticated = await CheckAuth();
          if (!authenticated) {
            router.push("/login");
          }
        }
      
        checkLoginState();
      
        return () => {
          if (studyHubConnection.current) {
            studyHubConnection.current.stop().then(() => {
              console.log("SignalR connection stopped.");
            });
          }
        };
      }, [roomName, router, userName]);

      async function createConnection() {
          const url = "http://localhost:5233";
          if(!url){
            throw new Error("Url does not exist here");
          }
          const hubConnection = new HubConnectionBuilder()
            .withUrl(`${url}/chat`)
            .withAutomaticReconnect()
            .build();
      
          hubConnection.on("ReceiveMessage", (userName, message) => {
              console.log("Message")
            const incomingMessage: Message = {
              userIdentifier: userName,
              content: message,
            };
            setMessages(currentMessages => [...currentMessages, incomingMessage]);
        
          });

          hubConnection.on("ReceiveBulkMessages", (messages: string[]) => {
          const messagesReceived: Message[] = [];

          messages.forEach(message => {
            const incomingMessage: Message = {
              userIdentifier: "OpenAi",
              content: message,
            };
            messagesReceived.push(incomingMessage);
          });
          
          setMessages(currentMessages => [...currentMessages, ...messagesReceived]);
        });

          try {
            await hubConnection.start();
            studyHubConnection.current = hubConnection;
            await getPreviousAiMessages();

          } catch (err) {
            console.error("Connection failed:", err);
          }
    }

    async function getPreviousAiMessages(){
      studyHubConnection.current?.invoke("GetAiMessagesAsync", roomName).catch((err) => {
      console.error(err.toString());
      });
    }

      studyHubConnection.current?.on("UserJoined", (userName, message) => {
        const userJoinedMessage: Message = {
            userIdentifier: userName,
            content: message
        }

        setMessages(current => [...current, userJoinedMessage]);
      })

      studyHubConnection.current?.on("ErrorMessage", (userName, message) => {
        const userJoinedMessage: Message = {
            userIdentifier: userName,
            content: message
        }

        setMessages(current => [...current, userJoinedMessage]);
      })


    const handleRoomJoin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await createConnection();
        studyHubConnection.current?.invoke("JoinRoomAsync", userName, roomName).catch(function (err){
            console.log(err.toString());
        })
        setHasEnteredRoom(true);
        // setIsMounted(true)
    }

    const handleMessageSend = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isAiMessage = checkForAI(inputContent)

        if(isAiMessage){
          await studyHubConnection.current?.invoke("SendAiRequestAsync", roomName, userName, inputContent).catch(function (err) {
            setInputContent("");
            return console.error(err.toString());
        })
        }
        else{
        await studyHubConnection.current?.invoke("SendMessageAsync", roomName, userName, inputContent).catch(function (err) {
            setInputContent("");
            return console.error(err.toString());
        })}
        setInputContent("");
    }

    if(!hasEnteredRoom){
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <form onSubmit={handleRoomJoin}>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Join Study Room</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomName">Username</Label>
              <Input
                id="roomName"
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
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
    )}

    else{
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <form onSubmit={handleMessageSend}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                type="text"
                placeholder="Enter Message"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">Create</Button>
          </CardContent>
        </form>
      </Card>
      <div>
            {messages.map((message, index) => (
                <p key={index}>{message.content}</p>
            ))}
        </div>
    </div>
    )}

}
