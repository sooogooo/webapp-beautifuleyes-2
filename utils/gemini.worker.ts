// utils/gemini.worker.ts
import { GoogleGenAI, Type, Part, Modality } from "@google/genai";
import type { AnalysisResult, AnalysisCustomizationOptions, SettingsState } from '../types';

let ai: GoogleGenAI;

// --- Helper Functions (self-contained within the worker) ---

const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            mimeType: file.type || 'application/octet-stream',
            data: base64EncodedData,
        },
    };
};

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


// --- Schema and Prompt Logic (self-contained within the worker) ---

const analysisResultSchema = {
    type: Type.OBJECT,
    properties: {
        summaries: {
            type: Type.ARRAY,
            description: "对眼睛多个美学维度的总结，每个维度包括标题、1-100的得分和简短的文字说明。",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "评估维度，例如'双眼皮对称性'或'卧蚕饱满度'" },
                    score: { type: Type.NUMBER, description: "1-100分的得分" },
                    details: { type: Type.STRING, description: "对得分的简短说明" }
                },
                required: ['title', 'score', 'details']
            }
        },
        facialHarmony: {
            type: Type.ARRAY,
            description: "面部五眼比例和三庭比例的协调性分析，每个维度包括名称和1-100的得分。",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "协调性维度，例如'三庭-上庭'或'五眼-眼间距'" },
                    score: { type: Type.NUMBER, description: "1-100分的得分" },
                },
                required: ['name', 'score']
            }
        },
        riskWarning: {
            type: Type.STRING,
            description: "基于AI分析，生成一条客观、中立的风险提示，强调AI分析的局限性和咨询专业医生的重要性。"
        },
        followUpQuestions: {
            type: Type.ARRAY,
            description: "生成3个用户可能感兴趣的、可用于和AI助手对话的追问问题。",
            items: { type: Type.STRING }
        },
        surgicalRecommendations: {
            type: Type.ARRAY,
            description: "提供2-3条具体的手术类改善建议。",
            items: {
                type: Type.OBJECT,
                properties: {
                    suggestion: { type: Type.STRING, description: "建议的标题，例如'建议进行重睑术（双眼皮手术）'" },
                    reasoning: { type: Type.STRING, description: "给出建议的详细理由，使用Markdown格式。" }
                },
                required: ['suggestion', 'reasoning']
            }
        },
        nonSurgicalRecommendations: {
            type: Type.ARRAY,
            description: "提供2-3条具体的非手术类改善建议。",
            items: {
                type: Type.OBJECT,
                properties: {
                    suggestion: { type: Type.STRING, description: "建议的标题，例如'考虑使用肉毒素进行眼周除皱'" },
                    reasoning: { type: Type.STRING, description: "给出建议的详细理由，使用Markdown格式。" },
                    type: { type: Type.STRING, enum: ['direct', 'indirect'], description: "建议类型，'direct'为直接干预，'indirect'为间接改善" }
                },
                required: ['suggestion', 'reasoning', 'type']
            }
        },
        makeupRecommendations: {
            type: Type.ARRAY,
            description: "提供2-3条具体的妆容造型类改善建议。",
            items: {
                type: Type.OBJECT,
                properties: {
                    suggestion: { type: Type.STRING, description: "建议的标题，例如'尝试使用大地色眼影增强深邃感'" },
                    reasoning: { type: Type.STRING, description: "给出建议的详细理由，使用Markdown格式。" }
                },
                required: ['suggestion', 'reasoning']
            }
        },
        surgicalCatalog: {
            type: Type.ARRAY,
            description: "生成一个相关美容外科手术的知识库目录，包含3-5个项目。",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "项目名称" },
                    description: { type: Type.STRING, description: "项目的简短客观描述" }
                },
                required: ['name', 'description']
            }
        },
        nonSurgicalCatalog: {
            type: Type.ARRAY,
            description: "生成一个相关非手术治疗的知识库目录，包含3-5个项目。",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "项目名称" },
                    description: { type: Type.STRING, description: "项目的简短客观描述" }
                },
                required: ['name', 'description']
            }
        },
        beautificationCatalog: {
            type: Type.ARRAY,
            description: "生成一个其他美化方法的知识库目录（如化妆、生活习惯等），包含3-5个项目。",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "项目名称" },
                    description: { type: Type.STRING, description: "项目的简短客观描述" }
                },
                required: ['name', 'description']
            }
        }
    },
    required: [
        'summaries', 'facialHarmony', 'riskWarning', 'followUpQuestions',
        'surgicalRecommendations', 'nonSurgicalRecommendations', 'makeupRecommendations',
        'surgicalCatalog', 'nonSurgicalCatalog', 'beautificationCatalog'
    ]
};

