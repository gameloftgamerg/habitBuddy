import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const AvatarBuilder = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [avatarFeatures, setAvatarFeatures] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load face-api models when component mounts
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // Path to face-api models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setIsLoading(false);
      startVideo(); // Start video after models are loaded
    };
    
    loadModels();
  }, []);

  // Start video stream from webcam
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error('Error accessing webcam', err));
  };

  // Detect face and extract landmarks
  const detectFace = async () => {
    if (!videoRef.current) return; // Ensure video is ready

    const detection = await faceapi.detectSingleFace(videoRef.current)
      .withFaceLandmarks();

    if (detection) {
      const landmarks = detection.landmarks.positions;
      setAvatarFeatures(landmarks);
      generateAvatar(landmarks); // Generate avatar whenever features are detected
    }
  };

  // Map facial features to a simple avatar (2D)
  const generateAvatar = (features) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous avatar

    if (features.length > 0) {
      ctx.fillStyle = 'lightblue';

      // Simple example: map the eye positions to avatar
      const leftEye = features[36]; // Left eye coordinates
      const rightEye = features[45]; // Right eye coordinates
      const nose = features[30]; // Nose tip

      // Draw face (circle based on eyes distance)
      const eyeDist = Math.abs(rightEye.x - leftEye.x);
      ctx.beginPath();
      ctx.arc(nose.x, nose.y - 10, eyeDist * 2.5, 0, Math.PI * 2); // Adjust radius based on eyes distance
      ctx.fill();

      // Draw eyes
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(leftEye.x, leftEye.y, 5, 0, Math.PI * 2);
      ctx.arc(rightEye.x, rightEye.y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw nose
      ctx.fillStyle = 'brown';
      ctx.beginPath();
      ctx.arc(nose.x, nose.y + 10, 5, 0, Math.PI * 2); 
      ctx.fill();
    }
  };

  // Start video stream on mount and detect faces continuously
  useEffect(() => {
    if (!isLoading) {
      startVideo();
      
      const intervalId = setInterval(detectFace, 100); // Detect face every 100ms

      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }
  }, [isLoading]);

  return (
    <div>
      <h1>Avatar Builder</h1>
      {isLoading ? (
        <p>Loading models...</p>
      ) : (
        <div>
          <video ref={videoRef} autoPlay muted width="300" height="200" />
          <canvas ref={canvasRef} width="300" height="300" />
        </div>
      )}
    </div>
  );
};

export default AvatarBuilder;
