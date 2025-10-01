import React from 'react';
import { SettingsIcon, QuestionIcon, InfoIcon, HistoryIcon, UserIcon, LogoutIcon } from './icons';
import type { User } from '../types';

interface HeaderProps {
  onOpenInstructions: () => void;
  onOpenAbout: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  currentUser: User | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onOpenInstructions,
  onOpenAbout,
  onOpenSettings,
  onOpenHistory,
  currentUser,
  onLogin,
  onRegister,
  onLogout
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 print-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="https://docs.bccsw.cn/logo.png" alt="Logo" className="h-8 w-auto" />
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
              一张照片，发现更美的眼睛
            </h1>
          </div>
          <nav className="flex items-center gap-1 md:gap-2">
            <button
              onClick={onOpenInstructions}
              className="flex items-center gap-1.5 text-slate-600 hover:text-[var(--primary)] transition-colors px-2 md:px-3 py-2 rounded-md"
              aria-label="使用说明"
            >
              <QuestionIcon className="w-5 h-5" />
              <span className="hidden md:inline text-sm font-medium">使用说明</span>
            </button>
            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1.5 text-slate-600 hover:text-[var(--primary)] transition-colors px-2 md:px-3 py-2 rounded-md"
              aria-label="关于"
            >
              <InfoIcon className="w-5 h-5" />
              <span className="hidden md:inline text-sm font-medium">关于</span>
            </button>
             <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 text-slate-600 hover:text-[var(--primary)] transition-colors px-2 md:px-3 py-2 rounded-md"
              aria-label="历史记录"
            >
              <HistoryIcon className="w-5 h-5" />
               <span className="hidden md:inline text-sm font-medium">历史记录</span>
            </button>
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 text-slate-600 hover:text-[var(--primary)] transition-colors px-2 md:px-3 py-2 rounded-md"
              aria-label="设置"
            >
              <SettingsIcon className="w-5 h-5" />
               <span className="hidden md:inline text-sm font-medium">设置</span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            {currentUser ? (
              <div className="relative">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100">
                  <UserIcon className="w-6 h-6 text-slate-600" />
                  <span className="hidden lg:inline text-sm font-medium text-slate-700">{currentUser.email}</span>
                </button>
                {isMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in-up"
                    onMouseLeave={() => setIsMenuOpen(false)}
                  >
                    <button
                      onClick={() => { onLogout(); setIsMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-[var(--primary)]"
                    >
                      <LogoutIcon className="w-5 h-5" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button onClick={onLogin} className="text-sm font-medium text-slate-600 hover:text-[var(--primary)] px-3 py-1.5 rounded-md transition-colors">
                  登录
                </button>
                <button onClick={onRegister} className="text-sm font-medium bg-[var(--primary)] text-[var(--text-on-primary)] px-3 py-1.5 rounded-md hover:bg-[var(--primary-hover)] transition-colors">
                  注册
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
