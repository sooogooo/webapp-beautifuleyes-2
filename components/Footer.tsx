import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-slate-600 text-sm mt-8 border-t">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">联系我们</h4>
            <p>重庆联合丽格科技有限公司</p>
            <p>地址：重庆市渝中区临江支路28号</p>
            <p>电子邮件：yuxiaodong@beaucare.org</p>
            <p>联系电话：023-63326559</p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">在线咨询</h4>
            <p>扫描二维码添加顾问微信，获取一对一专业解答。</p>
            <a href="https://work.weixin.qq.com/kfid/kfc193e1c58e9c203c2" target="_blank" rel="noopener noreferrer">
                <img 
                    src="https://docs.bccsw.cn/images/dr-he/dr-he-brcode.png" 
                    alt="Contact QR Code" 
                    className="w-24 h-24 mt-2 rounded-md"
                />
            </a>
          </div>

          <div>
             <h4 className="font-semibold text-slate-800 mb-2">关于本工具</h4>
             <p>本应用使用先进的AI视觉技术，为用户提供眼部美学维度的量化分析和个性化建议。所有结果仅供参考，不构成医疗诊断依据。</p>
          </div>

        </div>
        <div className="text-center mt-8 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 opacity-60">
            Copyright © {new Date().getFullYear()} 重庆联合丽格科技有限公司. All Rights Reserved. | <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)]">渝 ICP 备 2024023473 号</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;