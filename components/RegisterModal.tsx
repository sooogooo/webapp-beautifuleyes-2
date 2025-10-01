import React, { useState } from 'react';
import Modal from './Modal';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (email: string, pass: string) => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegister, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("两次输入的密码不一致。");
      return;
    }
    onRegister(email, password);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="注册新账户">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-slate-700">邮箱地址</label>
          <input
            type="email"
            id="email-register"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="password-register" className="block text-sm font-medium text-slate-700">设置密码 (至少6位)</label>
          <input
            type="password"
            id="password-register"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
          />
        </div>
         <div>
          <label htmlFor="confirm-password-register" className="block text-sm font-medium text-slate-700">确认密码</label>
          <input
            type="password"
            id="confirm-password-register"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--text-on-primary)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
          >
            注册
          </button>
        </div>
        <div className="text-center text-sm">
          <p className="text-slate-500">
            已有账户？{' '}
            <button type="button" onClick={onSwitchToLogin} className="font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]">
              直接登录
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterModal;
