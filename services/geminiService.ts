import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Signal, SignalSource } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseSignalFromText = (text: string): Omit<Signal, 'assetName' | 'timestamp' | 'sources'> => {
  // Use case-insensitive flag and make colons optional to handle minor formatting variations from the AI.
  
  // Match "Analysis:" and everything after it until the next label starts, or end of string.
  // The (?=...) is a positive lookahead to not consume the next label.
  const analysisMatch = text.match(/Analysis:?\s*([\s\S]*?)(?=\s*(Entry Price|Stop Loss|Take Profit)|$)/i);

  // Match labels that may or may not have a colon and grab the rest of the line.
  const entryMatch = text.match(/Entry Price:?\s*(.*)/i);
  const stopLossMatch = text.match(/Stop Loss:?\s*(.*)/i);
  const takeProfitMatch = text.match(/Take Profit:?\s*(.*)/i);

  return {
    analysis: analysisMatch ? analysisMatch[1].trim() : 'Could not parse analysis.',
    entry: entryMatch ? entryMatch[1].trim() : 'N/A',
    stopLoss: stopLossMatch ? stopLossMatch[1].trim() : 'N/A',
    takeProfit: takeProfitMatch ? takeProfitMatch[1].trim() : 'N/A',
  };
};

export const generateTradingSignal = async (assetName: string): Promise<Signal> => {
  const prompt = `
    Perform a detailed technical and fundamental analysis for ${assetName} using the most recent web data available.
    This request is for informational and educational purposes ONLY. The output is a hypothetical analysis and MUST NOT be considered financial advice.

    Based on your analysis, provide a summary with the following points, labeled exactly as follows on separate lines:

    Analysis: [A detailed summary of your findings in 2-3 sentences.]
    Entry Price: [A hypothetical price level based on technical indicators.]
    Stop Loss: [A hypothetical price level for risk management.]
    Take Profit: [A hypothetical price level for a target.]

    Strictly adhere to this format. Do not add any other disclaimers, text, or explanations in your response.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const parsedData = parseSignalFromText(response.text);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: SignalSource[] = groundingChunks
        .map((chunk: any) => ({
            title: chunk.web?.title || 'Unknown Source',
            uri: chunk.web?.uri || '#',
        }))
        .filter((source: SignalSource) => source.uri !== '#');

    return {
      ...parsedData,
      assetName,
      sources,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error generating trading signal:", error);
    throw new Error("Failed to get analysis from AI. The model may be overloaded or the content may have been blocked.");
  }
};