const getSystemInstruction = (settings: SettingsState, customization: AnalysisCustomizationOptions) => {
    let instruction = `你是一位专业、顶尖的医疗美容AI顾问，专攻眼部美学分析。你的任务是基于用户上传的眼部照片，提供一份全面、客观、科学的分析报告。
你的分析应遵循结构化的JSON格式。请严格遵守下面定义的response schema。
你的沟通风格应为: ${settings.aiStyle}。
你的输出内容应: ${settings.aiLength}。`;

    if (customization.topics.length > 0) {
        instruction += `\n用户特别要求关注以下分析维度：${customization.topics.join('、')}。请在报告中对这些方面进行侧重分析。`;
    }
    if (customization.userPrompt) {
        instruction += `\n用户还有一个性化需求：“${customization.userPrompt}”。请在分析和建议中充分考虑并回应这个需求。`;
    }
    
    instruction += `\n请务必确保所有评分都落在1-100的范围内，且描述文字符合设定的风格和长度要求。所有建议都必须是安全、可行且符合医学伦理的。`;
    return instruction;
}


// --- Core Worker Logic ---

const performAnalysis = async (
    primaryFile: File,
    allFiles: File[], // Reserved for future multi-image analysis logic
    customization: AnalysisCustomizationOptions,
    settings: SettingsState
): Promise<AnalysisResult> => {
    if (!ai) throw new Error("AI model not initialized in worker.");
    
    const imagePart = await fileToGenerativePart(primaryFile);
    const systemInstruction = getSystemInstruction(settings, customization);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [imagePart, { text: "请根据我的系统指令和这张用户的眼部照片，生成一份详细的美学分析报告。" }] },
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: analysisResultSchema,
        }
    });

    const jsonText = response.text.trim();
    let analysisData;
    try {
        analysisData = JSON.parse(jsonText);
    } catch (e) {
        console.error("Worker: Failed to parse JSON response from Gemini:", jsonText, e);
        throw new Error("AI返回的数据格式无效，请稍后重试。");
    }
    
    const simulationPromptSuggestion = analysisData.surgicalRecommendations[0]?.suggestion || "为眼睛进行综合美学优化";
    const simulationPrompt = `基于这张图片，请模拟执行"${simulationPromptSuggestion}"之后可能达到的自然、协调的效果。请只返回修改后的图片，不要返回任何文字。`;

    const imageEditResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [ imagePart, { text: simulationPrompt } ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    let simulationUrl = '';
    const imagePartFromResponse = imageEditResponse.candidates?.[0]?.content?.parts.find(part => part.inlineData);
    if (imagePartFromResponse && imagePartFromResponse.inlineData) {
        const base64ImageBytes = imagePartFromResponse.inlineData.data;
        const mimeType = imagePartFromResponse.inlineData.mimeType;
        simulationUrl = `data:${mimeType};base64,${base64ImageBytes}`;
    } else {
        simulationUrl = await fileToDataUrl(primaryFile);
        console.warn("Worker: Image simulation failed, using original image as fallback.");
    }
    
    const originalImageUrlDataUrl = await fileToDataUrl(primaryFile);

    const result: AnalysisResult = {
        ...analysisData,
        id: `analysis-${Date.now()}`,
        timestamp: Date.now(),
        originalImageUrl: originalImageUrlDataUrl,
        simulationUrl,
    };

    return result;
};

const performEnhancement = async (imageFile: File): Promise<{ enhancedUrl: string; mimeType: string }> => {
    if (!ai) throw new Error("AI model not initialized in worker.");
    
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = "Enhance this photo for clarity and aesthetic analysis. Improve lighting, sharpness, and correct minor blemishes, but maintain the original facial features without altering them. Return only the enhanced image without any text explanation.";

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [ imagePart, { text: prompt } ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    const imagePartFromResponse = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);

    if (imagePartFromResponse && imagePartFromResponse.inlineData) {
        const base64ImageBytes = imagePartFromResponse.inlineData.data;
        const mimeType = imagePartFromResponse.inlineData.mimeType;
        const enhancedUrl = `data:${mimeType};base64,${base64ImageBytes}`;
        return { enhancedUrl, mimeType };
    } else {
        console.warn("Worker: Image enhancement failed. Returning original image.");
        // Fallback to original image if enhancement fails
        const originalUrl = await fileToDataUrl(imageFile);
        return { enhancedUrl: originalUrl, mimeType: imageFile.type };
    }
};


// --- Worker Message Handler ---

self.onmessage = async (event: MessageEvent) => {
    const { type, id, payload } = event.data;

    try {
        if (type === 'init') {
            ai = new GoogleGenAI({ apiKey: payload.apiKey });
        } else if (type === 'analyze') {
            const { primaryFile, allFiles, customization, settings } = payload;
            const result = await performAnalysis(primaryFile, allFiles, customization, settings);
            self.postMessage({ type: 'analysis_complete', id, payload: result });
        } else if (type === 'enhance') {
            const { imageFile } = payload;
            const result = await performEnhancement(imageFile);
            self.postMessage({ type: 'enhance_complete', id, payload: result });
        }
    } catch (error: any) {
        console.error(`Worker error on task ${id}:`, error);
        const errorType = `${type}_error`;
        self.postMessage({ type: errorType, id, payload: { message: error.message || 'An unknown error occurred in the worker.' } });
    }
};