import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log('useSocket: Found VITE_API_URL:', apiUrl);
  
  if (apiUrl && (apiUrl.includes('https://') || apiUrl.includes('http://'))) {
    const resolvedUrl = apiUrl.replace('/api', '');
    console.log('useSocket: Resolved URL:', resolvedUrl);
    return resolvedUrl;
  }
  
  console.log('useSocket: No API URL found, falling back to window location');
  return '/';
};

const socketUrl = getSocketUrl();
console.log('Socket Connection URL:', socketUrl);

const socket = io(socketUrl, {
  autoConnect: false,
  transports: ['websocket'],
  secure: true
});

export const useSocket = () => {
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
