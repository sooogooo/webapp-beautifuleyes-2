import type { Part } from "@google/genai";

export interface User {
  id: string;
  email: string;
  avatar?: string; // Data URL for avatar
  nickname?: string;
}

export type Theme = 'default' | 'sakura' | 'lavender' | 'mint';
export type AILength = '简约' | '标准' | '详细';
export type AIStyle = '轻松幽默' | '标准日常' | '科学严谨';
export type FontSize = 'small' | 'medium' | 'large';

export interface SettingsState {
  theme: Theme;
  fontSize: FontSize;
  aiLength: AILength;
  aiStyle: AIStyle;
}

export interface UploadedFile {
    file: File;
    url: string;
    validationMessage?: string;
    enhancedFile?: File;
    enhancedUrl?: string;
}

export interface AnalysisCustomizationOptions {
    topics: string[];
    userPrompt: string;
    gridLayout: '4-grid' | '9-grid';
}

export interface SummaryData {
    title: string;
    score: number;
    details: string;
}

export interface FacialHarmonyData {
    name: string;
    score: number;
}

export interface SurgicalRecommendation {
    suggestion: string;
    reasoning: string;
}

export interface NonSurgicalRecommendation {
    suggestion: string;
    reasoning: string;
    type: 'direct' | 'indirect';
}

export interface MakeupRecommendation {
    suggestion: string;
    reasoning: string;
}

export interface CatalogItem {
    name: string;
    description: string;
}

export interface AnalysisResult {
    id: string;
    timestamp: number;
    originalImageUrl: string; // Now a base64 data URL
    simulationUrl: string; // Now a base64 data URL
    summaries: SummaryData[];
    facialHarmony: FacialHarmonyData[];
    riskWarning: string;
    followUpQuestions: string[];
    surgicalRecommendations: SurgicalRecommendation[];
    nonSurgicalRecommendations: NonSurgicalRecommendation[];
    makeupRecommendations: MakeupRecommendation[];
    surgicalCatalog: CatalogItem[];
    nonSurgicalCatalog: CatalogItem[];
    beautificationCatalog: CatalogItem[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: Part[];
}