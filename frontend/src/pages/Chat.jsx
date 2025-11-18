import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Search, Users, MessageCircle, Phone, Video, MoreVertical, Smile } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { conversationsAPI } from '../services/api';
const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const { user } = useAuth();
  const { socket, joinConversation, leaveConversation, sendMessage, onReceiveMessage } = useSocket();

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await conversationsAPI.getConversations();
        setConversations(response.data);

        // Check if there's a conversationId from navigation state
        const conversationId = location.state?.conversationId;
        if (conversationId) {
          const targetConversation = response.data.find(conv => conv._id === conversationId);
          if (targetConversation) {
            setActiveConversation(targetConversation);
          } else if (response.data.length > 0) {
            setActiveConversation(response.data[0]);
          }
        } else if (response.data.length > 0) {
          setActiveConversation(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [location.state]);

  // Handle socket messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      const { conversationId, message: newMessage } = data;
      setConversations(prev => prev.map(conv => {
        if (conv._id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            updatedAt: new Date()
          };
        }
        return conv;
      }));

      // Update active conversation if it's the current one
      if (activeConversation && activeConversation._id === conversationId) {
        setActiveConversation(prev => ({
          ...prev,
          messages: [...prev.messages, newMessage]
        }));
      }
    };

    const cleanup = onReceiveMessage(handleReceiveMessage);

    return cleanup;
  }, [socket, activeConversation, onReceiveMessage]);

  // Join/leave conversation rooms
  useEffect(() => {
    if (activeConversation && socket) {
      joinConversation(activeConversation._id);
      return () => leaveConversation(activeConversation._id);
    }
  }, [activeConversation, socket, joinConversation, leaveConversation]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;

    try {
      const response = await conversationsAPI.sendMessage(activeConversation._id, message.trim());
      const newMessage = response.data;

      // Update local state
      setActiveConversation(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));

      // Send via socket
      sendMessage(activeConversation._id, newMessage);

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations yet</div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => setActiveConversation(conversation)}
                className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
                  activeConversation?._id === conversation._id ? 'bg-primary/10 border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {conversation.participants[0]?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {conversation.participants[0]?.full_name || 'Unknown User'}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conversation.messages.length > 0
                        ? conversation.messages[conversation.messages.length - 1].text
                        : 'No messages yet'}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {activeConversation.participants[0]?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {activeConversation.participants[0]?.full_name || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Phone size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Video size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConversation.messages?.map((msg) => (
                <div key={msg._id} className={`flex ${msg.sender._id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.sender._id === user?.id
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <div className="text-xs opacity-70 mb-1">{msg.sender.full_name}</div>
                    <div className="text-sm">{msg.text}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Smile size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-2 bg-primary text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Chat;
