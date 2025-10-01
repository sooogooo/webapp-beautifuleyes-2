import React from 'react';
import type { FacialHarmonyData, SettingsState } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface FacialHarmonyChartProps {
  data: FacialHarmonyData[];
  settings: SettingsState;
}

const themeColors = {
    default: '#f43f5e',
    sakura: '#FFB7C5',
    lavender: '#C8A2C8',
    mint: '#98FF98',
}

const FacialHarmonyChart: React.FC<FacialHarmonyChartProps> = ({ data, settings }) => {
  const chartColor = themeColors[settings.theme] || themeColors.default;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full min-h-[300px]">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">面部协调性分析</h3>
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="得分" dataKey="score" stroke={chartColor} fill={chartColor} fillOpacity={0.6} />
          <Tooltip contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem'
          }}/>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FacialHarmonyChart;