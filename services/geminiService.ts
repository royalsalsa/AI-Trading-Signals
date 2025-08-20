import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Signal, SignalSource, NewsArticle } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialNews = async (category: string): Promise<NewsArticle[]> => {
  const prompt = `
    Fetch the top 6 latest and most significant financial news articles for the "${category}" category. If the category is "All", fetch general top financial news. Ensure the news is NO OLDER THAN 12 HOURS.
    This request is for informational and educational purposes ONLY.

    Provide a single, raw, valid JSON array of articles.
    The JSON array MUST be the only thing in your response.
    - Do NOT include any text, explanations, or markdown fences (like \`\`\`json) before or after the JSON array.
    - Ensure all keys and string values are enclosed in double quotes.
    
    The JSON array must conform to the following structure:
    [
      {
        "title": "string (The headline of the news article)",
        "snippet": "string (A 1-2 sentence summary of the article)",
        "url": "string (The direct URL to the original article)",
        "sourceName": "string (The name of the publication, e.g., 'Reuters', 'Bloomberg')"
      }
    ]
  `;

  let responseText = '';
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    if (!response.text) {
      console.error("AI news response was empty or blocked. Full response:", JSON.stringify(response, null, 2));
      throw new Error("Failed to get a valid news response from the AI. The content may have been blocked or the model returned an empty response.");
    }
    
    responseText = response.text.trim();
    
    // Clean up potential markdown fences.
    if (responseText.startsWith("```json")) {
        responseText = responseText.substring(7).trim();
        if (responseText.endsWith("```")) {
            responseText = responseText.slice(0, -3).trim();
        }
    }

    const firstBracket = responseText.indexOf('[');
    const lastBracket = responseText.lastIndexOf(']');
    if (firstBracket === -1 || lastBracket === -1 || lastBracket < firstBracket) {
      throw new Error("No valid JSON array found in the AI response.");
    }
    const jsonText = responseText.substring(firstBracket, lastBracket + 1);
    
    const parsedData = JSON.parse(jsonText);
    
    if (!Array.isArray(parsedData)) {
        throw new Error("AI returned data in an unexpected format (not an array).");
    }

    parsedData.forEach(item => {
        if (typeof item.title !== 'string' || typeof item.snippet !== 'string' || typeof item.url !== 'string' || typeof item.sourceName !== 'string') {
            // Silently filter out malformed objects
            console.warn("Filtered out a malformed article object from AI response:", item);
            return;
        }
    });

    return parsedData.filter(item => item.title && item.url) as NewsArticle[];
  } catch (error) {
    console.error("Error fetching financial news:", error);
    if (responseText) {
        console.error("Problematic AI response text for news:", responseText);
    }
    if (error instanceof SyntaxError) {
        throw new Error("Failed to get valid news from AI. The model returned an unexpected format.");
    }
    throw new Error("Failed to get news from AI. The model may be overloaded or the content may have been blocked.");
  }
};

export const generateTradingSignal = async (assetName: string): Promise<Signal> => {
  const prompt = `
    Perform a detailed multi-dimensional trading analysis for ${assetName}.
    It is CRITICAL that you use real-time web data from a variety of reliable financial sources (news sites, market data providers) and that the information used is NO OLDER THAN 12 HOURS.
    Your analysis must synthesize this recent data to form a cohesive trading strategy.
    
    This request is for informational and educational purposes ONLY. The output is a hypothetical analysis and MUST NOT be considered financial advice.

    Based on your analysis, provide a single, raw, valid JSON object.
    The JSON object MUST be the only thing in your response.
    - Do NOT include any text, explanations, or markdown fences (like \`\`\`json) before or after the JSON object.
    - Ensure all keys and string values are enclosed in double quotes.
    - Ensure multi-line text within string values is properly escaped (e.g., using \\n).
    - Do not use trailing commas.
    - Do not include comments in the JSON.

    The JSON object must conform to the following structure:
    {
      "direction": "'Sell' or 'Buy'",
      "confidence": "number (an integer between 70 and 95 representing the confidence in this signal)",
      "entryPrice": "string (hypothetical entry price, e.g., '3320.1')",
      "tp1": "string (hypothetical first take profit price, e.g., '3309.6')",
      "tp2": "string (hypothetical second take profit price, e.g., '3304.9')",
      "sl": "string (hypothetical stop loss price, e.g., '3328.5')",
      "pivotPoints": {
        "r2": "string (Resistance 2 price level)",
        "r1": "string (Resistance 1 price level)",
        "pivot": "string (Main pivot price level)",
        "s1": "string (Support 1 price level)",
        "s2": "string (Support 2 price level)"
      },
      "rsi": {
        "value": "number (The 14-period RSI value, e.g., 65.4)",
        "interpretation": "'Overbought', 'Oversold', or 'Neutral'"
      },
      "sma": {
        "sma20": "string (20-period Simple Moving Average price)",
        "sma50": "string (50-period Simple Moving Average price)",
        "sma100": "string (100-period Simple Moving Average price)"
      },
      "strategyDescription": "string (A 3-4 paragraph detailed analysis of the trading strategy, covering technical and fundamental aspects. Use \\n for new paragraphs. Crucially, you MUST cite the web sources you used for your analysis by adding citation markers in the text, like [1] or [2, 3]. The citations should correspond to the order of the sources provided in the grounding metadata.)",
      "riskTip": "string (A 1-2 paragraph tip about the risks involved or key things to watch out for. Use \\n for new paragraphs. Also include citations like [1], [2, 3] where appropriate.)"
    }
  `;

  let responseText = '';
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    if (!response.text) {
        console.error("AI signal response was empty or blocked. Full response:", JSON.stringify(response, null, 2));
        throw new Error("Failed to get a valid analysis from AI. The content may have been blocked or the model returned an empty response.");
    }
    
    responseText = response.text.trim();
    
    // Clean up potential markdown fences.
    if (responseText.startsWith("```json")) {
        responseText = responseText.substring(7).trim();
        if (responseText.endsWith("```")) {
            responseText = responseText.slice(0, -3).trim();
        }
    }

    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
      throw new Error("No valid JSON object found in the AI response.");
    }
    const jsonText = responseText.substring(firstBrace, lastBrace + 1);


    const parsedData = JSON.parse(jsonText);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: SignalSource[] = groundingChunks
        .map((chunk: any) => ({
            title: chunk.web?.title || 'Unknown Source',
            uri: chunk.web?.uri || '#',
        }))
        .filter((source: SignalSource) => source.uri !== '#');

    return {
      assetName,
      updateTime: new Date().toISOString(),
      sources,
      direction: parsedData.direction,
      confidence: parsedData.confidence,
      entryPrice: parsedData.entryPrice,
      tp1: parsedData.tp1,
      tp2: parsedData.tp2,
      sl: parsedData.sl,
      strategyDescription: parsedData.strategyDescription,
      riskTip: parsedData.riskTip,
      pivotPoints: parsedData.pivotPoints,
      rsi: parsedData.rsi,
      sma: parsedData.sma,
    };
  } catch (error) {
    console.error("Error generating trading signal:", error);
    if (responseText) {
        console.error("Problematic AI response text:", responseText);
    }
    if (error instanceof SyntaxError) {
        throw new Error("Failed to get valid analysis from AI. The model returned an unexpected format.");
    }
    throw new Error("Failed to get analysis from AI. The model may be overloaded or the content may have been blocked.");
  }
};