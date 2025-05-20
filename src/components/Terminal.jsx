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
        background: "#282a36",
        foreground: "#f8f8f2",
        cursor: "#ff79c6",
        cursorAccent: "#282a36",
        selectionBackground: "#44475a",
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

  // socket.emit("terminal:write", "echo 'hello world'\n");

  return <div ref={terminalRef} id="terminal" />;
};

export default Terminal;
