import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CameraIcon, WarningIcon } from './icons';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File | null) => void;
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
              setError("无法访问摄像头。请在浏览器设置中允许本网站使用摄像头权限。");
          } else {
              setError("无法启动摄像头，请检查设备是否正常或被其他应用占用。");
          }
        });
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, stopStream]);

  const handleCaptureClick = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
          } else {
             onCapture(null);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center p-4" onClick={onClose}>
      <div className="relative bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">拍照上传</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        <div className="p-4 flex-grow flex items-center justify-center overflow-hidden">
            {error ? (
                 <div className="text-center p-8 text-yellow-300">
                    <WarningIcon className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-semibold">无法启动摄像头</p>
                    <p className="text-sm mt-2">{error}</p>
                 </div>
            ) : (
                <video ref={videoRef} autoPlay playsInline className="w-full h-auto max-h-full rounded-md" style={{ transform: 'scaleX(-1)' }}></video>
            )}
        </div>
        
        {!error && (
            <div className="p-4 border-t border-slate-700 flex justify-center">
            <button onClick={handleCaptureClick} className="p-4 bg-white rounded-full group transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white" aria-label="拍照">
                <div className="w-10 h-10 bg-white rounded-full border-4 border-slate-800 group-hover:border-[var(--primary)]"></div>
            </button>
            </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default CameraCaptureModal;