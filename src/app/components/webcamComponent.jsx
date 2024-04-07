import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const WebcamStream = () => {
  const videoRef = useRef();

  useEffect(() => {
    const socket = io('ws://localhost:8080/');
    console.log(socket)

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    socket.on('frame', (frameData) => {
      const blob = new Blob([frameData], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      if (videoRef.current) {
        videoRef.current.src = imageUrl;
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Webcam Stream</h2>
      <video ref={videoRef} autoPlay />
    </div>
  );
};

export default WebcamStream;