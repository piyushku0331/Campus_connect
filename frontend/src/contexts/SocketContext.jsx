import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { SocketContext } from './SocketContextValue';

export { SocketContext };

export const SocketProvider = ({ children }) => {
  SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Create socket connection
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server');
        setIsConnected(false);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    } else {
      // Clean up socket if user logs out
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Socket methods
  const joinConversation = (conversationId) => {
    if (socket && isConnected) {
      socket.emit('joinConversation', conversationId);
    }
  };

  const leaveConversation = (conversationId) => {
    if (socket && isConnected) {
      socket.emit('leaveConversation', conversationId);
    }
  };

  const sendMessage = (conversationId, message) => {
    if (socket && isConnected) {
      socket.emit('sendMessage', { conversationId, message });
    }
  };

  const onReceiveMessage = (callback) => {
    if (socket) {
      socket.on('receiveMessage', callback);
      return () => socket.off('receiveMessage', callback);
    }
  };

  const onUserTyping = (callback) => {
    if (socket) {
      socket.on('userTyping', callback);
      return () => socket.off('userTyping', callback);
    }
  };

  const emitTyping = (conversationId, isTyping) => {
    if (socket && isConnected) {
      socket.emit('typing', { conversationId, isTyping });
    }
  };

  const onContentApproval = (callback) => {
    if (socket) {
      socket.on('contentApproval', callback);
      return () => socket.off('contentApproval', callback);
    }
  };

  const joinLostFound = () => {
    if (socket && isConnected) {
      socket.emit('joinLostFound');
    }
  };

  const leaveLostFound = () => {
    if (socket && isConnected) {
      socket.emit('leaveLostFound');
    }
  };

  const onNewLostItem = (callback) => {
    if (socket) {
      socket.on('newLostItem', callback);
      return () => socket.off('newLostItem', callback);
    }
  };

  const onItemStatusChanged = (callback) => {
    if (socket) {
      socket.on('itemStatusChanged', callback);
      return () => socket.off('itemStatusChanged', callback);
    }
  };

  const onItemClaimed = (callback) => {
    if (socket) {
      socket.on('itemClaimed', callback);
      return () => socket.off('itemClaimed', callback);
    }
  };

  const onConnectionRequestReceived = (callback) => {
    if (socket) {
      socket.on('connectionRequestReceived', callback);
      return () => socket.off('connectionRequestReceived', callback);
    }
  };

  const onConnectionRequestAccepted = (callback) => {
    if (socket) {
      socket.on('connectionRequestAccepted', callback);
      return () => socket.off('connectionRequestAccepted', callback);
    }
  };

  const onConnectionRequestRejected = (callback) => {
    if (socket) {
      socket.on('connectionRequestRejected', callback);
      return () => socket.off('connectionRequestRejected', callback);
    }
  };

  const onDashboardUpdate = (callback) => {
    if (socket) {
      socket.on('dashboardUpdate', callback);
      return () => socket.off('dashboardUpdate', callback);
    }
  };

  const onLeaderboardUpdate = (callback) => {
    if (socket) {
      socket.on('leaderboardUpdate', callback);
      return () => socket.off('leaderboardUpdate', callback);
    }
  };

  const onAlumniAdded = (callback) => {
    if (socket) {
      socket.on('alumniAdded', callback);
      return () => socket.off('alumniAdded', callback);
    }
  };

  const onAlumniUpdated = (callback) => {
    if (socket) {
      socket.on('alumniUpdated', callback);
      return () => socket.off('alumniUpdated', callback);
    }
  };

  const onAlumniRemoved = (callback) => {
    if (socket) {
      socket.on('alumniRemoved', callback);
      return () => socket.off('alumniRemoved', callback);
    }
  };

  const value = {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    onReceiveMessage,
    onUserTyping,
    emitTyping,
    onContentApproval,
    joinLostFound,
    leaveLostFound,
    onNewLostItem,
    onItemStatusChanged,
    onItemClaimed,
    onConnectionRequestReceived,
    onConnectionRequestAccepted,
    onConnectionRequestRejected,
    onDashboardUpdate,
    onLeaderboardUpdate,
    onAlumniAdded,
    onAlumniUpdated,
    onAlumniRemoved
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};