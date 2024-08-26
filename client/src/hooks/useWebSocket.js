import { useEffect, useRef } from 'react';

const useWebSocket = (url = 'ws://localhost:5000', onMessage = () => {}) => {
  const webSocketRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket
    const webSocket = new WebSocket(url);
    webSocketRef.current = webSocket;

    // Handle WebSocket events
    webSocket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    webSocket.onmessage = (event) => {
      onMessage(event.data);
    };

    webSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    // Cleanup function to close WebSocket on component unmount or URL change
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
        console.log('WebSocket connection closed on cleanup');
      }
    };
  }, [url, onMessage]);  // Re-run effect only if url or onMessage changes

  // Function to send a message via WebSocket
  // Send a message via WebSocket
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
  

  return sendMessage;
};

export default useWebSocket;
