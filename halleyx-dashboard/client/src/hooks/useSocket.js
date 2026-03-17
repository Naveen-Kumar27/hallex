import { useState, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';

console.log('useSocket: SOCKET_URL:', SOCKET_URL);
console.log('useSocket: io type:', typeof io);

export const useSocket = () => {
  const socket = useMemo(() => {
    console.log('useSocket: Initializing socket instance');
    return io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
      secure: true
    });
  }, []);

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (!socket.connected) {
        socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return { socket, isConnected };
};

export default useSocket;
