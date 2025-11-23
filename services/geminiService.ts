import { GoogleGenAI } from "@google/genai";
import { SearchResult, UserProfile, UserGoals } from "../types";

// Helper to get today's date context
const getContextDate = () => new Date().toLocaleDateString();

const SYSTEM_INSTRUCTION_LOG = `
You are a highly accurate nutritionist assistant. 
Your goal is to analyze food descriptions (text or image) and return structured nutritional data.
Estimate portion sizes sensibly if not specified.
Return ONLY valid JSON.
`;

const SYSTEM_INSTRUCTION_RESEARCH = `
You are a helpful nutrition expert. 
You have access to the user's personal stats, goals, and food logs provided in the context.
ALWAYS use this context to provide personalized advice, referencing their specific intake, goals, and stats where relevant.
Use Google Search to find accurate, up-to-date information about food, diets, and nutrition.
Be concise and factual.
`;

const SYSTEM_INSTRUCTION_PLAN = `
You are an expert sports nutritionist and dietician.
Your goal is to calculate precise metabolic rates and recommend optimal macronutrient splits based on user data.
Return ONLY valid JSON.
`;

// 1. Log Food (Text or Image) -> JSON
export const analyzeFoodLog = async (
  input: string,
  imageBase64?: string
): Promise<SearchResult[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this food intake: "${input}". 
    Return a JSON array of food items identified.
    Each item must follow this structure:
    {
      "foodName": "string",
      "description": "short string with quantity estimation",
      "calories": number,
      "macros": {
        "protein": number,
        "carbs": number,
        "fat": number
      },
      "micronutrients": {
        "fiber": number, // g
        "sugar": number, // g
        "sodium": number, // mg
        "cholesterol": number, // mg
        "potassium": number, // mg
        "saturatedFat": number, // g
        "vitaminA": number, // % DV
        "vitaminC": number, // % DV
        "calcium": number, // % DV
        "iron": number // % DV
      }
    }
  `;

  const parts: any[] = [{ text: prompt }];
  
  if (imageBase64) {
    parts.unshift({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_LOG,
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as SearchResult[];
    }
    return [];
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

// 2. Research/Chat (Search Grounding)
export const searchNutritionInfo = async (query: string, context?: string): Promise<{ text: string, sources: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const content = context 
    ? `CONTEXT ABOUT USER:\n${context}\n\nUSER QUERY: ${query}. Date: ${getContextDate()}`
    : `User Query: ${query}. Date: ${getContextDate()}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use flash with search
      contents: content,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_RESEARCH,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "I couldn't find that information.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract sources
    const sources = chunks
      .map((chunk: any) => chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : null)
      .filter(Boolean);

    return { text, sources };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { text: "Sorry, I encountered an error searching for that.", sources: [] };
  }
};

// 3. Calculate Nutrition Plan
export const calculateNutritionPlan = async (userProfile: UserProfile): Promise<UserGoals> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Calculate the optimal daily nutrition plan for this user:
    ${JSON.stringify(userProfile)}
    
    METHODOLOGY:
    1. Use Mifflin-St Jeor equation for BMR.
    2. Calculate TDEE based on activity level.
    3. Goal Adjustments:
       - Lose weight: -500 kcal deficit
       - Gain muscle: +300 kcal surplus
       - Maintain: 0
    
    PROTEIN CALCULATION RULES:
    - Base requirement: 1g protein per 1kg of body weight.
    - If goal is 'gain_muscle': Increase to 1.6g - 2.2g per kg body weight.
    - If goal is 'lose_weight': Maintain at least 1.2g - 1.5g per kg to preserve muscle.
    - If goal is 'maintain': Use 1g per kg body weight.
    
    Return a JSON object with this exact structure:
    {
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "bmi": number,
      "tdee": number,
      "reasoning": "Explain the protein calculation specifically based on their weight (e.g. 'Since you weigh 70kg, we targeted 1.6g/kg...')"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_PLAN,
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as UserGoals;
    }
    throw new Error("No response generated");
  } catch (error) {
    console.error("Gemini Plan Calc Error:", error);
    // Fallback if API fails
    return {
      calories: 2000,
      protein: userProfile.weight * 1.6, // Default fallback to reasonable active protein
      carbs: 200,
      fat: 65,
      bmi: 0,
      reasoning: "Calculation failed, using defaults based on weight."
    };
  }
};