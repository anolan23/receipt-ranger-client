import useCameraCapture from '@/hooks/use-camera-capture';
import React from 'react';

const CameraCapture: React.FC = () => {
  const {
    videoRef,
    capturedImage,
    startCamera,
    captureImage,
    clearCapturedImage,
  } = useCameraCapture();

  const handleImageUpload = () => {
    if (capturedImage) {
      // Perform further actions with the captured image file, e.g., upload to a server
      console.log('Captured Image File:', capturedImage);
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        style={{ display: capturedImage ? 'none' : 'block' }}
        autoPlay
      />
      {!capturedImage && <button onClick={startCamera}>Start Camera</button>}
      {!capturedImage && <button onClick={captureImage}>Capture Image</button>}
      {capturedImage && (
        <div>
          <img src={URL.createObjectURL(capturedImage)} alt="Captured" />
          <button onClick={handleImageUpload}>Upload Image</button>
          <button onClick={clearCapturedImage}>Retake Image</button>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
