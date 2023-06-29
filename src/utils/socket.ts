import { io } from "socket.io-client";

const url = "http://localhost:8000";

export const socket = io(url, {
    autoConnect: false
});