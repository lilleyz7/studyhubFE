import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export class StudyRoomService{
    public signalrHubConnection: HubConnection | null = null;

    constructor(){}

    public createHubConnection(){
        const baseUrl = process.env.API_BASE_URL;

        this.signalrHubConnection = new HubConnectionBuilder()
        .withUrl(baseUrl + "/chat")
        .withAutomaticReconnect()
        .build();

        this.signalrHubConnection.start()
    }

}