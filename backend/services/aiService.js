import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the .env file.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This is a standard model for the conversational chatbot, which doesn't need JSON.
const standardModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- THIS IS THE DEFINITIVE FIX ---
// This model is specifically configured to ONLY output JSON that matches our defined schema.
const jsonModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
  // Safety settings are adjusted to be less restrictive for JSON generation.
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ],
});

/**
 * Provides a conversational response to a user's query.
 */
export const aiChatBot = async (query) => {
  const prompt = `You are a helpful and friendly AI assistant. Answer the following user query in a conversational way. User Query: "${query}"`;
  const result = await standardModel.generateContent(prompt);
  return result.response.text();
};

/**
 * Generates a learning roadmap for a given goal using a strict JSON Schema.
 * @param {string} goal The learning goal.
 * @returns {Promise<object>} A valid roadmap object.
 */
export const generateRoadmap = async (goal) => {
  const prompt = `Create a detailed, 4-step learning roadmap for the goal: "${goal}". You must follow the provided JSON schema precisely.

  The JSON schema is:
  {
    "goal": "string",
    "estimatedDuration": "string",
    "steps": [
      {
        "id": "number",
        "title": "string",
        "duration": "string",
        "description": "string",
        "resources": ["string"]
      }
    ]
  }`;

  try {
    const result = await jsonModel.generateContent(prompt);
    const rawText = result.response.text();
    console.log("Guaranteed AI JSON Response (Roadmap):", rawText);
    return JSON.parse(rawText); // Directly parse the guaranteed JSON response
  } catch (error) {
    console.error("Backend AI Error (Roadmap):", error);
    throw new Error("The AI failed to generate a valid roadmap structure, even with a schema. The model may be temporarily unavailable or the request was blocked.");
  }
};

/**
 * Generates a multiple-choice quiz on a given topic using a strict JSON Schema.
 * @param {string} topic The topic for the quiz.
 * @returns {Promise<object>} A valid quiz object.
 */
export const generateQuiz = async (topic) => {
  // --- THIS IS THE FIX ---
  // Added the specific JSON schema to the prompt to ensure a valid response.
  const prompt = `
    Generate a multiple-choice quiz about: "${topic}".
    It must have exactly 5 questions, and each question must have exactly 4 options.
    You must follow the provided JSON schema precisely.

    The JSON schema is:
    {
      "topic": "string",
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string"
        }
      ]
    }
  `;

  try {
    const result = await jsonModel.generateContent(prompt);
    const rawText = result.response.text();
    console.log("Guaranteed AI JSON Response (Quiz):", rawText);
    return JSON.parse(rawText);
  } catch (error) {
    console.error("Backend AI Error (Quiz):", error);
    throw new Error("The AI failed to generate a valid quiz structure.");
  }
};