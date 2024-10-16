// app/navComponent/generateTagsFromContent.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

const generateResponse = async (prompt: string) => {
  try {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating response:", error);
  }
};

const generateTitleFromContent = async (content: string) => {
  const prompt = `Based on the following blog content, generate relevant, concise, and SEO-friendly titles. Ensure that the titles are catchy, descriptive, and effectively capture the main topics, themes, and keywords:

    "${content}"
    
    return only one title that best represents the content.
    `;
  const response = await generateResponse(prompt);
  return response;
};

export default generateTitleFromContent;
