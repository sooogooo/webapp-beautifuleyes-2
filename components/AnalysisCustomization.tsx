import React, { useState } from 'react';
import type { UploadedFile, AnalysisCustomizationOptions } from '../types';
import { RefreshIcon, WarningIcon, ChevronDownIcon, SparklesIcon } from './icons';
import { enhanceImage } from '../services/geminiService';

interface AnalysisCustomizationProps {
  files: UploadedFile[];
  validationMessages: string[];
  onStartAnalysis: (primaryFile: UploadedFile, allFiles: File[], customization: AnalysisCustomizationOptions) => void;
  onReset: () => void;
  onUpdateFile: (index: number, updates: Partial<UploadedFile>) => void;
}

const categorizedTopics = [
    {
        category: '眼部基础形态',
        topics: [
            '眼裂形状',
            '内外眼角形态',
            '双眼皮类型',
            '卧蚕形态',
            '睫毛浓密度与卷翘度',
            '瞳孔暴露度',
        ],
    },
    {
        category: '眼周结构与比例',
        topics: [
            '眉眼距离',
            '眼间距',
            '眼周皮肤紧致度',
            '眼眶饱满度',
            '黑眼圈与眼袋',
        ],
    },
    {
        category: '神韵与气质',
        topics: [
            '情绪、表达',
            '意象(古典文学)',
            '现代网络热点',
            '社交热点',
        ]
    }
];


const AnalysisCustomization: React.FC<AnalysisCustomizationProps> = ({ files, validationMessages, onStartAnalysis, onReset, onUpdateFile }) => {
    const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [userPrompt, setUserPrompt] = useState('');
    const [gridLayout, setGridLayout] = useState<'4-grid' | '9-grid'>('4-grid');
    const [openCategory, setOpenCategory] = useState<string | null>(categorizedTopics[0].category);
    const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);

    const handleTopicToggle = (topic: string) => {
        setSelectedTopics(prev => 
            prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
        );
    };

    const handleEnhance = async (index: number) => {
        if (enhancingIndex !== null) return;
        setEnhancingIndex(index);
        try {
            const fileToEnhance = files[index].file;
            const { enhancedUrl, enhancedFile } = await enhanceImage(fileToEnhance);
            onUpdateFile(index, { enhancedUrl, enhancedFile });
        } catch (error) {
            console.error("Enhancement failed:", error);
            alert("图片增强失败，请稍后再试。");
        } finally {
            setEnhancingIndex(null);
        }
    };

    const handleSubmit = () => {
        if (selectedFileIndex === null) {
            alert("请选择一张主要图片用于分析。");
            return;
        }
        const primaryFileRaw = files[selectedFileIndex];
        // Prioritize using the enhanced file for analysis if it exists
        const primaryFile: UploadedFile = {
            ...primaryFileRaw,
            file: primaryFileRaw.enhancedFile || primaryFileRaw.file,
            url: primaryFileRaw.enhancedUrl || primaryFileRaw.url,
        };
        const allFiles = files.map(f => f.file);
        const customizationOptions: AnalysisCustomizationOptions = {
            topics: selectedTopics,
            userPrompt,
            gridLayout
        };
        onStartAnalysis(primaryFile, allFiles, customizationOptions);
    };

    return (
        <div className="animate-fade-in space-y-8">
            {validationMessages.length > 0 && (
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <WarningIcon className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-800 font-semibold">部分照片无法使用</p>
                            <p className="text-sm text-yellow-700 mt-1" dangerouslySetInnerHTML={{ __html: validationMessages.join('<br>') }}></p>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">1. 选择主图</h2>
                <p className="text-slate-500 mb-4">请在可用的照片中选择一张作为主要分析和模拟的基础。可使用“AI增强”优化图片质量。</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl">
                    {files.map((file, index) => (
                        <div key={index} onClick={() => setSelectedFileIndex(index)}
                            className={`relative group cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${selectedFileIndex === index ? 'border-[var(--primary)] shadow-lg' : 'border-transparent hover:border-slate-300'}`}>
                            <img src={file.enhancedUrl || file.url} alt={`preview ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                            {selectedFileIndex === index && !file.enhancedUrl && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEnhance(index);
                                    }}
                                    disabled={enhancingIndex !== null}
                                    className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm hover:bg-black/70 transition-colors disabled:bg-black/70 disabled:cursor-wait"
                                >
                                    {enhancingIndex === index ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            增强中...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-4 h-4" />
                                            AI 增强
                                        </>
                                    )}
                                </button>
                            )}
                            {file.enhancedUrl && (
                                <div className="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow">
                                    已增强
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">2. 定制分析维度 (可选)</h2>
                <p className="text-slate-500 mb-4">选择您感兴趣的分析焦点，AI将会在报告中侧重阐述。</p>
                <div className="space-y-2">
                    {categorizedTopics.map(({ category, topics }) => (
                        <div key={category} className="border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setOpenCategory(openCategory === category ? null : category)}
                                className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <span>{category}</span>
                                <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${openCategory === category ? 'rotate-180' : ''}`} />
                            </button>
                            {openCategory === category && (
                                <div className="p-4 border-t border-slate-200 bg-white">
                                    <div className="flex flex-wrap gap-3">
                                        {topics.map(topic => (
                                            <button
                                                key={topic}
                                                onClick={() => handleTopicToggle(topic)}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${selectedTopics.includes(topic) ? 'bg-[var(--primary)] text-[var(--text-on-primary)] border-[var(--primary)]' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'}`}
                                            >
                                                {topic}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">3. 输入您的个性化需求 (可选)</h2>
                <p className="text-slate-500 mb-4">有什么特别想让AI分析的吗？请在这里输入。</p>
                <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="例如：请帮我分析一下我的眼睛是否适合桃花眼妆容"
                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition"
                    rows={3}
                />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">4. 选择模拟效果布局</h2>
                <p className="text-slate-500 mb-4">选择您希望AI生成的创意模拟图的展示方式。</p>
                <div className="flex bg-slate-100 p-1 rounded-md w-max">
                    <button onClick={() => setGridLayout('4-grid')} className={`px-6 py-2 text-sm rounded-md transition-colors ${gridLayout === '4-grid' ? 'bg-white shadow text-[var(--primary)] font-semibold' : 'text-slate-600'}`}>
                        四宫格
                    </button>
                    <button onClick={() => setGridLayout('9-grid')} className={`px-6 py-2 text-sm rounded-md transition-colors ${gridLayout === '9-grid' ? 'bg-white shadow text-[var(--primary)] font-semibold' : 'text-slate-600'}`}>
                        九宫格
                    </button>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap pt-6 border-t border-slate-200">
                <button
                    onClick={handleSubmit}
                    disabled={selectedFileIndex === null}
                    className="w-full sm:w-auto px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-semibold shadow-lg text-lg"
                >
                    开始智能分析
                </button>
                <button
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors font-medium"
                >
                    <RefreshIcon className="w-5 h-5" />
                    重新上传
                </button>
            </div>
        </div>
    );
};

export default AnalysisCustomization;