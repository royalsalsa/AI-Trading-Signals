import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Signal, SignalSource } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTradingSignal = async (assetName: string): Promise<Signal> => {
  const prompt = `
    Perform a detailed technical and fundamental analysis for ${assetName} using the most recent web data available.
    This request is for informational and educational purposes ONLY. The output is a hypothetical analysis and MUST NOT be considered financial advice.

    Based on your analysis, provide a complete JSON object. The JSON object MUST be the only thing in your response. Do not include any text before or after it, and do not use markdown code fences.

    The JSON object must conform to the following structure:
    {
      "signal": "'BUY' or 'SELL'",
      "price": "string (current real-time market price, from the most up-to-date source found)",
      "analysis": "string (2-3 sentences summary)",
      "entry": "string (hypothetical entry price)",
      "stopLoss": "string (hypothetical stop loss price)",
      "takeProfit": "string (hypothetical take profit price)",
      "pivotPoints": {
        "r3": "string",
        "r2": "string",
        "r1": "string",
        "pp": "string",
        "s1": "string",
        "s2": "string",
        "s3": "string"
      },
      "rsi": {
        "value": 50.00,
        "interpretation": "string ('Neutral', 'Oversold', or 'Overbought')"
      },
      "movingAverages": {
        "ma50": "string (50-day SMA value)",
        "ma200": "string (200-day SMA value)",
        "analysis": "string (brief summary of price vs SMAs)"
      }
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text.trim();
    // Clean potential markdown fences from the response
    const jsonText = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    const parsedData = JSON.parse(jsonText);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: SignalSource[] = groundingChunks
        .map((chunk: any) => ({
            title: chunk.web?.title || 'Unknown Source',
            uri: chunk.web?.uri || '#',
        }))
        .filter((source: SignalSource) => source.uri !== '#');

    // The prompt now requests 'entry', 'stopLoss', etc., which directly matches the Signal type.
    return {
      ...parsedData,
      assetName,
      sources,
      timestamp: new Date().toISOString(),
      pivotPoints: parsedData.pivotPoints || {},
      rsi: parsedData.rsi || { value: 0, interpretation: 'N/A' },
      movingAverages: parsedData.movingAverages || {},
    };
  } catch (error) {
    console.error("Error generating trading signal:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to get valid analysis from AI. The model returned an unexpected format.");
    }
    throw new Error("Failed to get analysis from AI. The model may be overloaded or the content may have been blocked.");
  }
};