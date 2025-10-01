import React, { useState } from 'react';
import type { SurgicalRecommendation, NonSurgicalRecommendation, MakeupRecommendation } from '../types';
import { ScalpelIcon, SyringeIcon, MakeupBrushIcon } from './icons';
import RecommendationCard from './RecommendationCard';

interface RecommendationsTabsProps {
  surgical: SurgicalRecommendation[];
  nonSurgical: NonSurgicalRecommendation[];
  makeup: MakeupRecommendation[];
  onAskFollowUp: (question: string) => void;
}

const RecommendationsTabs: React.FC<RecommendationsTabsProps> = ({ surgical, nonSurgical, makeup, onAskFollowUp }) => {
  const [activeTab, setActiveTab] = useState('surgical');

  const tabs = [
    { id: 'surgical', label: '手术类', icon: <ScalpelIcon className="w-5 h-5" />, recommendations: surgical },
    { id: 'nonSurgical', label: '非手术类', icon: <SyringeIcon className="w-5 h-5" />, recommendations: nonSurgical },
    { id: 'makeup', label: '妆容造型', icon: <MakeupBrushIcon className="w-5 h-5" />, recommendations: makeup },
  ];
  
  const activeRecommendations = tabs.find(tab => tab.id === activeTab)?.recommendations || [];

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-slate-700 mb-4">AI 改善建议</h3>
      <div className="mb-4 border-b border-slate-200">
        <div role="tablist" className="-mb-px flex space-x-4" aria-label="改善建议类别">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-[var(--primary)] text-[var(--primary)]'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeRecommendations.map((rec, index) => (
                <RecommendationCard 
                    key={`${activeTab}-${index}`} 
                    suggestion={rec.suggestion} 
                    reasoning={rec.reasoning} 
                    onAskFollowUp={onAskFollowUp}
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-8 text-slate-500">
                <p>暂无此类建议。</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsTabs;