import React from 'react';
import Modal from './Modal';
import type { AnalysisResult } from '../types';
import { RefreshIcon, WarningIcon } from './icons';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisResult[];
  onLoad: (result: AnalysisResult) => void;
  onDelete: (resultId: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onLoad, onDelete }) => {
    
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="历史分析记录">
      <div className="space-y-4">
        {history.length > 0 ? (
          history.map(item => (
            <div key={item.id} className="p-4 border rounded-lg flex items-center justify-between gap-4 bg-slate-50">
              <div className="flex items-center gap-4">
                <img src={item.originalImageUrl} alt="历史记录缩略图" className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-700">分析于 {formatDate(item.timestamp)}</p>
                  <p className="text-sm text-slate-500">{item.summaries[0]?.title}: {item.summaries[0]?.score}分</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onLoad(item)}
                  className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  加载
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("确定要删除这条记录吗？此操作无法撤销。")) {
                      onDelete(item.id);
                    }
                  }}
                  className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
             <WarningIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <p className="font-semibold">暂无历史记录</p>
            <p className="text-sm mt-1">完成分析后，点击报告页面的“保存”按钮即可在此处看到记录。</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default HistoryModal;
