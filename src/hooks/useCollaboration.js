import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { io } from "socket.io-client";

const ROUTER = import.meta.env.VITE_API || "http://localhost:5500";

export default function useCollaboration(filePath, sessionId) {
  const [isSynced, setIsSynced] = useState(false);
  const ydocRef = useRef(null);
  const ytextRef = useRef(null);
  const socketRef = useRef(null);

  if (!ydocRef.current) {
    ydocRef.current = new Y.Doc();
    ytextRef.current = ydocRef.current.getText("monaco");
  }

  useEffect(() => {
    if (!filePath || !sessionId) return;

    const ydoc = ydocRef.current;
    const ytext = ytextRef.current;

    const socket = io(ROUTER, {
      path: `/workspace/${sessionId}/socket.io`,
      transports: ["polling", "websocket"],
      upgrade: true,
    });
    socketRef.current = socket;

    socket.emit("join-file", filePath);

    socket.on("init-doc", (update) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
      setIsSynced(true);
    });

    socket.on("y-update", (update) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
    });

    const onUpdate = (update, origin) => {
      if (origin === socket) return;
      socket.emit("y-update", { filePath, update });
    };

    ydoc.on("update", onUpdate);

    return () => {
      ydoc.off("update", onUpdate);
      socket.disconnect();
      setIsSynced(false);
    };
  }, [filePath, sessionId]);

  return { ydoc: ydocRef.current, ytext: ytextRef.current, isSynced };
}
