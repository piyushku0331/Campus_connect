import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Send, Search, Users, MessageCircle, Phone, Video, MoreVertical, Smile } from 'lucide-react';
const Chat = () => {
  const [activeChat, setActiveChat] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const messagesEndRef = useRef(null);
  const chats = useMemo(() => [
    {
      id: 'general',
      name: 'General Discussion',
      type: 'group',
      avatar: '💬',
      lastMessage: 'Anyone up for a study session?',
      time: '2 min ago',
      unread: 3,
      online: true
    },
    {
      id: 'cse_batch_2024',
      name: 'CSE Batch 2024',
      type: 'group',
      avatar: '👥',
      lastMessage: 'Exam schedule is out!',
      time: '5 min ago',
      unread: 1,
      online: true
    },
    {
      id: 'study_group',
      name: 'Data Structures Study Group',
      type: 'group',
      avatar: '📚',
      lastMessage: 'Check out these notes I shared',
      time: '1 hour ago',
      unread: 0,
      online: false
    },
    {
      id: 'rahul_kumar',
      name: 'Rahul Kumar',
      type: 'direct',
      avatar: 'RK',
      lastMessage: 'Thanks for the notes!',
      time: '3 hours ago',
      unread: 0,
      online: true
    },
    {
      id: 'priya_sharma',
      name: 'Priya Sharma',
      type: 'direct',
      avatar: 'PS',
      lastMessage: 'See you tomorrow!',
      time: '1 day ago',
      unread: 0,
      online: false
    }
  ], []);
  useEffect(() => {
    const initialMessages = {};
    chats.forEach(chat => {
      initialMessages[chat.id] = [
        {
          id: 1,
          sender: 'System',
          content: `Welcome to ${chat.name}!`,
          timestamp: new Date(Date.now() - 86400000).toLocaleTimeString(),
          type: 'system'
        }
      ];
    });
    initialMessages.general.push(
      {
        id: 2,
        sender: 'Rahul Kumar',
        content: 'Hey everyone! Anyone up for a study session tonight?',
        timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
        type: 'user'
      },
      {
        id: 3,
        sender: 'Priya Sharma',
        content: 'I\'m in! What time were you thinking?',
        timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
        type: 'user'
      },
      {
        id: 4,
        sender: 'Ankit Gupta',
        content: 'Count me in too. Library at 7 PM?',
        timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
        type: 'user'
      }
    );
    setMessages(initialMessages);
  }, [chats]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: 'You',
      content: message,
      timestamp: new Date().toLocaleTimeString(),
      type: 'user'
    };
    setMessages(prev => ({
      ...prev,
      [activeChat]: [...prev[activeChat], newMessage]
    }));
    setMessage('');
  };
  const activeChatData = chats.find(chat => chat.id === activeChat);
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {}
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
        {}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
                activeChat === chat.id ? 'bg-primary/10 border-l-4 border-primary' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {chat.type === 'group' ? (
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                      {chat.avatar}
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {chat.avatar}
                    </div>
                  )}
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unread}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      {}
      <div className="flex-1 flex flex-col">
        {}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeChatData?.type === 'group' ? (
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                  {activeChatData.avatar}
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {activeChatData?.avatar}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{activeChatData?.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activeChatData?.type === 'group' ? '12 members' : (activeChatData?.online ? 'Online' : 'Offline')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeChatData?.type === 'direct' && (
                <>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Phone size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Video size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </>
              )}
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        {}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages[activeChat]?.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                msg.type === 'system'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-center text-sm mx-auto'
                  : msg.sender === 'You'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}>
                {msg.type !== 'system' && (
                  <div className="text-xs opacity-70 mb-1">{msg.sender}</div>
                )}
                <div className="text-sm">{msg.content}</div>
                <div className="text-xs opacity-70 mt-1">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {}
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
      </div>
    </div>
  );
};
export default Chat;
