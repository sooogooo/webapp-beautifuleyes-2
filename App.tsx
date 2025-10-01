import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import type { Chat } from '@google/genai';

// Lazily load components
const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));
const FileUpload = lazy(() => import('./components/FileUpload'));
const AnalysisCustomization = lazy(() => import('./components/AnalysisCustomization'));
const DashboardSkeleton = lazy(() => import('./components/DashboardSkeleton'));
const AnalysisDashboard = lazy(() => import('./components/AnalysisDashboard'));
const SplashScreen = lazy(() => import('./components/SplashScreen'));
const HomePageEffects = lazy(() => import('./components/HomePageEffects'));
const InstructionsModal = lazy(() => import('./components/InstructionsModal'));
const AboutModal = lazy(() => import('./components/AboutModal'));
const SettingsPanel = lazy(() => import('./components/SettingsPanel'));
const HistoryModal = lazy(() => import('./components/HistoryModal'));
const LoginModal = lazy(() => import('./components/LoginModal'));
const RegisterModal = lazy(() => import('./components/RegisterModal'));
const ChatFab = lazy(() => import('./components/ChatFab'));
const ChatModal = lazy(() => import('./components/ChatModal'));

// Types and Services
import type {
  SettingsState,
  UploadedFile,
  AnalysisResult,
  AnalysisCustomizationOptions,
  User,
  ChatMessage,
} from './types';
import { analyzeImages, startChatSession, sendChatMessage, getChatFollowUpQuestions } from './services/geminiService';
import { registerUser, loginUser, logoutUser, getCurrentUser, updateUserProfile } from './utils/authService';

type AppState = 'splash' | 'home' | 'customizing' | 'analyzing' | 'result';
type ModalState = 'instructions' | 'about' | 'settings' | 'history' | 'login' | 'register' | null;

// Helper to get user-specific key for localStorage
const getUserStorageKey = (key: string, user: User | null) => {
    return user ? `${user.email}_${key}` : `guest_${key}`;
};

