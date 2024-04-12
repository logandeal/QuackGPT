"use client";

// @ts-ignore
import React, { useState, useEffect, useRef } from "react";
import "./page.css";

import { useChat } from "ai/react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

const CODE_LOAD_ID = "code_load";

export default function Home() {
  const router = useRouter();
  const [cookies,setCookie,removeCookie] = useCookies();
  const username = cookies.username;
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    setMessages,
  } = useChat();

  useEffect(() => {
    if (chatContainerRef.current) {
      // Automatically scroll down when new message is added
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSendMessage(e, chatRequestOptions) {
    handleSubmit(e, chatRequestOptions);
    inputRef.current.focus(); // Explicitly focus on the input field after sending a message
  }

  // const handleMicrophoneClick = () => {
  //   if (!("webkitSpeechRecognition" in window)) {
  //     console.error("Speech recognition not supported");
  //     return;
  //   }

  //   const recognition = new window.webkitSpeechRecognition();
  //   recognition.continuous = false;
  //   recognition.interimResults = false;

  //   recognition.onresult = (event) => {
  //     const transcript = event.results[0][0].transcript;
  //     inputRef.current.value = transcript;
  //     formRef.current.submit();
  //   };

  //   recognition.onerror = (event) => {
  //     console.error("Speech recognition error:", event.error);
  //   };

  //   recognition.onend = () => {};

  //   recognition.start();
  // };

  useEffect(() => {

    // @ts-ignore
    window.electronAPI.send('request-data', username);

    // Listen for a response from the main process
    // @ts-ignore
    window.electronAPI.on('reply-data', (event, data) => {
      if(data != undefined){
        let oldMessages = JSON.parse(data);
        setMessages(oldMessages);
      }
    });

    // @ts-ignore
    return window.electronAPI.on("open-file-result", (event, data) => {
      setMessages([
        {
          id: `${CODE_LOAD_ID}`,
          role: "user",
          content: `
I want you to answer questions about my codebase.
Following is a tree structure of the files in my codebase:

\`\`\`
${JSON.stringify(data.fileTree)}
\`\`\`

You are acting as a programmer's funny rubber duck.
Programmers often talk to rubber ducks to work through problems.
Please answer these questions as helpfully as possible, but also as briefly as possible.
Hint at the user what they need to do. Do not give the user an exact answer.
If you don't have enough information, ask for whatever you need.
`.trim(),
        },
        {
          id: `${Date.now()}`,
          role: "assistant",
          content:
            "Your code is now loaded, and I am ready to answer any questions you have.",
        },
      ]);
    });
  }, []);

  function handleBackClick(){
    // @ts-ignore
    window.electronAPI.send("save_messages", {messages, username})
    removeCookie("username")
    removeCookie("status")
    removeCookie("password_hash");
    router.push('/');
  }

  function handleCodebasePick() {
    // @ts-ignore
    window.electronAPI.send("open-file-dialog");
  }

  const filteredMessages = messages.filter(
    (message) => message.id !== CODE_LOAD_ID
  );

  return (
    <div className="App">
      <div className="topButtons">
        <button onClick={handleBackClick} className="backButton">
          <div className="backBox">
            <div className="backArrow"></div>
            <div>Back</div>
          </div>
        </button>
        <button onClick={handleCodebasePick} className="codebase-button">
          Select your codebase
        </button>
      </div>
      <div className="chat-container" ref={chatContainerRef}>
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`whitespace-pre-wrap message ${message.role}`}
          >
            {message.role === "user" ? "User: " : "QuackGPT: "}
            {message.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <form onSubmit={handleSendMessage} ref={formRef}>
          {/* <button
            type="button"
            className="microphone-button"
            onClick={handleMicrophoneClick}
            disabled={isLoading}
          >
            🎤
          </button> */}
          <input
            type="text"
            value={input}
            placeholder="Talk to the rubber duck here..."
            onChange={handleInputChange}
            ref={inputRef}
            autoFocus
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Loading..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
