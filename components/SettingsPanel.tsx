import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { SettingsState, Theme, FontSize, AILength, AIStyle, User } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  onSettingsChange: (newSettings: Partial<SettingsState>) => void;
  currentUser: User | null;
  onUpdateProfile: (profileData: Partial<Pick<User, 'avatar' | 'nickname'>>) => void;
}

const SettingOption: React.FC<{
  label: string;
  value: string;
  currentValue: string;
  name: string;
  onChange: (value: any) => void;
}> = ({ label, value, currentValue, name, onChange }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="radio"
      name={name}
      value={value}
      checked={currentValue === value}
      onChange={(e) => onChange(e.target.value)}
      className="form-radio h-4 w-4 text-[var(--primary)] border-slate-300 focus:ring-[var(--primary)]"
    />
    <span className="text-slate-700">{label}</span>
  </label>
);

const UserProfileSettings: React.FC<{ user: User; onUpdateProfile: SettingsPanelProps['onUpdateProfile'] }> = ({ user, onUpdateProfile }) => {
    const [nickname, setNickname] = useState(user.nickname || '');
    const [avatar, setAvatar] = useState(user.avatar);
    const [isSaving, setIsSaving] = useState(false);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        await onUpdateProfile({ nickname, avatar });
        setIsSaving(false);
    };

    return (
        <div>
          <h4 className="text-lg font-semibold text-slate-800 mb-3 border-t pt-6">个人资料</h4>
          <div className="flex items-center gap-4">
            <div className="relative">
                <img src={avatar} alt="Avatar Preview" className="w-20 h-20 rounded-full object-cover"/>
                <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-slate-100">
                    <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
            </div>
            <div className="flex-grow">
                <label htmlFor="nickname" className="block text-sm font-medium text-slate-700">昵称</label>
                <input
                    type="text"
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="设置一个昵称"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm"
                />
            </div>
          </div>
           <div className="mt-4 text-right">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[var(--primary)] text-[var(--text-on-primary)] rounded-md hover:bg-[var(--primary-hover)] disabled:bg-slate-400 transition-colors text-sm font-medium"
                >
                    {isSaving ? '保存中...' : '保存资料'}
                </button>
           </div>
        </div>
    )
}


const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, settings, onSettingsChange, currentUser, onUpdateProfile }) => {

  const handleThemeChange = (theme: Theme) => {
    onSettingsChange({ theme });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="设置">
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-slate-800 mb-3">配色方案</h4>
          <div className="grid grid-cols-2 gap-4">
            <label onClick={() => handleThemeChange('default')} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-50">
              <div className={`w-8 h-8 rounded-full bg-[#f43f5e] border-2 ${settings.theme === 'default' ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]' : 'border-transparent'}`}></div>
              <span className="text-slate-700">默认 (玫瑰粉)</span>
            </label>
            <label onClick={() => handleThemeChange('sakura')} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-50">
              <div className={`w-8 h-8 rounded-full bg-[#FFB7C5] border-2 ${settings.theme === 'sakura' ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]' : 'border-transparent'}`}></div>
              <span className="text-slate-700">樱花</span>
            </label>
            <label onClick={() => handleThemeChange('lavender')} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-50">
              <div className={`w-8 h-8 rounded-full bg-[#C8A2C8] border-2 ${settings.theme === 'lavender' ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]' : 'border-transparent'}`}></div>
              <span className="text-slate-700">薰衣草</span>
            </label>
            <label onClick={() => handleThemeChange('mint')} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-50">
              <div className={`w-8 h-8 rounded-full bg-[#98FF98] border-2 ${settings.theme === 'mint' ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]' : 'border-transparent'}`}></div>
              <span className="text-slate-700">薄荷</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-slate-800 mb-3">字号设置</h4>
          <div className="flex space-x-6">
            <SettingOption label="小" value="small" currentValue={settings.fontSize} name="fontSize" onChange={(v) => onSettingsChange({ fontSize: v as FontSize })} />
            <SettingOption label="中 (默认)" value="medium" currentValue={settings.fontSize} name="fontSize" onChange={(v) => onSettingsChange({ fontSize: v as FontSize })} />
            <SettingOption label="大" value="large" currentValue={settings.fontSize} name="fontSize" onChange={(v) => onSettingsChange({ fontSize: v as FontSize })} />
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold text-slate-800 mb-3">AI 输出风格</h4>
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
            <SettingOption label="轻松幽默" value="轻松幽默" currentValue={settings.aiStyle} name="aiStyle" onChange={(v) => onSettingsChange({ aiStyle: v as AIStyle })} />
            <SettingOption label="标准日常 (默认)" value="标准日常" currentValue={settings.aiStyle} name="aiStyle" onChange={(v) => onSettingsChange({ aiStyle: v as AIStyle })} />
            <SettingOption label="科学严谨" value="科学严谨" currentValue={settings.aiStyle} name="aiStyle" onChange={(v) => onSettingsChange({ aiStyle: v as AIStyle })} />
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold text-slate-800 mb-3">AI 输出长度</h4>
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
            <SettingOption label="简约 (默认)" value="简约" currentValue={settings.aiLength} name="aiLength" onChange={(v) => onSettingsChange({ aiLength: v as AILength })} />
            <SettingOption label="标准" value="标准" currentValue={settings.aiLength} name="aiLength" onChange={(v) => onSettingsChange({ aiLength: v as AILength })} />
            <SettingOption label="详细" value="详细" currentValue={settings.aiLength} name="aiLength" onChange={(v) => onSettingsChange({ aiLength: v as AILength })} />
          </div>
        </div>
        
        {currentUser && <UserProfileSettings user={currentUser} onUpdateProfile={onUpdateProfile} />}
      </div>
    </Modal>
  );
};

export default SettingsPanel;
