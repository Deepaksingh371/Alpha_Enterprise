import { io } from "socket.io-client";
const socketUrl = new URL(
	import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).origin;
const socket = io(socketUrl);

export default socket;