const App: React.FC = () => {
    const [appStatus, setAppStatus] = useState<'loading' | 'ready'>('loading');
    const [appState, setAppState] = useState<AppState>('home');
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [activeModal, setActiveModal] = useState<ModalState>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [chatSuggestions, setChatSuggestions] = useState<string[]>([]);
    
    const dashboardRef = useRef<HTMLDivElement>(null);

    const [settings, setSettings] = useState<SettingsState>({
        theme: 'default',
        fontSize: 'medium',
        aiLength: '简约',
        aiStyle: '标准日常',
    });
    
    // --- Data Persistence Logic ---

    // Load data for the current user (or guest)
    const loadUserData = useCallback((user: User | null) => {
        const settingsKey = getUserStorageKey('settings', user);
        const historyKey = getUserStorageKey('analysisHistory', user);
        const chatKey = getUserStorageKey('chatHistory', user);

        const savedSettings = localStorage.getItem(settingsKey);
        setSettings(savedSettings ? JSON.parse(savedSettings) : { theme: 'default', fontSize: 'medium', aiLength: '简约', aiStyle: '标准日常' });

        const savedHistory = localStorage.getItem(historyKey);
        setAnalysisHistory(savedHistory ? JSON.parse(savedHistory) : []);

        const savedChat = localStorage.getItem(chatKey);
        setChatHistory(savedChat ? JSON.parse(savedChat) : []);
    }, []);
    
    // Save data for the current user (or guest)
    useEffect(() => {
        localStorage.setItem(getUserStorageKey('settings', currentUser), JSON.stringify(settings));
    }, [settings, currentUser]);

    useEffect(() => {
        localStorage.setItem(getUserStorageKey('analysisHistory', currentUser), JSON.stringify(analysisHistory));
    }, [analysisHistory, currentUser]);

    useEffect(() => {
        localStorage.setItem(getUserStorageKey('chatHistory', currentUser), JSON.stringify(chatHistory));
    }, [chatHistory, currentUser]);

    // --- App Initialization ---

    useEffect(() => {
        const timer = setTimeout(() => setAppStatus('ready'), 3500); // Splash screen duration
        const user = getCurrentUser();
        setCurrentUser(user);
        loadUserData(user);
        
        return () => clearTimeout(timer);
    }, [loadUserData]);

    // --- Effects ---
    
    useEffect(() => {
        document.documentElement.dataset.theme = settings.theme;
        const fontSizeMap = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
        document.documentElement.className = fontSizeMap[settings.fontSize];
    }, [settings.theme, settings.fontSize]);
    
    useEffect(() => {
        document.body.style.overflow = activeModal || isChatOpen ? 'hidden' : 'auto';
    }, [activeModal, isChatOpen]);

    // --- Handlers ---
    
    const handleFilesSelect = useCallback((files: File[]) => {
        const newUploadedFiles = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setUploadedFiles(prev => {
            prev.forEach(f => URL.revokeObjectURL(f.url));
            return newUploadedFiles;
        });
        setAppState('customizing');
    }, []);

    const handleFileUpdate = useCallback((index: number, updates: Partial<UploadedFile>) => {
        setUploadedFiles(prev => {
            const newFiles = [...prev];
            if (newFiles[index]) {
                newFiles[index] = { ...newFiles[index], ...updates };
            }
            return newFiles;
        });
    }, []);

    const handleStartAnalysis = useCallback(async (primaryFile: UploadedFile, allFiles: File[], customization: AnalysisCustomizationOptions) => {
        setAppState('analyzing');
        try {
            const result = await analyzeImages(primaryFile.file, allFiles, customization, settings);
            setAnalysisResult(result);
            setAppState('result');
            setChatHistory([]); 
            setChatSession(null);
        } catch (error) {
            console.error("Analysis failed:", error);
            alert(`分析失败: ${error instanceof Error ? error.message : "未知错误"}`);
            setAppState('customizing');
        }
    }, [settings]);

    const handleReset = useCallback(() => {
        uploadedFiles.forEach(f => URL.revokeObjectURL(f.url));
        setUploadedFiles([]);
        setAnalysisResult(null);
        setAppState('home');
    }, [uploadedFiles]);

    const handleSaveResult = useCallback(() => {
        if (analysisResult) {
            if (!analysisHistory.some(h => h.id === analysisResult.id)) {
                setAnalysisHistory(prev => [analysisResult, ...prev]);
                alert("报告已保存到历史记录！");
            } else {
                alert("这份报告已经保存过了。");
            }
        }
    }, [analysisResult, analysisHistory]);

    const handleLoadResult = (result: AnalysisResult) => {
        setAnalysisResult(result);
        setAppState('result');
        setActiveModal(null);
        window.scrollTo(0, 0);
    };

    const handleDeleteResult = (resultId: string) => {
        setAnalysisHistory(prev => prev.filter(h => h.id !== resultId));
    };
    
    // --- Chat Handlers ---
    
    const handleToggleChat = useCallback(async () => {
        const newIsOpen = !isChatOpen;
        setIsChatOpen(newIsOpen);
        if (newIsOpen) {
            setIsChatLoading(true);
            try {
                const suggestions = await getChatFollowUpQuestions(analysisResult, chatHistory);
                setChatSuggestions(suggestions);
            } finally {
                setIsChatLoading(false);
            }
        }
    }, [isChatOpen, analysisResult, chatHistory]);
    
    const handleSendMessage = useCallback(async (message: string) => {
        setIsChatLoading(true);
        setChatSuggestions([]);

        let session = chatSession;
        if (!session) {
            session = startChatSession(settings);
            setChatSession(session);
        }
        
        setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: message }] }]);

        try {
            const responseStream = await sendChatMessage(session, message);
            let fullResponse = '';
            
            const modelMessage: ChatMessage = { role: 'model', parts: [{ text: '' }] };
            setChatHistory(prev => [...prev, modelMessage]);

            for await (const chunk of responseStream) {
                fullResponse += chunk;
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    const lastMessage = newHistory[newHistory.length - 1];
                    if (lastMessage && lastMessage.role === 'model') {
                       lastMessage.parts[0].text = fullResponse;
                    }
                    return newHistory;
                });
            }
            const newSuggestions = await getChatFollowUpQuestions(analysisResult, [...chatHistory, {role: 'model', parts: [{text: fullResponse}] }]);
            setChatSuggestions(newSuggestions);

        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "抱歉，我遇到了一些麻烦，请稍后再试。" }] };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsChatLoading(false);
        }
    }, [chatSession, settings, analysisResult, chatHistory]);
    
    const handleAskFollowUp = (question: string) => {
      setIsChatOpen(true);
      setTimeout(() => handleSendMessage(question), 100);
    };

    // --- Auth Handlers ---

    const handleLogin = async (email: string, pass: string) => {
        try {
            const user = await loginUser(email, pass);
            setCurrentUser(user);
            loadUserData(user); // Load user's data
            setActiveModal(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : '登录失败');
        }
    };
    
    const handleRegister = async (email: string, pass: string) => {
        try {
            const user = await registerUser(email, pass);
            setCurrentUser(user);
            loadUserData(user); // Load initial data for new user
            setActiveModal(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : '注册失败');
        }
    };

    const handleLogout = () => {
        logoutUser();
        setCurrentUser(null);
        loadUserData(null); // Load guest data
        setAppState('home'); // Go to home on logout
    };
    
    const handleUpdateProfile = async (profileData: Partial<Pick<User, 'avatar' | 'nickname'>>) => {
        if (!currentUser) return;
        try {
            const updatedUser = await updateUserProfile(currentUser.email, profileData);
            setCurrentUser(updatedUser);
            alert("个人资料已更新！");
        } catch (error) {
            alert(error instanceof Error ? error.message : '更新失败');
        }
    };

    // --- Render Logic ---

    const renderContent = () => {
        switch (appState) {
            case 'customizing':
                return <AnalysisCustomization files={uploadedFiles} validationMessages={[]} onStartAnalysis={handleStartAnalysis} onReset={handleReset} onUpdateFile={handleFileUpdate} />;
            case 'analyzing':
                return <DashboardSkeleton />;
            case 'result':
                return analysisResult ? <AnalysisDashboard ref={dashboardRef} result={analysisResult} onReset={handleReset} onSave={handleSaveResult} settings={settings} onAskFollowUp={handleAskFollowUp}/> : <p>发生错误，无法显示结果。</p>;
            case 'home':
            default:
                return (
                    <div className="text-center max-w-2xl mx-auto relative">
                        <HomePageEffects />
                        <div className="relative">
                            <h1 className="text-4xl md:text-5xl font-extold text-slate-800 tracking-tight">
                                <span className="text-[var(--primary)]">更美的眼睛</span>与更快乐的生活
                            </h1>
                            <p className="mt-6 text-lg text-slate-600">
                                基于 Google Gemini AI 的顶尖视觉技术，为您提供专业、个性化的眼部美学分析报告和改善建议。
                            </p>
                            <div className="mt-8">
                                <FileUpload onFilesSelect={handleFilesSelect} />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const fallbackUI = <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-[60] flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div></div>;

    if (appStatus === 'loading') {
        return <Suspense fallback={<div></div>}><SplashScreen isLoading={true} /></Suspense>;
    }

    return (
        <div className="app flex flex-col min-h-screen bg-slate-50 font-sans">
             <Suspense fallback={<header className="h-16"></header>}>
                <Header 
                    currentUser={currentUser}
                    onLogin={() => setActiveModal('login')}
                    onRegister={() => setActiveModal('register')}
                    onLogout={handleLogout}
                    onOpenInstructions={() => setActiveModal('instructions')}
                    onOpenAbout={() => setActiveModal('about')}
                    onOpenSettings={() => setActiveModal('settings')}
                    onOpenHistory={() => setActiveModal('history')}
                />
            </Suspense>
            <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 flex-grow">
                 <Suspense fallback={<DashboardSkeleton />}>
                    {renderContent()}
                </Suspense>
            </main>
            <Suspense fallback={null}><Footer /></Suspense>

            <Suspense fallback={fallbackUI}>
                {activeModal === 'instructions' && <InstructionsModal isOpen={true} onClose={() => setActiveModal(null)} />}
                {activeModal === 'about' && <AboutModal isOpen={true} onClose={() => setActiveModal(null)} />}
                {activeModal === 'settings' && <SettingsPanel 
                    isOpen={true} 
                    onClose={() => setActiveModal(null)} 
                    settings={settings} 
                    onSettingsChange={(newSettings) => setSettings(s => ({...s, ...newSettings}))}
                    currentUser={currentUser}
                    onUpdateProfile={handleUpdateProfile}
                />}
                {activeModal === 'history' && <HistoryModal 
                    isOpen={true} 
                    onClose={() => setActiveModal(null)} 
                    history={analysisHistory} 
                    onLoad={handleLoadResult} 
                    onDelete={handleDeleteResult} 
                />}
                {activeModal === 'login' && <LoginModal isOpen={true} onClose={() => setActiveModal(null)} onLogin={handleLogin} onSwitchToRegister={() => setActiveModal('register')} />}
                {activeModal === 'register' && <RegisterModal isOpen={true} onClose={() => setActiveModal(null)} onRegister={handleRegister} onSwitchToLogin={() => setActiveModal('login')} />}
            </Suspense>
            
            <Suspense fallback={null}>
                <ChatFab onToggleChat={handleToggleChat} />
                {isChatOpen && <ChatModal 
                    isOpen={isChatOpen} 
                    onClose={() => setIsChatOpen(false)}
                    history={chatHistory}
                    onSendMessage={handleSendMessage}
                    isLoading={isChatLoading}
                    suggestions={chatSuggestions}
                />}
            </Suspense>
        </div>
    );
};

export default App;