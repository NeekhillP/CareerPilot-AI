import { GoogleGenAI } from "@google/genai";

export const invokeAI = async (prompt) => {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;

    if(!apiKey){
        throw new Error("GOOGLE_GENAI_API_KEY is not configured");
    }

    const ai = new GoogleGenAI({apiKey});

    const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash-lite",
        input: prompt,
    });

    return interaction.output_text;
}
