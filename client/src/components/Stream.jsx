import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const Stream = ({ token, setToken }) => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', {
      auth: {
        token,
      },
    });

    socketRef.current.on('status', (message) => {
      setStatus(message);
    });

    socketRef.current.on('chatMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsStreaming(true);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          socketRef.current.emit('stream', event.data);
        }
      };
      mediaRecorder.start(1000);

      setStatus('Streaming started');
    } catch (error) {
      console.error('Error starting stream', error);
      setStatus('Error starting stream');
    }
  };

  const stopStream = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    videoRef.current.srcObject = null;
    setIsStreaming(false);
    setStatus('Streaming stopped');
  };

  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current.emit('chatMessage', message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative p-4">
      <button 
        onClick={handleLogout}
        className="button absolute top-4 right-4"
      >
        Logout
      </button>
      <h1 className="text-3xl font-bold mb-8">Welcome to the Stream</h1>
      <div className="w-full max-w-7xl  flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-black mb-4 md:mb-0 md:mr-4 relative">
             {/* remove muted to hear your own voice */}
          <video ref={videoRef} className="w-full h-auto" autoPlay muted></video>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center w-full">
            <div className="flex mb-2">
              {!isStreaming ? (
                <button 
                  onClick={startStream}
                  className="button"
                >
                  Start Stream
                </button>
              ) : (
                <button 
                  onClick={stopStream}
                  className="button bg-red-500 hover:bg-red-700"
                >
                  Stop Stream
                </button>
              )}
            </div>
            {status && <p className="text-green-500">{status}</p>}
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-gray-200 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Live Chat</h2>
          <div className="chat-box mb-4 p-2 border border-gray-300 rounded-lg h-64 overflow-y-auto md:h-96">
            {messages.map((msg, index) => (
              <p key={index} className="mb-2 p-2 bg-white rounded shadow">{msg}</p>
            ))}
          </div>
          <div className="flex">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message"
              className="input flex-1"
            />
            <button 
              onClick={sendMessage}
              className="button ml-2"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stream;
