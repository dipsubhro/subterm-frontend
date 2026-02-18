import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
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

    const fitAddon = new FitAddon();

    const term = new XTerminal({
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

    term.loadAddon(fitAddon);
    term.open(terminalRef.current);

    // Fit terminal and notify server of the new size
    const fitAndResize = () => {
      fitAddon.fit();
      socket.emit("terminal:resize", { cols: term.cols, rows: term.rows });
    };

    fitAndResize();

    term.onData((data) => {
      socket.emit("terminal:write", data);
    });

    socket.on("terminal:data", (data) => {
      term.write(data);
    });

    // Send an enter so the shell prints its prompt immediately
    if (socket.connected) {
      socket.emit("terminal:write", "clear\n");
    } else {
      socket.once("connect", () => {
        socket.emit("terminal:write", "clear\n");
      });
    }

    // Re-fit whenever the container is resized
    const resizeObserver = new ResizeObserver(() => {
      fitAndResize();
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return <div ref={terminalRef} id="terminal" />;
};

export default Terminal;

