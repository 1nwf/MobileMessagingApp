import { io } from "socket.io-client";

export const server = "https://chatapp-backend3.herokuapp.com/";
export const socket = io(server, { autoConnect: false });
