import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import socket from "../socket";
import "@xterm/xterm/css/xterm.css";

const Terminal = () => {
  const terminalRef = useRef();
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) {
      return;
    }
    isRendered.current = true;
    const term = new XTerminal({
      rows: 10,
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 14,
      theme: {
        background: "#1E1E1E",
        foreground: "#D4D4D4",
        cursor: "#AEAFAD",
        cursorAccent: "#1E1E1E",
        selectionBackground: "#264F78",
      },
    });

    term.open(terminalRef.current);

    term.onData((data) => {
      socket.emit("terminal:write", data);
    });

    socket.on("terminal:data", (data) => {
      term.write(data);
    });
  }, []);

  return <div ref={terminalRef} id="terminal" />;
};

export default Terminal;

