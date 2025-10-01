
import React from 'react';

interface SummaryCardProps {
  title: string;
  score: number;
  details: string;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    let strokeColor = 'stroke-green-500';
    if (score < 75) strokeColor = 'stroke-yellow-500';
    if (score < 50) strokeColor = 'stroke-red-500';

    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-slate-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className={`${strokeColor} transition-all duration-1000 ease-in-out`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-700">{score}</span>
            </div>
        </div>
    );
};


const SummaryCard: React.FC<SummaryCardProps> = ({ title, score, details }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center h-full">
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
      <ScoreCircle score={score} />
      <p className="text-sm text-slate-500 mt-3 flex-grow">{details}</p>
    </div>
  );
};

export default SummaryCard;
