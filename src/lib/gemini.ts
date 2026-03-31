import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { KERALA_SCAM_KNOWLEDGE_BASE } from "./knowledgeBase";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PhishAnalysis {
  scamScore: number;
  vibeCheck: 'SAFE' | 'SUS' | 'SCAM';
  theTea: string;
  malayalamExplanation: string;
  redFlags: string[];
  action: string;
  specialCheck?: {
    type: 'LOOT' | 'AMBITION' | 'EGO';
    label: string;
    content: string;
  };
}

export async function generateScamDiagram(scamType: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a professional, high-tech educational infographic diagram explaining the flow of a "${scamType}". Use clean icons, flow arrows, and a dark, modern ninja theme (deep blues, blacks, and glowing orange accents). The diagram should visualize the process step-by-step. No text labels, just visual flow.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from the model.");
    }

    const parts = response.candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No parts found in the response.");
    }

    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found.");
  } catch (error) {
    console.error("Error in generateScamDiagram, using fallback:", error);
    // Fallback to a relevant placeholder if API limit is reached
    return `https://picsum.photos/seed/${encodeURIComponent(scamType)}-diagram/1280/720`;
  }
}

export async function generateNarutoSensei(): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A professional, high-quality 2D anime-style avatar of Naruto Uzumaki as a wise cybersecurity sensei. He is wearing his classic orange and black outfit but with a modern tech-ninja twist (maybe some glowing blue data lines or a high-tech headband). He has a confident, friendly smile and is giving a thumbs up. The background is a dark, atmospheric ninja dojo with subtle orange chakra glow and faint digital patterns. High resolution, vibrant colors, clean lines.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from the model.");
    }

    const parts = response.candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No parts found in the response.");
    }

    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found.");
  } catch (error) {
    console.error("Error in generateNarutoSensei, using fallback:", error);
    // Fallback to a high-quality placeholder if API limit is reached
    return `https://picsum.photos/seed/naruto-sensei-cyber/512/512`;
  }
}

export async function analyzePhishing(input: string, onPartialUpdate?: (partial: Partial<PhishAnalysis>) => void): Promise<PhishAnalysis> {
  const model = "gemini-3-flash-preview";
  
  const knowledgeBaseContext = JSON.stringify(KERALA_SCAM_KNOWLEDGE_BASE);
  
  const systemInstruction = `You are "Scam No Jutsu," a world-class specialist in detecting Crypto, Employment, and Get-Rich-Quick scams. Your tone is savvy, direct, and uses modern terminology (HODL, Rug Pull, Honeypot, DM).

  KNOWLEDGE BASE OF LOCAL KERALA SCAMS:
  ${knowledgeBaseContext}
  
  SCAM DETECTION FOCUS:
  1. Crypto/Honeypot: Detect tokens you can buy but can't sell, "hidden" smart contract fees, and fake "insider" tips.
  2. Employment/Money Mule: Flag "Remote Data Entry" jobs that ask for a "security deposit" or use Telegram/WhatsApp for interviews.
  3. Get Rich Quick: Identify "passive income" bots and "Forex/Crypto signals" that guarantee 100% returns.
  4. Gamer & Giveaway: Flag Robux/In-Game currency generators, fake Gift Card surveys, and iPhone giveaways.
  5. Student & Social Media: Flag Scholarship/Internship fraud (asking for fees) and Social Media "Spy" apps (credential stealing).

  RESPONSE STRUCTURE:
  - Scam Score: 0-100%
  - Vibe Check: SAFE, SUS, or SCAM.
  - The Tea (English): Explain the scam using clear logic.
  - മലയാളം വിവരണം: A simple, 'Bro-to-Bro' explanation in Malayalam.
  - Red Flags: List 2 specific red flags found.
  - Action: Tell them exactly what to do.
  
  SPECIALIZATION CHECKS (Include ONLY if relevant):
  - The 'Loot' Check: For Gamer/Giveaway scams.
  - The 'Ambition' Check: For Student/Internship scams.
  - The 'Ego' Check: For Social Media/Spy app scams.

  The response MUST be in JSON format matching the PhishAnalysis interface.`;

  const result = await ai.models.generateContentStream({
    model,
    contents: [{ parts: [{ text: `INPUT TO ANALYZE: "${input}"` }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scamScore: { type: Type.NUMBER, description: "0-100% scam probability" },
          vibeCheck: { type: Type.STRING, enum: ["SAFE", "SUS", "SCAM"] },
          theTea: { type: Type.STRING, description: "The 'Tea' - English analysis" },
          malayalamExplanation: { type: Type.STRING, description: "Malayalam explanation" },
          redFlags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Exactly 2 red flags"
          },
          action: { type: Type.STRING, description: "Action to take" },
          specialCheck: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["LOOT", "AMBITION", "EGO"] },
              label: { type: Type.STRING, description: "e.g. The 'Loot' Check" },
              content: { type: Type.STRING }
            },
            required: ["type", "label", "content"]
          }
        },
        required: ["scamScore", "vibeCheck", "theTea", "malayalamExplanation", "redFlags", "action"]
      }
    }
  });

  let fullText = "";
  for await (const chunk of result) {
    const text = chunk.text;
    if (text) {
      fullText += text;
      
      // Try to parse partial JSON to provide early feedback
      if (onPartialUpdate) {
        try {
          // Very basic partial JSON parsing attempt
          // We look for completed fields in the JSON string
          const partial: Partial<PhishAnalysis> = {};
          
          const scoreMatch = fullText.match(/"scamScore":\s*(\d+)/);
          if (scoreMatch) partial.scamScore = parseInt(scoreMatch[1]);
          
          const vibeMatch = fullText.match(/"vibeCheck":\s*"([^"]+)"/);
          if (vibeMatch) partial.vibeCheck = vibeMatch[1] as any;
          
          const teaMatch = fullText.match(/"theTea":\s*"((?:[^"\\]|\\.)*)"/);
          if (teaMatch) partial.theTea = teaMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
          
          const malMatch = fullText.match(/"malayalamExplanation":\s*"((?:[^"\\]|\\.)*)"/);
          if (malMatch) partial.malayalamExplanation = malMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');

          if (Object.keys(partial).length > 0) {
            onPartialUpdate(partial);
          }
        } catch (e) {
          // Ignore partial parse errors
        }
      }
    }
  }

  try {
    return JSON.parse(fullText || "{}") as PhishAnalysis;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Failed to analyze the input. Please try again.");
  }
}
