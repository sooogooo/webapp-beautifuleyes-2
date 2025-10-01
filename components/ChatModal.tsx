

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../types';
import { SendIcon } from './icons';
import Spinner from './Spinner';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  // FIX: Add suggestions prop to receive dynamic suggestions
  suggestions: string[];
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, history, onSendMessage, isLoading, suggestions }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if(isOpen){
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, history, isLoading]);
  
  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <>
      <div className={`fixed bottom-24 right-6 w-[calc(100%-3rem)] max-w-md bg-white rounded-lg shadow-2xl transform transition-all duration-300 ease-in-out z-50 flex flex-col h-[70vh] max-h-[600px] ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-lg flex-shrink-0">
            <div className="flex items-center gap-3">
                <img src="https://docs.bccsw.cn/images/dr-he/dr-he.jpg" alt="贺小智" className="w-10 h-10 rounded-full" />
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">贺小智</h3>
                    <p className="text-xs text-slate-500">眼部美学 AI 助手</p>
                </div>
            </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto flex-grow p-4 space-y-4">
          {history.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <img src="https://docs.bccsw.cn/images/dr-he/dr-he.jpg" alt="贺小智" className="w-6 h-6 rounded-full self-start flex-shrink-0" />}
              <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-[var(--primary)] text-[var(--text-on-primary)]' : 'bg-slate-100 text-slate-800'}`}>
                <div className="prose prose-sm max-w-none prose-p:my-1"><ReactMarkdown>{msg.parts[0].text}</ReactMarkdown></div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
               <img src="https://docs.bccsw.cn/images/dr-he/dr-he.jpg" alt="贺小智" className="w-6 h-6 rounded-full self-start flex-shrink-0" />
               <div className="max-w-[80%] p-3 rounded-lg bg-slate-100 text-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></div>
                    </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* FIX: Show suggested prompts from props */}
        {suggestions && suggestions.length > 0 && !isLoading && (
            <div className="p-3 border-t bg-white flex-shrink-0">
                <p className="text-xs font-medium text-slate-500 mb-2 px-1">可以试试问我：</p>
                <div className="flex flex-col items-start gap-2">
                    {suggestions.map(prompt => (
                        <button 
                            key={prompt} 
                            onClick={() => onSendMessage(prompt)} 
                            className="text-sm text-left text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-md transition-colors w-full"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>
        )}
        <div className="p-3 border-t bg-white rounded-b-lg flex-shrink-0">
          <div className="flex items-center gap-2 bg-slate-100 rounded-md p-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题..."
              rows={1}
              className="flex-grow bg-transparent p-2 text-sm text-slate-800 focus:outline-none resize-none"
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-2 text-white bg-[var(--primary)] rounded-md hover:bg-[var(--primary-hover)] disabled:bg-slate-300 disabled:cursor-not-allowed">
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      {isOpen && <div onClick={onClose} className="fixed inset-0 z-40"></div>}
    </>
  );
};

export default ChatModal;