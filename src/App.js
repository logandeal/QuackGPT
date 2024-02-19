import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage();
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const addMessage = (text, sender) => {
    const newMessage = { text, sender };
    setMessages([...messages, newMessage]);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '' || isSending) return;

    setIsSending(true);
    addMessage(inputText, 'user');
    setInputText('');
    inputRef.current.focus(); // Explicitly focus on the input field after sending a message
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMicrophoneClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    setIsSending(true);
    setInputText('');
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage();
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsSending(false);
    };

    recognition.start();
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      // Automatically scroll down when new message is added
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages[messages.length - 1]?.sender === 'user') {
      // Simulate response from ChatGPT
      setTimeout(() => {
        addMessage('I am just a demo. Go fuck yourself.', 'bot');
        setIsSending(false);
      }, 1000);
    }
  }, [messages]);

  return (
    <div className="App">
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <button className="microphone-button" onClick={handleMicrophoneClick} disabled={isSending}>
          🎤
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your fucking query here..."
          disabled={isSending}
          ref={inputRef}
          autoFocus // Automatically focus the input field when component mounts
        />
        <button onClick={handleSendMessage} disabled={isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;
