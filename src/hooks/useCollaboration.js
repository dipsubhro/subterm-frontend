import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { io } from "socket.io-client";

const ROUTER = import.meta.env.VITE_API || "http://localhost:5500";

export default function useCollaboration(filePath, sessionId, onLocalUpdate, onRemoteSave) {
  const [isSynced, setIsSynced] = useState(false);
  const [collabCount, setCollabCount] = useState(0);
  const [remoteCursors, setRemoteCursors] = useState({});
  const ydocRef = useRef(null);
  const ytextRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    const socket = io(`${ROUTER}/collab`, {
      path: `/workspace/${sessionId}/socket.io`,
      transports: ["polling", "websocket"],
      upgrade: true,
    });
    socketRef.current = socket;

    socket.on("collab-count", (count) => setCollabCount(count));
    socket.on("connect", () => socket.emit("get-count"));

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setCollabCount(0);
    };
  }, [sessionId]);

  useEffect(() => {
    if (!filePath || !sessionId) return;

    const ydoc = new Y.Doc();
    const ytext = ydoc.getText("monaco");
    ydocRef.current = ydoc;
    ytextRef.current = ytext;

    const waitForSocket = (cb) => {
      if (socketRef.current) return cb(socketRef.current);
      const interval = setInterval(() => {
        if (socketRef.current) {
          clearInterval(interval);
          cb(socketRef.current);
        }
      }, 10);
      return () => clearInterval(interval);
    };

    let cleanup = null;

    const stop = waitForSocket((socket) => {
      const joinFile = () => socket.emit("join-file", filePath);
      const onInitDoc = (update) => { Y.applyUpdate(ydoc, new Uint8Array(update)); setIsSynced(true); };
      const onYUpdate = (update) => Y.applyUpdate(ydoc, new Uint8Array(update));
      const onFileSaved = () => onRemoteSave?.();
      const onCursorUpdate = ({ clientId, cursor }) => setRemoteCursors(prev => ({ ...prev, [clientId]: cursor }));
      const onCursorRemove = ({ clientId }) => setRemoteCursors(prev => { const n = { ...prev }; delete n[clientId]; return n; });
      const onUpdate = (update, origin) => {
        if (origin === socket) return;
        socket.emit("y-update", { filePath, update });
        onLocalUpdate?.();
      };

      if (socket.connected) joinFile(); else socket.once("connect", joinFile);

      socket.on("init-doc", onInitDoc);
      socket.on("y-update", onYUpdate);
      socket.on("file-saved", onFileSaved);
      socket.on("cursor-update", onCursorUpdate);
      socket.on("cursor-remove", onCursorRemove);
      ydoc.on("update", onUpdate);

      cleanup = () => {
        socket.off("connect", joinFile);
        socket.off("init-doc", onInitDoc);
        socket.off("y-update", onYUpdate);
        socket.off("file-saved", onFileSaved);
        socket.off("cursor-update", onCursorUpdate);
        socket.off("cursor-remove", onCursorRemove);
        ydoc.off("update", onUpdate);
        setIsSynced(false);
        setRemoteCursors({});
      };
    });

    return () => {
      stop?.();
      cleanup?.();
      ydoc.destroy();
    };
  }, [filePath, sessionId]);

  const emitSaved = () => socketRef.current?.emit("file-saved", { filePath });
  const updateCursor = (cursor) => socketRef.current?.emit("cursor-update", { filePath, cursor });

  return { ydoc: ydocRef.current, ytext: ytextRef.current, isSynced, emitSaved, collabCount, remoteCursors, updateCursor };
}
