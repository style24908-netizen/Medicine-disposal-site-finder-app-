
import { GoogleGenAI, Type } from "@google/genai";
import type { Coordinates } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getCoordinatesForAddress = async (address: string): Promise<Coordinates | null> => {
  if (!process.env.API_KEY) {
    console.error("API key is not set.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Given the address "${address}" in South Korea, provide its latitude and longitude.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    lat: { type: Type.NUMBER, description: "Latitude of the address" },
                    lng: { type: Type.NUMBER, description: "Longitude of the address" }
                }
            }
        }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && typeof result.lat === 'number' && typeof result.lng === 'number') {
      return result as Coordinates;
    }
    return null;

  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
};
