
import React, { useState } from 'react';
import type { CatalogItem } from '../types';
import { BookOpenIcon, QuestionIcon } from './icons';

interface InfoCatalogsProps {
  surgical: CatalogItem[];
  nonSurgical: CatalogItem[];
  beautification: CatalogItem[];
  onAskFollowUp: (question: string) => void;
}

const AccordionItem: React.FC<{ title: string; items: CatalogItem[]; isOpen: boolean; onClick: () => void; onAskFollowUp: (question: string) => void; }> = ({ title, items, isOpen, onClick, onAskFollowUp }) => (
    <div className="border-b border-slate-200 last:border-b-0">
        <h2>
            <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-left text-slate-600 hover:bg-slate-50"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <svg className={`w-3 h-3 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                </svg>
            </button>
        </h2>
        {isOpen && (
            <div className="p-5 border-t border-slate-200 bg-white">
                <ul className="space-y-4 text-slate-500 text-sm">
                    {items.map(item => (
                        <li key={item.name}>
                            <div className="flex justify-between items-start gap-2">
                                <strong className="text-slate-700 flex-grow">{item.name}</strong>
                                <button
                                    onClick={() => onAskFollowUp(`"${item.name}"是什么？请详细解释一下。`)}
                                    className="p-1 text-slate-400 hover:text-[var(--primary)] rounded-full transition-colors flex-shrink-0"
                                    aria-label={`详细了解 ${item.name}`}
                                >
                                    <QuestionIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="mt-1">{item.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
);


const InfoCatalogs: React.FC<InfoCatalogsProps> = ({ surgical, nonSurgical, beautification, onAskFollowUp }) => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const handleAccordionClick = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };
    
    const catalogs = [
        { id: 'surgical', title: '美容外科手术目录', items: surgical },
        { id: 'nonSurgical', title: '非手术治疗目录', items: nonSurgical },
        { id: 'beautification', title: '其他美化方法目录', items: beautification },
    ];

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
                <BookOpenIcon className="w-7 h-7 text-indigo-500" />
                <h3 className="text-xl font-semibold text-slate-700">知识库</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
                以下是与眼部美化相关的常见项目简介，内容仅供参考，不代表对您的个人建议。
            </p>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                {catalogs.map((catalog) => (
                    <AccordionItem 
                        key={catalog.id}
                        title={catalog.title}
                        items={catalog.items}
                        isOpen={openAccordion === catalog.id}
                        onClick={() => handleAccordionClick(catalog.id)}
                        onAskFollowUp={onAskFollowUp}
                    />
                ))}
            </div>
        </div>
    );
};

export default InfoCatalogs;