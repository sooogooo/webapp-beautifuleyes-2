import React, { useState } from 'react';
import { SettingsIcon, QuestionIcon, InfoIcon, HistoryIcon, UserIcon, LogoutIcon, UserCircleIcon } from './icons';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navButtons = [
    { handler: onOpenInstructions, icon: QuestionIcon, label: "使用说明" },
    { handler: onOpenAbout, icon: InfoIcon, label: "关于" },
    { handler: onOpenHistory, icon: HistoryIcon, label: "历史记录" },
    { handler: onOpenSettings, icon: SettingsIcon, label: "设置" },
  ];

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
            {navButtons.map(btn => (
                <button
                    key={btn.label}
                    onClick={btn.handler}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-[var(--primary)] transition-colors px-2 md:px-3 py-2 rounded-md"
                    aria-label={btn.label}
                >
                    <btn.icon className="w-5 h-5" />
                    <span className="hidden md:inline text-sm font-medium">{btn.label}</span>
                </button>
            ))}

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            {currentUser ? (
              <div className="relative">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors">
                  <img src={currentUser.avatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
                  <span className="hidden lg:inline text-sm font-medium text-slate-700 truncate max-w-[120px]">
                    {currentUser.nickname || currentUser.email}
                  </span>
                </button>
                {isMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in-up"
                    onMouseLeave={() => setIsMenuOpen(false)}
                  >
                    <button
                      onClick={() => { onOpenSettings(); setIsMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      个人资料
                    </button>
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
