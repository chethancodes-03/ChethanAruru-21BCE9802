import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url = 'ws://localhost:5000', onMessage = () => {}, reconnectInterval = 5000) => {
  const webSocketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connect = () => {
      const webSocket = new WebSocket(url);
      webSocketRef.current = webSocket;

      webSocket.onopen = () => {
        console.log('WebSocket connection opened');
        setIsConnected(true);
      };

      webSocket.onmessage = (event) => {
        onMessage(event.data);
      };

      webSocket.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        // Reconnect after a delay
        setTimeout(connect, reconnectInterval);
      };

      webSocket.onerror = (error) => {
        console.error('WebSocket error', error);
        // Handle errors or trigger reconnect if needed
      };
    };

    connect();

    // Cleanup function to close WebSocket on component unmount or URL change
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
        console.log('WebSocket connection closed on cleanup');
      }
    };
  }, [url, onMessage, reconnectInterval]);  // Re-run effect if url, onMessage, or reconnectInterval changes

  // Function to send a message via WebSocket
  const sendMessage = (message) => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      try {
        const jsonMessage = JSON.stringify(message);
        webSocketRef.current.send(jsonMessage);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return { sendMessage, isConnected };
};

export default useWebSocket;
