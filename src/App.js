import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const addMessage = (text, sender) => {
    const newMessage = { text, sender };
    setMessages([...messages, newMessage]);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    addMessage(inputText, 'user');
    setInputText('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Simulate response from ChatGPT
  useEffect(() => {
    if (messages[messages.length - 1]?.sender === 'user') {
      setTimeout(() => {
        addMessage('I am just a demo. I cannot respond.', 'bot');
      }, 1000);
    }
  }, [messages]);

  return (
    <div className="App">
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;

