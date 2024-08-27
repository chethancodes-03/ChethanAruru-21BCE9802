import { useEffect, useRef, useCallback } from 'react';

const useWebSocket = (url, onMessage) => {
    const socket = useRef(null);

    useEffect(() => {
        socket.current = new WebSocket(url);

        socket.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        socket.current.onmessage = (event) => {
            if (onMessage) {
                onMessage(event.data);
            }
        };

        socket.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.current.close();
        };
    }, [url, onMessage]);

    const sendMessage = useCallback((message) => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(message);
        } else {
            console.error('WebSocket is not open. ReadyState:', socket.current.readyState);
        }
    }, []);

    return sendMessage;
};

export default useWebSocket;
