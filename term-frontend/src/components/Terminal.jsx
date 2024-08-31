import React, { useState, useEffect, useRef } from "react";
import { Xterm } from "xterm-react";
import io from "socket.io-client";
import "./Terminal.css";

export default function Terminal() {
  const [Terminal, setTerminal] = useState(null);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const wasCalled = useRef(false);

  useEffect(() => {
    if (wasCalled.current) {
      return;
    }
    wasCalled.current = true;
  }, []);

  const onTermInit = (term) => {
    setTerminal(term);
    term.reset();

    const socket = io("http://localhost:3002");

    socket.on("connect", () => {
      socket.emit("start-session");
    });

    socket.on("output", (data) => {
      setInput(data);
      Terminal.write(data);
    });

    setSocket(socket);
  };

  const onTermDispose = (term) => {
    setTerminal(null);
  };

  const handleData = (data) => {
    if (Terminal) {
      const code = data.charCodeAt(0);
      console.log("Code:" + code);
      switch (code) {
        // Enter
        case 13:
          socket.emit("execute");
          setInput("");
          break;

        // Up arrow
        case 38:
          socket.emit("input", "\u001b[A");
          break;

        // Down arrow
        case 40:
          socket.emit("input", "\u001b[B");
          break;

        // Backspace
        case 127:
          socket.emit("backspace", input);
          break;

        default:
          setInput(input + data);
          socket.emit("input", data);
      }
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-window">
        <header>
          <div className="button green"></div>
          <div className="button yellow"></div>
          <div className="button red"></div>
        </header>
        <Xterm
          onInit={onTermInit}
          onDispose={onTermDispose}
          onData={handleData}
        />
      </div>
    </div>
  );
}
