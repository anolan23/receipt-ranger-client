import { useRef, useState } from 'react';

const useCameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage] = useState<File>();
  console.log(capturedImage);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  };

  const captureImage = async () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const imageFile = new File([blob], 'captured-image.jpg', {
              type: 'image/jpeg',
            });
            setCapturedImage(imageFile);
            stopCamera();
          }
        },
        'image/jpeg',
        0.9
      );
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video) {
      const stream = video.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const clearCapturedImage = () => {
    setCapturedImage(undefined);
  };

  return {
    videoRef,
    capturedImage,
    startCamera,
    captureImage,
    clearCapturedImage,
  };
};

export default useCameraCapture;
