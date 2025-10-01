
import React from 'react';

interface SplashScreenProps {
  isLoading: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading }) => {
  return (
    <div 
      className={`fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <img src="https://docs.bccsw.cn/logo.png" alt="Logo" className="w-24 h-24 mb-4 animate-pulse" />
      <h1 className="text-2xl font-bold text-slate-700">一张照片，发现更美的眼睛</h1>
      <p className="text-slate-500 mt-2">AI 正在启动...</p>
    </div>
  );
};

export default SplashScreen;
