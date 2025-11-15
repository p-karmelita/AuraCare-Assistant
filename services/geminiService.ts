

import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Doctor, GroundingSource, Patient, SpecialtyResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

let chat: Chat | null = null;

const getChatSession = () => {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'You are AuraCare Assistant, a friendly and helpful AI chatbot. Your purpose is to answer general health-related questions. You must not provide medical advice, diagnoses, or treatment plans. If a user asks for medical advice, you must gently decline and recommend they consult a qualified healthcare professional. Keep your answers concise and easy to understand.',
            },
        });
    }
    return chat;
}

export const getSpecialtySuggestion = async (patient: Patient): Promise<SpecialtyResponse> => {
  try {
    const prompt = `A patient provides the following information:
- Symptoms: "${patient.symptoms}"
- Past Medical Conditions: "${patient.pastConditions || 'None'}"
- Previous Surgeries: "${patient.surgeries || 'None'}"
- Current Medications: "${patient.medications || 'None'}"

Based on all this information, determine the most likely medical specialty they should see. 
Respond with a single, valid JSON object with two keys:
1. "specialty": A string containing only the name of the recommended medical specialty (e.g., "Cardiology").
2. "analysis": A string containing a detailed, paragraph-long explanation for why this specialty was chosen, based on the provided symptoms and medical history.

Do not include any other text, markdown formatting, or explanation outside of the JSON object.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    specialty: { type: Type.STRING },
                    analysis: { type: Type.STRING }
                },
                required: ['specialty', 'analysis']
            }
        }
    });

    let jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as SpecialtyResponse;

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

export const getChatbotResponse = async (message: string): Promise<string> => {
    try {
        const chatSession = getChatSession();
        const response = await chatSession.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error fetching chatbot response:", error);
        throw new Error("Failed to get response from AuraCare Assistant.");
    }
};