import { io } from "socket.io-client";

const ROUTER = import.meta.env.VITE_API || "http://localhost:5500";

// Start disconnected — connectToSession() wires it up after provisioning
const socket = io(ROUTER, {
  autoConnect: false,
  transports: ["websocket"],
});

/**
 * Call this after receiving a sessionId from the gateway.
 * Routes socket.io through the reverse-proxy path on the router.
 */
 
export function connectToSession(sessionId) {
  if (socket.connected) socket.disconnect();
  socket.io.opts.path = `/workspace/${sessionId}/socket.io`;
  socket.connect();
}

export default socket;
