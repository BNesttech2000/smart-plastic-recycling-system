// client/src/hooks/useWebSocket.js
import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

// Use Vite environment variable (remove /api from URL for WebSocket)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

export const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected to:', SOCKET_URL);
      setIsConnected(true);
      newSocket.emit('join-admin');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Real-time events
    newSocket.on('new-contribution', (data) => {
      console.log('📢 New contribution:', data);
      setLastMessage(data);
      toast.success(`♻️ New contribution from ${data.data?.user?.name || 'someone'}!`, {
        duration: 5000,
        position: 'top-right',
      });
    });

    newSocket.on('contribution-updated', (data) => {
      console.log('📢 Contribution updated:', data);
      setLastMessage(data);
      toast.info(`📝 Contribution ${data.status}!`, {
        duration: 3000,
        position: 'top-right',
      });
    });

    newSocket.on('stats-updated', (data) => {
      console.log('📊 Stats updated:', data);
      setLastMessage(data);
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const sendMessage = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  }, [socket, isConnected]);

  return { socket, isConnected, lastMessage, sendMessage };
};