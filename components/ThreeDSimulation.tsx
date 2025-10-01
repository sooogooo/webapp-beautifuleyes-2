import React from 'react';
import { CubeIcon, DownloadIcon } from './icons';

interface AISimulationProps {
    simulationUrl: string; // Now a base64 data URL for the collage
}

const AISimulation: React.FC<AISimulationProps> = ({ simulationUrl }) => {

    const handleDownload = () => {
        try {
            const link = document.createElement('a');
            link.href = simulationUrl;
            link.setAttribute('download', 'ai-eye-simulation-grid.png');
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
            <div className="flex items-center space-x-2 mb-3 text-center">
                <CubeIcon className="w-6 h-6 text-slate-500"/>
                <h3 className="text-lg font-semibold text-slate-700">AI 创意模拟</h3>
            </div>
            <div className="flex-grow aspect-square bg-slate-100 rounded-md overflow-hidden relative group">
                {simulationUrl ? (
                    <img src={simulationUrl} alt="AI Simulation Grid Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">生成中...</div>
                )}
                <button
                    onClick={handleDownload}
                    className="absolute top-3 right-3 bg-black bg-opacity-40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
                    aria-label="下载模拟图片"
                >
                    <DownloadIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default AISimulation;
