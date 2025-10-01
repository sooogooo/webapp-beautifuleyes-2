import React, { useState, useRef, useCallback } from 'react';
import { CubeIcon, DownloadIcon } from './icons';

interface ImageCompareSliderProps {
  before: string;
  after: string;
}

const ImageCompareSlider: React.FC<ImageCompareSliderProps> = ({ before, after }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const onMouseMove = (moveEvent: MouseEvent) => handleMove(moveEvent.clientX);
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const onTouchMove = (moveEvent: TouchEvent) => {
        if(moveEvent.touches.length > 0) {
            handleMove(moveEvent.touches[0].clientX)
        }
    };
    const onTouchEnd = () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };
  
  const handleDownloadAfterImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent slider from moving
    try {
        const link = document.createElement('a');
        link.href = after;
        link.setAttribute('download', 'ai-simulation.png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Failed to download simulation image:', error);
        alert('图片下载失败，请稍后再试。');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
            <CubeIcon className="w-6 h-6 text-slate-500"/>
            <h3 className="text-lg font-semibold text-slate-700">效果对比 (拖动滑块)</h3>
        </div>
        <button
            onClick={handleDownloadAfterImage}
            className="flex print-hidden items-center gap-1.5 text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
            aria-label="下载模拟图片"
        >
            <DownloadIcon className="w-4 h-4" />
            下载效果图
        </button>
      </div>
      <div
        ref={containerRef}
        className="relative w-full aspect-square select-none group overflow-hidden rounded-md"
      >
        <img
          src={before}
          alt="Original"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <img
          src={after}
          alt="AI Simulation"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        />
        <div
          className="absolute inset-y-0 w-1 bg-white/70 cursor-ew-resize backdrop-blur-sm print-hidden"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white/80 shadow-lg flex items-center justify-center backdrop-blur-sm">
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCompareSlider;