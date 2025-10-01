import React, { forwardRef } from 'react';
import html2canvas from 'html2canvas';
import type { AnalysisResult, SettingsState } from '../types';
import SummaryCard from './SummaryCard';
import FacialHarmonyChart from './FacialHarmonyChart';
import RecommendationsTabs from './RecommendationsTabs';
import InfoCatalogs from './InfoCatalogs';
import RiskWarning from './RiskWarning';
import ImageCompareSlider from './ImageCompareSlider';
import { RefreshIcon, SaveIcon, DownloadIcon, QuestionIcon, PrintIcon } from './icons';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
  onSave: () => void;
  settings: SettingsState;
  onAskFollowUp: (question: string) => void;
}

const AnalysisDashboard = forwardRef<HTMLDivElement, AnalysisDashboardProps>(({ result, onReset, onSave, settings, onAskFollowUp }, ref) => {
  const { 
      summaries, 
      facialHarmony, 
      riskWarning, 
      simulationUrl, 
      originalImageUrl, 
      followUpQuestions,
      surgicalRecommendations,
      nonSurgicalRecommendations,
      makeupRecommendations,
      surgicalCatalog,
      nonSurgicalCatalog,
      beautificationCatalog,
  } = result;

  const handleExportPNG = () => {
    const dashboardElement = (ref as React.RefObject<HTMLDivElement>)?.current;
    if (dashboardElement) {
        const width = dashboardElement.offsetWidth;
        const height = dashboardElement.offsetHeight;

        html2canvas(dashboardElement, {
            useCORS: true,
            scale: 2,
            backgroundColor: '#f8fafc',
            width: width,
            height: height,
            windowWidth: width,
            windowHeight: height,
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `eye-analysis-report-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error("Failed to export as PNG", err);
            alert("导出PNG失败，请稍后再试。");
        });
    }
  };
  
  const handleExportPDF = () => {
    window.print();
  }

  return (
    <div className="animate-fade-in">
        <style>
            {`
                @media print {
                    body {
                        background-color: white !important;
                    }
                    .app > header, .app > footer {
                        display: none;
                    }
                    main.container {
                        padding: 0 !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                    }
                    .print-hidden {
                        display: none !important;
                    }
                    .shadow-md {
                        box-shadow: none !important;
                    }
                    .bg-white, .bg-slate-50 {
                        background-color: white !important;
                    }
                }
            `}
        </style>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 print-hidden">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">您的专属眼眸魅力报告</h2>
                <p className="text-slate-500 mt-1">以下是基于您上传照片的 AI 分析结果。</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                 <button
                    onClick={onSave}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm"
                >
                    <SaveIcon className="w-5 h-5" />
                    保存
                </button>
                 <button
                    onClick={handleExportPNG}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-sm"
                >
                    <DownloadIcon className="w-5 h-5" />
                    导出PNG
                </button>
                 <button
                    onClick={handleExportPDF}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-sm"
                >
                    <PrintIcon className="w-5 h-5" />
                    导出PDF
                </button>
                <button
                onClick={onReset}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--text-on-primary)] rounded-md hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
                >
                <RefreshIcon className="w-5 h-5" />
                重新分析
                </button>
            </div>
        </div>

        <div ref={ref} className="space-y-6 bg-slate-50 p-0 md:p-4 rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <ImageCompareSlider before={originalImageUrl} after={simulationUrl} />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {summaries.map((summary) => (
                  <SummaryCard key={summary.title} {...summary} />
                ))}
              </div>
              <FacialHarmonyChart data={facialHarmony} settings={settings} />
            </div>
          </div>
          
          <RecommendationsTabs 
            surgical={surgicalRecommendations}
            nonSurgical={nonSurgicalRecommendations}
            makeup={makeupRecommendations}
            onAskFollowUp={onAskFollowUp}
          />
          
          <InfoCatalogs
            surgical={surgicalCatalog}
            nonSurgical={nonSurgicalCatalog}
            beautification={beautificationCatalog}
            onAskFollowUp={onAskFollowUp}
          />

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-3 mb-4">
                    <QuestionIcon className="w-7 h-7 text-blue-500" />
                    <h3 className="text-xl font-semibold text-slate-700">探索更多</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">对分析结果有疑问？可以试试问AI这些问题：</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    {followUpQuestions.map((q, i) => (
                        <button key={i} onClick={() => onAskFollowUp(q)} className="flex-1 text-left text-sm p-3 bg-blue-50 rounded-md border border-blue-200 text-blue-800 hover:bg-blue-100 transition-colors">
                            {q}
                        </button>
                    ))}
                </div>
            </div>
          
          <RiskWarning warningText={riskWarning} />
        </div>
    </div>
  );
});

export default AnalysisDashboard;