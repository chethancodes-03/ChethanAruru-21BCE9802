const socket = new WebSocket('ws://localhost:5000');

socket.onopen = () => {
  console.log('WebSocket connection established');
};

socket.onmessage = (event) => {
  try {
    console.log('Message from server', event.data);
    // Handle incoming data, update game state, etc.
  } catch (error) {
    console.error('Error processing message', error);
  }
};

socket.onerror = (error) => {
  console.error('WebSocket error', error);
};

socket.onclose = (event) => {
    if (event.wasClean) {
      console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
      console.error(`WebSocket connection closed unexpectedly, message = ${event.data}`);
    }
  };

export default socket;
