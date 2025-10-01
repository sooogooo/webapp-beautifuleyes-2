import React from 'react';
import ReactMarkdown from 'react-markdown';
import { QuestionIcon } from './icons';

interface RecommendationCardProps {
  suggestion: string;
  reasoning: string;
  onAskFollowUp: (question: string) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ suggestion, reasoning, onAskFollowUp }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 h-full flex flex-col">
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-semibold text-slate-700 flex-grow">{suggestion}</h4>
        <button
            onClick={() => onAskFollowUp(`关于“${suggestion}”，能解释得更详细一些吗？`)}
            className="p-1 text-slate-400 hover:text-[var(--primary)] rounded-full transition-colors flex-shrink-0"
            aria-label={`详细了解 ${suggestion}`}
        >
            <QuestionIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="prose prose-sm max-w-none text-slate-600 mt-2 flex-grow">
        <ReactMarkdown>{reasoning}</ReactMarkdown>
      </div>
    </div>
  );
};

export default RecommendationCard;
