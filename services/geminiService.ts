import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_MAIN = `你是"云峰屯堡"景区的官方AI伴游助手。
你的语气热情、知识渊博且乐于助人。
请保持回答简洁（100字以内），因为你是一个移动端的语音助手。
如果被问及停车场、当前舒适度或票务信息，请提供一般性信息，但建议用户查看首页的实时状态。
回答语言：中文。`;

const SYSTEM_INSTRUCTION_NEARBY = `你是云峰屯堡周边地区的本地旅游专家。
重点关注：
1. 地道美食（贵州菜、屯堡菜）。
2. 周边酒店和民宿。
3. 包含周边景点的1-2日游行程规划。
4. 当地交通选择。
在这里不要讨论景区内部的细节，专注于“外面”的世界。
回答语言：中文。`;

export const sendMessageToGemini = async (
  message: string, 
  history: {role: string, parts: {text: string}[]}[],
  mode: 'main' | 'nearby' = 'main'
): Promise<string> => {
  try {
    const modelId = 'gemini-3-flash-preview';
    
    const instruction = mode === 'nearby' ? SYSTEM_INSTRUCTION_NEARBY : SYSTEM_INSTRUCTION_MAIN;

    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: instruction,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "连接景区网络似乎有点问题，请重试。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "抱歉，我当前处于离线状态，请检查您的网络连接。";
  }
};