

import { GoogleGenAI, Type } from "@google/genai";
import { Doctor, GroundingSource, Patient } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getSpecialtySuggestion = async (patient: Patient): Promise<string> => {
  try {
    const prompt = `A patient provides the following information:
- Symptoms: "${patient.symptoms}"
- Past Medical Conditions: "${patient.pastConditions || 'None'}"
- Previous Surgeries: "${patient.surgeries || 'None'}"
- Current Medications: "${patient.medications || 'None'}"

Based on all this information, what is the most likely medical specialty they should see? Respond with only the name of the specialty (e.g., 'Cardiology', 'Dermatology', 'Neurology'). Do not add any formatting or explanation.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching specialty suggestion:", error);
    throw new Error("Failed to get specialty suggestion from AI.");
  }
};

export const getDoctorSuggestions = async (
    specialty: string,
    latitude: number,
    longitude: number
): Promise<{ doctors: Doctor[], sources: GroundingSource[] }> => {
    try {
        const prompt = `Find 3 real doctors specializing in '${specialty}' near latitude ${latitude}, longitude ${longitude}. Use the tools available to find real-world places. Respond with a JSON array of objects, where each object has 'name', 'specialty' (which should be '${specialty}'), 'clinicName', 'address', 'rating' (a number between 3.5 and 5.0), 'photoUrl' (a publicly accessible URL to a professional-looking photo if available), and 'bio' (a short biography of 1-2 sentences if available). The response should be only the valid JSON array. Do not include any other text or markdown formatting.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: latitude,
                            longitude: longitude
                        }
                    }
                }
            }
        });

        // The model may sometimes wrap the JSON in markdown, so we extract it.
        const textResponse = response.text.trim();
        const jsonMatch = textResponse.match(/```(json)?\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[2] : textResponse;
        
        const doctorsJson = JSON.parse(jsonString);
        
        const sources: GroundingSource[] = [];
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

        if (groundingChunks) {
            for (const chunk of groundingChunks) {
                if (chunk.maps) {
                    sources.push({
                        uri: chunk.maps.uri,
                        title: chunk.maps.title,
                    });
                }
            }
        }
        
        return { doctors: doctorsJson as Doctor[], sources };
    } catch (error) {
        console.error("Error fetching doctor suggestions with Maps:", error);
        throw new Error("Failed to get doctor suggestions from AI with Maps data.");
    }
};