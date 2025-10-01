import React from 'react';
import Modal from './Modal';
import HeroImage from './HeroImage';
import { UploadIcon, SaveIcon, DownloadIcon, SettingsIcon } from './icons';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="使用说明">
      <div className="space-y-6">
        <HeroImage />
        <div>
          <h4 className="font-semibold text-lg text-slate-800 mb-2">第一步：上传您的眼部照片</h4>
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
            <UploadIcon className="w-8 h-8 text-[var(--primary)] flex-shrink-0 mt-1" />
            <div>
              <p>点击或拖拽上传一张清晰的个人正面照片。为确保分析结果的准确性，请注意以下几点：</p>
              <ul className="list-disc list-inside text-sm text-slate-600 mt-2">
                <li><strong>光线充足：</strong>避免在过暗或过曝的环境下拍摄。</li>
                <li><strong>正对镜头：</strong>面部直视镜头，不要歪头或低头。</li>
                <li><strong>无遮挡：</strong>确保头发、眼镜等没有遮挡眼部区域。</li>
                <li><strong>素颜为佳：</strong>尽量避免浓妆，以便AI能更好地识别自然特征。</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg text-slate-800 mb-2">第二步：查看和理解分析报告</h4>
          <p>上传成功后，AI将为您生成一份详细的分析报告，通常包含以下几个部分：</p>
           <ul className="list-decimal list-inside space-y-2 text-slate-700 mt-2 pl-4">
                <li><strong>核心维度总结：</strong>以分数和图表形式，直观展示您眼部在双眼皮、眼型、卧蚕等多个维度的评估结果。</li>
                <li><strong>面部协调性分析：</strong>评估您的眼部与整体面部轮廓的协调程度。</li>
                <li><strong>AI改善建议：</strong>基于分析结果，AI会提供一些个性化的美学改善建议。</li>
                <li><strong>AI效果模拟：</strong>生成一张模拟图，让您预览采纳建议后可能达到的效果。</li>
            </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg text-slate-800 mb-2">第三步：使用工具功能</h4>
           <div className="space-y-3">
             <div className="flex items-start gap-4">
                <SaveIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <p><strong>保存报告：</strong>点击“保存”按钮，可以将本次分析结果存入“分析历史”，方便日后回顾和对比。</p>
             </div>
             <div className="flex items-start gap-4">
                <DownloadIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p><strong>导出PNG：</strong>点击“导出PNG”，可以将完整的分析报告保存为一张图片，便于分享或打印。</p>
             </div>
             <div className="flex items-start gap-4">
                <SettingsIcon className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
                <p><strong>个性化设置：</strong>点击顶部的设置图标，您可以自定义应用的主题颜色、字体大小以及AI的沟通风格。</p>
             </div>
           </div>
        </div>

      </div>
    </Modal>
  );
};

export default InstructionsModal;