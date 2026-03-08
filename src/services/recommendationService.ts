import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getAIRecommendations = async (viewedProductIds: number[], allProducts: Product[]): Promise<Product[]> => {
  if (viewedProductIds.length === 0) return allProducts.slice(0, 4);

  const viewedProducts = allProducts.filter(p => viewedProductIds.includes(p.id));
  const catalogSummary = allProducts.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price }));
  const historySummary = viewedProducts.map(p => ({ name: p.name, category: p.category }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the user's view history: ${JSON.stringify(historySummary)}, 
      recommend 4 product IDs from this catalog: ${JSON.stringify(catalogSummary)}. 
      Return only a JSON array of IDs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.INTEGER }
        }
      }
    });

    const recommendedIds = JSON.parse(response.text || "[]");
    return allProducts.filter(p => recommendedIds.includes(p.id));
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return allProducts.slice(0, 4);
  }
};
