import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../assets/styles/pages/ChatPage.css';

const SOCKET_SERVER_URL = "http://localhost:5000";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = { text: newMessage, sender: 'YourUsername' }; 
      socketRef.current.emit('sendMessage', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]); 
      setNewMessage('');
    }
  };

  return (
    <div className="chat-page">
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;