import React, { useRef, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { FiMic, FiMicOff, FiSend } from 'react-icons/fi';
import { FaPlay, FaStop, FaUsers, FaSmile } from 'react-icons/fa';
import { BsDot } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import { BACKEND_URL } from '../constant';

const Stream = ({ token, setToken, userId }) => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [liveUsers, setLiveUsers] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [username, setUsername] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    
    const fetchUsername = async () => {
      try {
        if(!userId) return;
        const response = await axios.get(`${BACKEND_URL}/api/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsername(response.data.username); 
      } catch (error) {
        console.error('Error fetching user details', error);
      }
    };

    fetchUsername();

    socketRef.current = io(`${BACKEND_URL}`, {
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

    socketRef.current.on('liveUsers', (count) => {
      setLiveUsers(count);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [token, userId]);

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
      socketRef.current.emit('chatMessage', { user: username, text: message });
      setMessage('');
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    videoRef.current.srcObject.getAudioTracks()[0].enabled = isMuted;
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 p-4">
      <button onClick={handleLogout} className="absolute top-4 right-4 text-white bg-red-500 p-2 rounded-lg shadow-lg">
        Logout
      </button>
      <div className="w-full h-full max-w-screen-2xl max-h-screen flex flex-col md:flex-row">
        <div className="flex-grow-0 md:w-3/4 w-full h-full bg-gray-900 relative p-4">
          <div className="w-full h-1/6 bg-gray-900 flex items-center p-4">
            <BsDot className={`text-red-600 text-2xl ${isStreaming ? 'block' : 'hidden'}`} />
            <span className={`text-white text-xl ${isStreaming ? 'block' : 'hidden'}`}>LIVE</span>
            <FaUsers className="ml-4 text-white text-xl" />
            <span className="text-white text-xl ml-2">{liveUsers}</span>
          </div>
          <div className="w-full h-5/6 bg-black relative">
            <video ref={videoRef} className="w-full h-[75vh] object-cover" autoPlay muted={isMuted} />
          </div>
          <div className="w-full h-1/6 bg-gray-900 flex items-center justify-between p-4">
            <button onClick={toggleMute} className="text-white">
              {isMuted ? <FiMicOff size={24} /> : <FiMic size={24} />}
            </button>
            <button 
              onClick={isStreaming ? stopStream : startStream} 
              className={`text-white ${isStreaming ? 'bg-red-500' : 'bg-blue-500'} p-2 rounded-full hover:opacity-75`}
            >
              {isStreaming ? <FaStop size={24} /> : <FaPlay size={24} />}
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/4 bg-gray-200 p-4 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Live Chat</h2>
          <div className="chat-box mb-4 p-2 border border-gray-300 rounded-lg flex-grow overflow-y-auto">
            {messages.map((msg, index) => (
              <p key={index} className="mb-2 p-2 bg-white rounded shadow">
                <strong>{msg.user}: </strong>{msg.text}
              </p>
            ))}
          </div>
          <div className="flex items-center">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message"
              className="input flex-1 border border-gray-300 p-2 rounded"
            />
            <button 
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="text-gray-600 ml-2"
            >
              <FaSmile size={24} />
            </button>
            <button 
              onClick={sendMessage}
              className="text-white ml-2 bg-blue-500 p-2 rounded-full hover:bg-blue-700"
            >
              <FiSend size={24} />
            </button>
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-20">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stream;
