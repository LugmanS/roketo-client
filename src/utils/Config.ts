import { io } from "socket.io-client";

export const baseURL = 'https://api.roketo.cloud';

export const githubURL = 'https://github.com/LugmanS/roketo-server';

export const socket = io(baseURL, {
    autoConnect: false
});