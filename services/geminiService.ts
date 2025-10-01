import { GoogleGenAI, Type, Part, Chat, Modality } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import type { AnalysisResult, AnalysisCustomizationOptions, SettingsState, ChatMessage } from '../types';

// The chat functionality remains on the main thread due to its streaming nature and stateful session.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


let worker: Worker | undefined;
const pendingRequests = new Map<string, { resolve: (value: any) => void; reject: (reason?: any) => void }>();

function getWorker(): Worker {
    if (!worker) {
        // Create the worker from the gemini.worker.ts file
        worker = new Worker(new URL('../utils/gemini.worker.ts', import.meta.url), { type: 'module' });

        // Initialize worker with API Key
        worker.postMessage({
            type: 'init',
            payload: { apiKey: process.env.API_KEY }
        });

        // Listen for messages from the worker
        worker.onmessage = (event: MessageEvent) => {
            const { type, id, payload } = event.data;
            if (pendingRequests.has(id)) {
                const { resolve, reject } = pendingRequests.get(id)!;
                if (type.endsWith('_error')) {
                    reject(new Error(payload.message));
                } else {
                    resolve(payload);
                }
                pendingRequests.delete(id);
            }
        };

         worker.onerror = (error) => {
            console.error('Worker error:', error);
            // Reject all pending requests on a worker error
            pendingRequests.forEach(({ reject }) => {
                reject(new Error('An unexpected error occurred in the AI worker.'));
            });
            pendingRequests.clear();
         };
    }
    return worker;
}

// This function now delegates the heavy lifting to the Web Worker
export const analyzeImages = async (
    primaryFile: File,
    allFiles: File[],
    customization: AnalysisCustomizationOptions,
    settings: SettingsState
): Promise<AnalysisResult> => {
    return new Promise((resolve, reject) => {
        const id = uuidv4();
        pendingRequests.set(id, { resolve, reject });
        
        // We need to send file data, not the File objects themselves, to the worker
        getWorker().postMessage({
            type: 'analyze',
            id,
            payload: {
                primaryFile,
                allFiles, // The worker will handle these as needed
                customization,
                settings
            }
        });
    });
};

const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
        throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export const enhanceImage = async (
    imageFile: File
): Promise<{ enhancedUrl: string; enhancedFile: File }> => {
    return new Promise((resolve, reject) => {
        const id = uuidv4();
        pendingRequests.set(id, {
            resolve: (payload) => {
                const { enhancedUrl } = payload;
                const enhancedFile = dataURLtoFile(enhancedUrl, `enhanced_${imageFile.name}`);
                resolve({ enhancedUrl, enhancedFile });
            },
            reject
        });

        getWorker().postMessage({
            type: 'enhance',
            id,
            payload: {
                imageFile,
            }
        });
    });
};


// --- Chat functions remain on the main thread ---

export const startChatSession = (settings: SettingsState): Chat => {
    const systemInstruction = `你是贺小智，一位友善、专业的眼部美学AI助手。你的沟通风格是'${settings.aiStyle}'，内容长度偏向'${settings.aiLength}'。请回答用户关于眼部美学、分析报告、美容建议等方面的问题。`;
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });
};

export const sendChatMessage = async (chat: Chat, message: string) => {
    if (!chat) {
        throw new Error("Chat session not provided.");
    }

    const responseStream = await chat.sendMessageStream({ message });
    
    async function* streamText() {
        for await (const chunk of responseStream) {
            yield chunk.text;
        }
    }

    return streamText();
};

export const getChatFollowUpQuestions = async (analysisResult: AnalysisResult | null, chatHistory: ChatMessage[]): Promise<string[]> => {
    if (!analysisResult) {
        return [
            "双眼皮有哪些类型？",
            "如何改善黑眼圈？",
            "什么是卧蚕？它和眼袋有什么区别？"
        ];
    }
    const historyText = chatHistory.map(m => `${m.role}: ${m.parts[0].text}`).join('\n');
    const prompt = `基于以下眼部美学分析报告和用户的聊天记录，请生成3个用户接下来最可能感兴趣的、不同角度的追问问题。问题应该简短、口语化，能直接引导对话。

## 分析报告摘要
${analysisResult.summaries.map(s => `- ${s.title}: ${s.score}分, ${s.details}`).join('\n')}

## 聊天记录
${historyText}

请只返回一个JSON数组，格式为 ["问题1", "问题2", "问题3"]。不要包含任何其他文字或Markdown标记。`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const jsonText = response.text.trim().replace(/```json|```/g, '');
        const questions = JSON.parse(jsonText);
        if (Array.isArray(questions) && questions.every(q => typeof q === 'string')) {
            return questions.slice(0, 3);
        }
    } catch (e) {
        console.error("Failed to parse follow-up questions:", e);
    }

    // Fallback questions
    return analysisResult.followUpQuestions.slice(0, 3) || [];
};