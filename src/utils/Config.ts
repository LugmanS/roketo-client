import { io } from "socket.io-client";

export const baseURL = 'https://api.roketo.cloud';

export const socket = io(baseURL, {
    autoConnect: false
});