"use client";

import React, { useState, useEffect, useRef } from "react";
import "./page.css";

import { useChat } from "ai/react";

export default function Home() {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

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

  return (
    <div className="App">
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((message) => (
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
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Talk to the duck here..."
            onChange={handleInputChange}
            ref={inputRef}
            autoFocus
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
