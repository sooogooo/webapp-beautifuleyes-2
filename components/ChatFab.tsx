import React from 'react';

interface ChatFabProps {
  onToggleChat: () => void;
}

const ChatFab: React.FC<ChatFabProps> = ({ onToggleChat }) => {
  return (
    <button
      onClick={onToggleChat}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-white shadow-lg border-2 border-[var(--primary)] hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 animate-pulse-glow"
      aria-label="打开AI问答助手贺小智"
    >
      <img
        src="https://docs.bccsw.cn/images/dr-he/dr-he.jpg"
        alt="贺小智 AI助手"
        className="w-full h-full object-cover rounded-full"
      />
    </button>
  );
};

export default ChatFab;