import React from 'react';
import { WarningIcon } from './icons';

interface RiskWarningProps {
  warningText: string;
}

const RiskWarning: React.FC<RiskWarningProps> = ({ warningText }) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <WarningIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-800 font-semibold">
            风险提示
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            {warningText} AI 分析结果仅供参考，不能替代专业医疗建议。在做出任何决定之前，请务必咨询合格的医疗专业人员。
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskWarning;
