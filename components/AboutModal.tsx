import React from 'react';
import Modal from './Modal';
import HeroImage from './HeroImage';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="关于「美丽的眼睛」">
      <div className="space-y-6">
        <HeroImage />
        <div className="prose prose-slate max-w-none">
            <h4>应用简介</h4>
            <p>
            「美丽的眼睛」是一款基于前沿人工智能技术的眼部美学评估工具。它旨在为广大求美者和医疗美容从业人员提供一个科学、客观、个性化的美学分析平台。通过上传眼部照片，用户可以获得多维度的量化评估报告、符合个人特征的改善建议，以及直观的AI效果模拟。
            </p>
            
            <h4>技术核心</h4>
            <p>
            本应用的核心驱动力来自 Google 的 Gemini 系列模型。我们利用其强大的多模态理解和生成能力，实现了对图像的深度美学分析和逼真的视觉效果模拟。
            </p>
            <ul>
                <li><strong>眼部特征分析:</strong> 使用 <code>gemini-2.5-flash</code> 模型，结合专业美学知识库，对眼部各项指标进行精确分析。</li>
                <li><strong>效果模拟:</strong> 使用 <code>gemini-2.5-flash-image-preview</code> (nano-banana) 模型，根据分析结果和改善建议，生成自然、逼真的术后模拟图。</li>
            </ul>

            <h4>开发与运营</h4>
            <p>
            本应用由 <strong>重庆联合丽格科技有限公司</strong> 精心研发和运营。我们致力于将尖端科技与医疗美容实践相结合，为行业带来更高效、更透明的解决方案。
            </p>
            <p>
                如果您有任何问题、建议或合作意向，请随时通过以下方式联系我们：
            </p>
            <ul>
                <li><strong>地址:</strong> 重庆市渝中区临江支路28号</li>
                <li><strong>电子邮件:</strong> yuxiaodong@beaucare.org</li>
                <li><strong>联系电话:</strong> 023-63326559</li>
            </ul>

            <h4>软件信息</h4>
            <ul>
                <li><strong>软件版本:</strong> 0.5.7</li>
                <li><strong>部署时间:</strong> 2025年10月1日</li>
            </ul>

            <hr />
            <p className="text-xs text-slate-500">
            <strong>免责声明:</strong> 所有分析结果、建议和模拟效果均由AI生成，仅供参考，不能替代执业医师的专业诊断和建议。在做出任何医疗决策前，请务必咨询合格的医疗专业人员。
            </p>
        </div>
      </div>
    </Modal>
  );
};

export default AboutModal;