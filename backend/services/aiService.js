import { HfInference } from "@huggingface/inference";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.HF_TOKEN) {
  throw new Error("HF_TOKEN is not defined in the .env file.");
}

const hf = new HfInference(process.env.HF_TOKEN);

// Using a recommended model for chat/instruction-following tasks
const model = "mistralai/Mixtral-8x7B-Instruct-v0.1";

/**
 * Provides a conversational response to a user's query.
 */
export const aiChatBot = async (query) => {
  try {
    const result = await hf.chatCompletion({
      model: model,
      messages: [
        { role: "system", content: "You are a helpful and friendly AI assistant." },
        { role: "user", content: query }
      ],
      max_tokens: 500,
    });
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Backend AI Error (Chat):", error);
    throw new Error("The AI failed to generate a chat response. The model may be temporarily unavailable.");
  }
};

/**
 * Generates a learning roadmap for a given goal.
 * @param {string} goal The learning goal.
 * @returns {Promise<object>} A valid roadmap object.
 */
export const generateRoadmap = async (goal) => {
  const prompt = `Create a detailed, 4-step learning roadmap for the goal: "${goal}". You must respond with only the raw JSON object, without any surrounding text, explanations, or markdown formatting.

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
    const result = await hf.chatCompletion({
      model: model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
    });

    const responseText = result.choices[0].message.content;
    const jsonResponse = responseText.substring(responseText.indexOf('{'));
    return JSON.parse(jsonResponse);
  } catch (error) {
    console.error("Backend AI Error (Roadmap):", error);
    throw new Error("The AI failed to generate a valid roadmap. The model may be temporarily unavailable.");
  }
};

/**
 * Generates a multiple-choice quiz on a given topic.
 * @param {string} topic The topic for the quiz.
 * @returns {Promise<object>} A valid quiz object.
 */
export const generateQuiz = async (topic) => {
  const prompt = `
    Generate a multiple-choice quiz about: "${topic}".
    It must have exactly 5 questions, and each question must have exactly 4 options.
    You must respond with only the raw JSON object, without any surrounding text, explanations, or markdown formatting.

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
    const result = await hf.chatCompletion({
      model: model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
    });
    
    const responseText = result.choices[0].message.content;
    const jsonResponse = responseText.substring(responseText.indexOf('{'));
    return JSON.parse(jsonResponse);
  } catch (error) {
    console.error("Backend AI Error (Quiz):", error);
    throw new Error("The AI failed to generate a valid quiz structure.");
  }
};