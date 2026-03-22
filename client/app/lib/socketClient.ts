"use client";

import { io, type Socket } from "socket.io-client";
import { getPublicSocketUri } from "../config/publicEnv";

let socket: Socket | null = null;

/** Lazy singleton — first call opens the WebSocket (avoids connections on anonymous home page). */
export function getSocket(): Socket {
  if (typeof window === "undefined") {
    throw new Error("getSocket is client-only");
  }
  if (!socket) {
    socket = io(getPublicSocketUri(), { transports: ["websocket"] });
  }
  return socket;
}
