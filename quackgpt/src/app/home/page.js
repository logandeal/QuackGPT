"use client";

import React, { useState, useEffect, useRef } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import "./page.css";

import { useChat } from "ai/react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

const CODE_LOAD_ID = "code_load";
const INIT_DUCK_ID = "duck";
const SYSTEM_ID = "system_context";

export default function Home() {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();
  const username = cookies.username;
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const duckImgRef = useRef(null);
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    setMessages,
  } = useChat();
  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err) // onNotAllowedOrFound
  );
  let duckBlinkChances = 1;

  const [isCodebaseTooLarge, setIsCodebaseTooLarge] = useState(false);
  const [flipDuck, setFlipDuck] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [contextText, setContextText] = useState("");

  useEffect(() => {
    if (chatContainerRef.current) {
      // Automatically scroll down when new message is added
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (flipDuck) {
      // If flipDuck is true, apply transform to flip the duck upside down
      duckImgRef.current.style.transform = "rotateX(180deg)";
    } else {
      // If flipDuck is false, reset the transform
      duckImgRef.current.style.transform = "rotateX(0deg)";
    }
  }, [flipDuck]);

  const handleContextTextChange = (event) => {
    setContextText(event.target.value);
  };

  function handleSendMessage(e, chatRequestOptions) {
    console.log(duckImgRef.current);
    console.log(duckImgRef.current);
    duckImgRef.current.src = "./duck_thinking.svg";
    duckImgRef.current.alt = "Thinking Duck";
    console.log(duckImgRef.current);
    handleSubmit(e, chatRequestOptions);
    const message = input.toLowerCase(); // Convert input to lowercase for case-insensitive matching
    if (message.includes("got any grapes")) {
      // Check if input message contains "got any grapes"
      setFlipDuck(true); // Set flipDuck to true to flip the duck upside down
    } else {
      setFlipDuck(false);
    }
    setTimeout(() => {
      if (duckImgRef.current != null) {
        console.log(duckImgRef.current);
        duckImgRef.current.src = "./duck_idea.svg";
        duckImgRef.current.alt = "Idea Duck";
        console.log(duckImgRef.current);
        inputRef.current.focus(); // Explicitly focus on the input field after sending a message
        setTimeout(() => {
          if (duckImgRef.current != null) {
            console.log(duckImgRef.current);
            duckImgRef.current.src = "./duck_neutral.svg";
            duckImgRef.current.alt = "Neutral Duck";
            console.log(duckImgRef.current);
          }
        }, 2000);
      }
    }, 2000);
  }

  function rotateDuckHSV() {
    if (duckImgRef.current) {
      // Get the current style of the duck image
      const currentStyle = window.getComputedStyle(duckImgRef.current);

      // Extract the current hue value from the style
      const currentFilter = currentStyle.getPropertyValue("filter");
      const match = /hue-rotate\((\d+)deg\)/.exec(currentFilter);
      const currentHue = match ? parseInt(match[1]) : 0;

      // Calculate the new hue value (add 45 degrees and wrap around)
      const newHue = (currentHue + 45) % 360;

      // Apply the new hue value to the duck image
      duckImgRef.current.style.filter = `hue-rotate(${newHue}deg)`;
    }
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

  const handleMicrophoneClick = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "input.webm");

    const response = await fetch("/api/audio", {
      method: "POST",
      body: formData,
    });

    const responseJson = await response.json();
    console.log(responseJson);

    if (responseJson.text) {
      setInput(responseJson.text);
    }
  };

  useEffect(() => {
    if (messages.length == 0) {
      setMessages([
        {
          id: `${INIT_DUCK_ID}`,
          role: "user",
          content: `
        You are a programmer's funny pet rubber duck who is as smart as a human engineer.
Include duck puns and other duck humor.
Programmers often talk to rubber ducks to talk through problems.
Please answer questions helpfully and briefly.
Hint at the user what they need to do. Do not just give them the answer.
If you don't have enough information, ask for it.
        `,
        },
        {
          id: `${Date.now()}`,
          role: "assistant",
          content: "Welcome to QuackGPT!",
        },
      ]);
    }

    let blinker = window.setInterval(() => {
      const blinkVal = Math.random() * 10;
      if (blinkVal < duckBlinkChances) {
        console.log("BLINK");
        duckBlinkChances = 1;
        const duckImgSrc = duckImgRef.current.src;
        let duckImgBlinkSrc = duckImgSrc;
        if (
          !duckImgSrc.endsWith("_blinking.svg") &&
          duckImgSrc != "duck_idea.svg"
        ) {
          duckImgBlinkSrc = duckImgSrc.slice(0, -4) + "_blinking.svg";
          duckImgRef.current.src = duckImgBlinkSrc;
          window.setTimeout(() => {
            if (duckImgRef.current != null) {
              console.log(duckImgSrc);
              if (duckImgRef.current.src == duckImgBlinkSrc) {
                duckImgRef.current.src = duckImgSrc;
              }
            }
          }, 250);
        }
      } else {
        duckBlinkChances++;
      }
    }, 1000);

    // @ts-ignore
    window.electronAPI.send("request-data", username);

    // Listen for a response from the main process
    // @ts-ignore
    window.electronAPI.on("reply-data", (event, data) => {
      if (data != undefined) {
        let oldMessages = JSON.parse(data);
        setMessages(oldMessages);
        const systemMessage = oldMessages.find((msg) => msg.id === SYSTEM_ID);
        console.log(systemMessage);
        if (systemMessage) {
          setContextText(systemMessage.content);
        }
      }
    });

    // @ts-ignore
    window.electronAPI.on("open-file-result", async (event, data) => {
      setIsCodebaseTooLarge(false);
      /**
       * @type {Array<{id: string, role: "function" | "user" | "assistant" | "system" | "data" | "tool", content: string}>}
       */
      const messages = [
        {
          id: `${CODE_LOAD_ID}`,
          role: "user",
          content: `
I want you to answer questions about my codebase.
Following is a tree structure of the files in my codebase:

\`\`\`
${JSON.stringify(data.fileTree)}
\`\`\`

You are a programmer's funny pet rubber duck who is as smart as a human engineer.
Include duck puns and other duck humor.
Programmers often talk to rubber ducks to talk through problems.
Please answer questions helpfully and briefly.
Hint at the user what they need to do. Do not just give them the answer.
If you don't have enough information, ask for it.
`.trim(),
        },
        {
          id: `${Date.now()}`,
          role: "assistant",
          content:
            "Your code is now loaded, and I am ready to answer any questions you have! Quack quack!",
        },
      ];

      // TODO: call token API to check if messages goes over context limit with checkContextLimit = true
      // Check size of codebase limit
      console.log("fetching");
      const response = await fetch("/api/chat?checkContextLimit=true", {
        method: "POST",
        body: JSON.stringify({ messages }),
      });
      const responseJson = await response.json();
      console.log(responseJson);

      if (responseJson.isWithinTokenLimit) {
        console.log("setting messages");
        setMessages(messages);
      } else {
        console.log("codebase too large");
        setIsCodebaseTooLarge(true);
      }
    });

    return () => {
      window.clearInterval(blinker);
    };
  }, []);

  function handleBackClick() {
    // @ts-ignore
    window.electronAPI.send("save_messages", { messages, username });
    removeCookie("username");
    removeCookie("status");
    removeCookie("password_hash");
    router.push("/");
  }

  function handleCodebasePick() {
    // @ts-ignore
    window.electronAPI.send("open-file-dialog");
  }

  const filteredMessages = messages.filter(
    (message) =>
      message.id !== CODE_LOAD_ID &&
      message.id !== INIT_DUCK_ID &&
      message.id !== SYSTEM_ID
  );

  return (
    <div className="App">
      <img
        className="duckImg"
        src="./duck_neutral.svg"
        alt="Neutral Duck"
        ref={duckImgRef}
        onClick={rotateDuckHSV}
      />
      <div className="topButtons">
        <button onClick={handleBackClick} className="backButton">
          <div className="backBox">
            <div className="backArrow"></div>
            <div>Save and Logout</div>
          </div>
        </button>
        <button onClick={handleCodebasePick} className="codebase-button">
          Select your codebase
        </button>
      </div>
      {isCodebaseTooLarge && (
        <p className="codebase-indicator">
          Codebase too large! Please try a different codebase.
        </p>
      )}
      <div className="chat-container" ref={chatContainerRef}>
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`whitespace-pre-wrap message ${message.role}`}
          >
            {message.role === "user" ? "You: " : "QuackGPT: "}
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
          <div className="microphone-button">
            <AudioRecorder
              onRecordingComplete={(blob) => {
                if (!isLoading) {
                  handleMicrophoneClick(blob);
                }
              }}
              downloadOnSavePress={false}
              // downloadFileExtension="mp3"
              showVisualizer={true}
            />
          </div>
          <input
            type="text"
            value={input}
            className="input_text"
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
        <button
          className="contextButton"
          onClick={() => setContextOpen(!contextOpen)}
        >
          {contextOpen ? "Close Context" : "Open Context"}
        </button>
      </div>
      {contextOpen && (
        <div className="context-container">
          <textarea
            value={contextText}
            className="context_text"
            placeholder="Enter context here..."
            rows={3}
            onChange={handleContextTextChange}
          ></textarea>
          <button
            className="contextButton"
            onClick={() => {
              if (contextText.length > 0) {
                const filteredItems = messages.filter(
                  (msg) => msg.id !== SYSTEM_ID
                );
                setMessages([
                  ...filteredItems,
                  {
                    id: `${SYSTEM_ID}`,
                    role: "system",
                    content: contextText,
                  },
                ]);
                setContextOpen(false);
              }
            }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
