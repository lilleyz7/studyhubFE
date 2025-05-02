import CheckAuth from "@/app/actions/checkAuth";
import { Message } from "@/app/types/ChatMessage";
import { StudyRoomService } from "@/app/types/StudyRoomService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JoinRoomPage(){
    const [roomName, setRoomName] = useState("");
    const [hasEnteredRoom, setHasEnteredRoom] = useState(false);
    const [userName, setUsername] = useState("");
    const [inputContent, setInputContent] = useState("");
    const [messages, setMessages] = useState<Message[]>([]); 
    const [studyRoomService, setStudyRoomService] = useState<StudyRoomService | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function checkLoginState(){
            const authenticationState = await CheckAuth();
            if(!authenticationState){
                router.push("/login");
            }
        } 
        checkLoginState();
    },[router])

    // useEffect(() => {

    // }, [messages])

    studyRoomService?.signalrHubConnection?.on("ReceiveMessage", (userName, message) => {
        const incomingMessage: Message = {
            userIdentifier: userName,
            content: message
        }
        setMessages(currentMessage => [...currentMessage, incomingMessage]);
    })

    const handleRoomJoin = () => {
        setStudyRoomService(new StudyRoomService());
        setHasEnteredRoom(true);
    }

    const handleMessageSend = async () => {
        await studyRoomService?.signalrHubConnection?.invoke("SendMessageAsync", roomName, userName, inputContent).catch(function (err) {
            return console.error(err.toString());
        });
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
                placeholder="Room Name"
                value={roomName}
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
            {messages.map(message => (
                <p key={message.userIdentifier}>{message.content}</p>
            ))}
        </div>
    </div>
    )}

}
