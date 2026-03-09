import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    if (!user?.token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socketUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : window.location.origin;

    const socket = io(socketUrl, {
      auth: { token: user.token }
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('voucher:scanned', (data) => {
      setLastEvent({ type: 'scanned', ...data, timestamp: Date.now() });
    });

    socket.on('voucher:redeemed', (data) => {
      setLastEvent({ type: 'redeemed', ...data, timestamp: Date.now() });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.token]);

  const clearEvent = () => setLastEvent(null);

  return (
    <SocketContext.Provider value={{ lastEvent, clearEvent }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
